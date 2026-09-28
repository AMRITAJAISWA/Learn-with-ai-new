export const DEFAULT_GROQ_MODELS = [
  process.env.GROQ_MODEL,
  "qwen/qwen3.8-27b",
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
  "llama-3.3-70b-versatile",
].filter(Boolean) as string[];

export function getGroqApiKey(): string | null {
  const key = process.env.GROQ_API_KEY;
  return key && key.trim() !== "" ? key.trim() : null;
}

export interface GroqGenerateOptions {
  systemPrompt?: string;
  userPrompt: string;
  temperature?: number;
  responseFormatJson?: boolean;
  maxTokens?: number;
}

/**
 * Direct Groq Cloud inference with automatic multi-model fallback.
 */
export async function generateWithGroq(
  options: GroqGenerateOptions
): Promise<string | null> {
  const apiKey = getGroqApiKey();
  if (!apiKey) return null;

  const messages: { role: string; content: string }[] = [];
  if (options.systemPrompt) {
    messages.push({ role: "system", content: options.systemPrompt });
  }
  messages.push({ role: "user", content: options.userPrompt });

  for (const model of DEFAULT_GROQ_MODELS) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: options.temperature ?? 0.5,
          max_tokens: options.maxTokens ?? 850,
          ...(options.responseFormatJson ? { response_format: { type: "json_object" } } : {}),
        }),
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        let content = data.choices?.[0]?.message?.content;
        if (content) {
          // Remove internal reasoning tokens if present
          content = content.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
          if (content.length > 0) {
            return content;
          }
        }
      } else {
        const errorText = await response.text();
        console.warn(`Groq API model ${model} error:`, response.status, errorText);
      }
    } catch (err) {
      console.warn(`Groq Cloud generation failed for model ${model}:`, err);
    }
  }

  return null;
}
