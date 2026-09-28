import { generateWithGemini, getGeminiApiKey } from "./gemini";
import { callLlmApi } from "./llmClient";

export interface LessonGenerationInput {
  topicTitle: string;
  moduleTitle?: string;
  courseTitle?: string;
  skillLevel?: string;
}

export interface GeneratedLessonResponse {
  textBasedContent: string;
  codeSnippet: string;
  commonMistakes: string[];
  keyTakeaways: string[];
}

function cleanAndParseJson(raw: string): any {
  let str = raw.trim();
  const fenceMatch = str.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (fenceMatch) {
    str = fenceMatch[1].trim();
  }
  const firstBrace = str.indexOf("{");
  const lastBrace = str.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1) {
    str = str.substring(firstBrace, lastBrace + 1);
  }
  return JSON.parse(str);
}

export async function generateLessonWithAI(
  input: LessonGenerationInput
): Promise<GeneratedLessonResponse> {
  const { topicTitle, moduleTitle = "Core Module", courseTitle = "Computer Science", skillLevel = "Beginner" } = input;

  const systemPrompt = `You are an elite educational writer for LearnWithAI.
Your mission is to generate a comprehensive, highly readable, structured conceptual lesson for students.

CRITICAL FORMATTING GUIDELINES FOR READING-FRIENDLY OUTPUT:
- Structure the "textBasedContent" with clear markdown headings and bullet points:
  ## 📌 Concept Overview & Definition
  (Clear, conversational definition in simple, powerful terms)

  ## 💡 Real-World Analogy
  (An everyday real-world comparison that makes the concept instantly click)

  ## ⚙️ How It Works: Step-by-Step Mechanics
  (Breakdown of core principles, execution flow, or components using clean bullet points)

  ## 🎯 Why It Matters & Practical Value
  (Why professionals use it, trade-offs, and architectural benefits)

- NO PROGRAMMING CODE: Do not write code snippets or syntax. Keep it purely conceptual and focused on mental models.
- Ensure natural paragraph rhythm with bold emphasis for key terminology.

Return STRICTLY valid JSON conforming to this schema without code fences around it:
{
  "textBasedContent": "Full structured markdown lesson with the sections above",
  "codeSnippet": "",
  "commonMistakes": [
    "Misconception 1: clear explanation",
    "Misconception 2: clear explanation",
    "Misconception 3: clear explanation"
  ],
  "keyTakeaways": [
    "Takeaway 1: core takeaway",
    "Takeaway 2: core takeaway",
    "Takeaway 3: core takeaway"
  ]
}`;

  const userPrompt = `Generate a structured, reading-friendly conceptual lesson (NO code) for:
- Course: ${courseTitle}
- Module: ${moduleTitle}
- Topic: ${topicTitle}
- Target Level: ${skillLevel}`;

  let llmResponse: string | null = null;

  // 1. Fast, robust LLM inference (Groq with multi-model fallback, then Gemini)
  llmResponse = await callLlmApi({
    systemPrompt,
    userPrompt,
    temperature: 0.4,
    responseFormatJson: true,
  });

  // 2. Direct Gemini fallback if needed
  if (!llmResponse && getGeminiApiKey()) {
    try {
      llmResponse = await generateWithGemini({
        systemPrompt,
        userPrompt,
        temperature: 0.4,
        responseFormatJson: true,
      });
    } catch (err) {
      console.warn("Direct Gemini lesson generation fallback failed:", err);
    }
  }

  if (llmResponse) {
    try {
      const parsed = cleanAndParseJson(llmResponse);
      if (parsed.textBasedContent && Array.isArray(parsed.keyTakeaways)) {
        return {
          textBasedContent: parsed.textBasedContent,
          codeSnippet: "",
          commonMistakes: parsed.commonMistakes || [
            "Confusing this concept with related foundational principles.",
            "Overlooking how core definitions apply in real-world scenarios.",
          ],
          keyTakeaways: parsed.keyTakeaways || [
            `Understanding the clear definition of ${topicTitle}.`,
            "Connecting the theoretical foundations with practical intuition.",
          ],
        };
      }
    } catch (e) {
      console.warn("Failed to parse Gemini lesson JSON, generating intelligent fallback:", e);
    }
  }

  // Pure conceptual definition fallback (no code)
  return generateHeuristicLesson(topicTitle, moduleTitle, courseTitle);
}

function generateHeuristicLesson(
  topicTitle: string,
  moduleTitle: string,
  courseTitle: string
): GeneratedLessonResponse {
  const isJava = courseTitle.toLowerCase().includes("java") || topicTitle.toLowerCase().includes("java");
  const isPython = courseTitle.toLowerCase().includes("python") || topicTitle.toLowerCase().includes("python");

  if (isJava) {
    return {
      textBasedContent: `### ☕ Topic Overview: ${topicTitle}

#### 1. Core Definition
**${topicTitle}** defines how execution instructions and data values are managed, evaluated, and organized in memory. Rather than simply running commands sequentially, control flow structures direct decision-making and repetitive actions according to clear business constraints.

---

#### 2. Key Conceptual Principles
* **Predictable Execution**: Rules determine which path is executed based on boolean evaluations, eliminating ambiguity.
* **Scope & Lifetime**: Variables and data references exist only within their designated functional blocks, preventing unintended data leaks.
* **Clean Branching**: Clear conditional definitions make logic readable, auditable, and resilient to edge-case errors.

---

#### 3. Real-World Analogy
Think of this like an automated railway switching station: trains (data instructions) arrive along a track, and signals (conditions) switch the junction to route each train safely to its intended platform without collisions.`,
      codeSnippet: "",
      commonMistakes: [
        "Confusing reference equality with value equivalence.",
        "Overcomplicating conditional paths instead of defining concise boundary rules.",
        "Failing to account for unexpected null or boundary conditions.",
      ],
      keyTakeaways: [
        `Clear definition and purpose of ${topicTitle}.`,
        "Organizing conditional logic for readability and maintainability.",
        "Understanding how state transitions impact system predictability.",
      ],
    };
  }

  // Default clean educational structure (pure definition, no code)
  return {
    textBasedContent: `### 📌 Topic Overview: ${topicTitle}

#### 1. Core Definition
**${topicTitle}** represents a fundamental pillar within **${moduleTitle}**. At its core, it establishes the formal rules, boundaries, and mechanisms for how components interact and achieve predictable outcomes within **${courseTitle}**.

---

#### 2. Why This Topic Matters
* **Conceptual Foundation**: It provides the mental model necessary to break down complex problems into manageable elements.
* **Clarity & Architecture**: Understanding the definition prevents misconceptions when designing larger software systems.
* **Analytical Thinking**: Helps reason about edge cases, trade-offs, and operational guarantees.

---

#### 3. Real-World Intuition
Imagine an architectural blueprint: before laying down materials, you define structural load paths and safety margins. Similarly, this concept sets the structural rules that guide proper system behavior.`,
    codeSnippet: "",
    commonMistakes: [
      `Treating ${topicTitle} as an isolated mechanism instead of part of the broader system.`,
      "Skipping core foundational definitions before attempting advanced applications.",
      "Overlooking basic boundary conditions and edge cases.",
    ],
    keyTakeaways: [
      `Precise conceptual definition of ${topicTitle}.`,
      "Core theoretical principles and mental models.",
      "Understanding real-world trade-offs and structural constraints.",
    ],
  };
}
