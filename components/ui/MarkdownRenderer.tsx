"use client";

import React, { useState } from "react";
import { Check, Copy, Terminal, Info } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * High-readability Markdown & Rich Text Renderer
 * Transforms raw AI output into clean, beautifully structured, reading-friendly content.
 */
export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  if (!content) return null;

  // Split into blocks by double newlines or code fences
  const blocks = parseMarkdownBlocks(content);

  return (
    <div className={`space-y-3 leading-relaxed text-slate-800 ${className}`}>
      {blocks.map((block, idx) => (
        <BlockRenderer key={idx} block={block} />
      ))}
    </div>
  );
}

type BlockType =
  | { type: "code"; language: string; code: string }
  | { type: "heading"; level: number; text: string }
  | { type: "hr" }
  | { type: "blockquote"; text: string }
  | { type: "unordered-list"; items: string[] }
  | { type: "ordered-list"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "paragraph"; text: string };

function parseMarkdownBlocks(raw: string): BlockType[] {
  const blocks: BlockType[] = [];
  const lines = raw.replace(/\r\n/g, "\n").split("\n");
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // 1. Code Fence (```)
    if (line.trim().startsWith("```")) {
      const language = line.trim().replace(/^```/, "").trim() || "code";
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      blocks.push({
        type: "code",
        language,
        code: codeLines.join("\n"),
      });
      continue;
    }

    // 2. Horizontal Rule (---, ***)
    if (/^(\s*[-*_]\s*){3,}$/.test(line)) {
      blocks.push({ type: "hr" });
      i++;
      continue;
    }

    // 3. Headings (#, ##, ###, ####)
    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      blocks.push({
        type: "heading",
        level: headingMatch[1].length,
        text: headingMatch[2].trim(),
      });
      i++;
      continue;
    }

    // 4. Blockquote (> ...)
    if (line.trim().startsWith(">")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quoteLines.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      blocks.push({
        type: "blockquote",
        text: quoteLines.join("\n").trim(),
      });
      continue;
    }

    // 5. Table (| ... |)
    if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }

      if (tableLines.length >= 2) {
        const parseRow = (r: string) =>
          r
            .split("|")
            .slice(1, -1)
            .map((c) => c.trim());

        const headers = parseRow(tableLines[0]);
        // line 1 is usually separator |---|---|
        const rows = tableLines.slice(2).map(parseRow);

        blocks.push({
          type: "table",
          headers,
          rows,
        });
        continue;
      }
    }

    // 6. Unordered List (*, -, •)
    if (/^\s*[-*•]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*•]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*•]\s+/, "").trim());
        i++;
      }
      blocks.push({
        type: "unordered-list",
        items,
      });
      continue;
    }

    // 7. Ordered List (1., 2., etc.)
    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, "").trim());
        i++;
      }
      blocks.push({
        type: "ordered-list",
        items,
      });
      continue;
    }

    // 8. Paragraph (skip pure blank lines)
    if (!line.trim()) {
      i++;
      continue;
    }

    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith("```") &&
      !lines[i].match(/^#{1,6}\s+/) &&
      !lines[i].trim().startsWith(">") &&
      !/^\s*[-*•]\s+/.test(lines[i]) &&
      !/^\s*\d+\.\s+/.test(lines[i]) &&
      !/^(\s*[-*_]\s*){3,}$/.test(lines[i])
    ) {
      paraLines.push(lines[i]);
      i++;
    }

    if (paraLines.length > 0) {
      blocks.push({
        type: "paragraph",
        text: paraLines.join(" "),
      });
    }
  }

  return blocks;
}

function BlockRenderer({ block }: { block: BlockType }) {
  if (block.type === "heading") {
    switch (block.level) {
      case 1:
        return (
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-5 mb-3 pb-2 border-b border-slate-200">
            <InlineText text={block.text} />
          </h1>
        );
      case 2:
        return (
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 mt-4 mb-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-sky-500 inline-block" />
            <InlineText text={block.text} />
          </h2>
        );
      case 3:
        return (
          <h3 className="text-sm sm:text-base font-bold text-sky-800 mt-3 mb-1.5">
            <InlineText text={block.text} />
          </h3>
        );
      default:
        return (
          <h4 className="text-xs sm:text-sm font-bold text-slate-800 mt-2 mb-1">
            <InlineText text={block.text} />
          </h4>
        );
    }
  }

  if (block.type === "hr") {
    return <hr className="my-4 border-slate-200" />;
  }

  if (block.type === "code") {
    return <CodeBlock language={block.language} code={block.code} />;
  }

  if (block.type === "blockquote") {
    return (
      <div className="my-3 rounded-2xl border-l-4 border-sky-500 bg-sky-50/80 p-3.5 sm:p-4 text-xs sm:text-sm text-slate-800 shadow-2xs">
        <div className="flex items-start gap-2.5">
          <Info className="h-4 w-4 text-sky-600 mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <InlineText text={block.text} />
          </div>
        </div>
      </div>
    );
  }

  if (block.type === "unordered-list") {
    return (
      <ul className="my-2 space-y-1.5 pl-1 text-xs sm:text-sm">
        {block.items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2.5 text-slate-700 leading-relaxed">
            <span className="text-sky-500 font-bold select-none text-base leading-none mt-0.5">•</span>
            <span className="flex-1">
              <InlineText text={item} />
            </span>
          </li>
        ))}
      </ul>
    );
  }

  if (block.type === "ordered-list") {
    return (
      <ol className="my-2 space-y-2 pl-1 text-xs sm:text-sm">
        {block.items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2.5 text-slate-700 leading-relaxed">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-sky-100 text-sky-800 text-[10px] font-bold flex-shrink-0 mt-0.5">
              {idx + 1}
            </span>
            <span className="flex-1">
              <InlineText text={item} />
            </span>
          </li>
        ))}
      </ol>
    );
  }

  if (block.type === "table") {
    return (
      <div className="my-3 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-2xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-900 font-bold">
              {block.headers.map((h, i) => (
                <th key={i} className="p-3 font-semibold">
                  <InlineText text={h} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {block.rows.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-slate-50/60 transition-colors">
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="p-3 text-slate-700">
                    <InlineText text={cell} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed my-1.5">
      <InlineText text={block.text} />
    </p>
  );
}

function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-md">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-slate-800 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-sky-400" />
          <span className="font-mono text-[11px] font-semibold uppercase text-slate-300">
            {language}
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 hover:text-white transition-colors"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

/**
 * Parses inline formatting:
 * **bold**, *italic*, `code`, and [link](url)
 */
function InlineText({ text }: { text: string }) {
  if (!text) return null;

  // Tokenize regex for inline elements
  const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`|\[.*?\]\(.*?\))/g;
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) => {
        if (!part) return null;

        // **Bold**
        if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
          return (
            <strong key={index} className="font-bold text-slate-900">
              {part.slice(2, -2)}
            </strong>
          );
        }

        // *Italic*
        if (part.startsWith("*") && part.endsWith("*") && part.length >= 2) {
          return (
            <em key={index} className="italic text-slate-800">
              {part.slice(1, -1)}
            </em>
          );
        }

        // `Inline Code`
        if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
          return (
            <code
              key={index}
              className="rounded-md bg-slate-100 border border-slate-200 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-sky-700"
            >
              {part.slice(1, -1)}
            </code>
          );
        }

        // [Link](url)
        const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
        if (linkMatch) {
          return (
            <a
              key={index}
              href={linkMatch[2]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-600 font-semibold underline hover:text-sky-800"
            >
              {linkMatch[1]}
            </a>
          );
        }

        return <span key={index}>{part}</span>;
      })}
    </>
  );
}
