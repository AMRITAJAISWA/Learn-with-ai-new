import { CourseData, ModuleData } from "@/lib/db/store";
import { generateWithGemini, getGeminiApiKey } from "./gemini";
import { callLlmApi } from "./llmClient";

export interface CourseGenerationInput {
  goal: string;
  skillLevel: "Beginner" | "Intermediate" | "Advanced";
  availableTime: string;
  duration: string;
  target?: string;
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

export async function generateCourseWithAI(
  input: CourseGenerationInput
): Promise<CourseData> {
  const { goal, skillLevel, availableTime, duration, target = "Skill development" } = input;

  const systemPrompt = `You are the chief educational curriculum architect for LearnWithAI, powered by Google Gemini API.
Your mission is to dynamically generate a comprehensive, personalized course outline based on student input.

CRITICAL REQUIREMENTS:
- EACH TOPIC MUST HAVE ONLY:
  1. "title": The clear topic name.
  2. "summary": A crystal-clear, high-yield definition and conceptual explanation of what this topic is and why it matters.
- NO CODE: Do NOT include any programming code, syntax snippets, or code blocks anywhere.
- Keep the outline clean, structured, and focused purely on conceptual definitions, core fundamentals, and real-world understanding.

Return STRICTLY valid JSON conforming to this TypeScript schema without any markdown code fences or surrounding text:
{
  "title": string,
  "description": string,
  "category": string,
  "estimatedHours": number,
  "targetOutcome": string,
  "learningSequence": string[],
  "prerequisites": string[],
  "modules": [
    {
      "order": number,
      "title": string,
      "description": string,
      "topics": [
        {
          "order": number,
          "title": string,
          "summary": string,
          "estimatedMinutes": number,
          "keyTakeaways": string[]
        }
      ]
    }
  ]
}`;

  const userPrompt = `Generate a personalized course outline with topic names and definitions (no code) for:
Goal: ${goal}
Current Skill Level: ${skillLevel}
Available Study Time: ${availableTime}
Planned Duration: ${duration}
Target Outcome: ${target}`;

  let llmResponse: string | null = null;

  // 1. Fast, robust LLM inference (Groq with multi-model fallback, then Gemini)
  llmResponse = await callLlmApi({
    systemPrompt,
    userPrompt,
    responseFormatJson: true,
    temperature: 0.4,
  });

  // 2. Direct Gemini fallback if needed
  if (!llmResponse && getGeminiApiKey()) {
    try {
      llmResponse = await generateWithGemini({
        systemPrompt,
        userPrompt,
        responseFormatJson: true,
        temperature: 0.4,
      });
    } catch (err) {
      console.warn("Direct Gemini course generation error, trying fallback:", err);
    }
  }

  if (llmResponse) {
    try {
      const parsed = cleanAndParseJson(llmResponse);
      return {
        id: `course_${Date.now()}`,
        title: parsed.title || `${goal} Masterclass`,
        description: parsed.description || `Comprehensive personalized guide to ${goal}.`,
        category: parsed.category || "Technology & Computing",
        skillLevel,
        estimatedHours: parsed.estimatedHours || 20,
        targetOutcome: parsed.targetOutcome || target,
        completionPct: 0,
        isCompleted: false,
        learningSequence: parsed.learningSequence || [],
        prerequisites: parsed.prerequisites || [],
        createdAt: new Date().toISOString(),
        modules: (parsed.modules || []).map((m: any, mIdx: number) => ({
          id: `mod_${Date.now()}_${mIdx}`,
          order: m.order || mIdx + 1,
          title: m.title,
          description: m.description,
          topics: (m.topics || []).map((t: any, tIdx: number) => ({
            id: `top_${Date.now()}_${mIdx}_${tIdx}`,
            order: t.order || tIdx + 1,
            title: t.title,
            summary: t.summary,
            estimatedMinutes: t.estimatedMinutes || 30,
            status: "NOT_STARTED",
            keyTakeaways: t.keyTakeaways || [],
          })),
        })),
      };
    } catch (e) {
      console.warn("Error parsing LLM course JSON, falling back to neural template generator:", e);
    }
  }

  // Realistic fallback customized to user's goal and skill level
  return generateMockPersonalizedCourse(input);
}

function generateMockPersonalizedCourse(input: CourseGenerationInput): CourseData {
  const { goal, skillLevel, duration, target = "Skill development" } = input;
  const courseId = `course_${Date.now()}`;

  const cleanGoal = goal.trim() || "Full Stack Engineering & AI";

  const moduleTemplates: ModuleData[] = [
    {
      id: `mod_${Date.now()}_1`,
      order: 1,
      title: `${cleanGoal} Fundamentals & Principles`,
      description: `Core concepts, syntax, environment setup, and baseline mental models tailored for ${skillLevel} students.`,
      topics: [
        {
          id: `top_${Date.now()}_1_1`,
          order: 1,
          title: `Foundations of ${cleanGoal}: Core Primitives & Syntax`,
          summary: `Comprehensive breakdown of foundational principles, architectural diagrams, and memory lifecycle.`,
          estimatedMinutes: 30,
          status: "NOT_STARTED",
          keyTakeaways: [
            "Baseline vocabulary and execution models",
            "Environment configuration and tooling",
          ],
        },
        {
          id: `top_${Date.now()}_1_2`,
          order: 2,
          title: "Control Flow, Data Handling & Best Practices",
          summary: "Branching strategies, iteration patterns, and type safety guidelines.",
          estimatedMinutes: 35,
          status: "NOT_STARTED",
          keyTakeaways: [
            "Writing idiomatic and DRY code",
            "Error boundaries and edge-case handling",
          ],
        },
      ],
    },
    {
      id: `mod_${Date.now()}_2`,
      order: 2,
      title: `Applied Architectures & Problem Solving in ${cleanGoal}`,
      description: `Structuring complex workflows, state management, and algorithmic thinking.`,
      topics: [
        {
          id: `top_${Date.now()}_2_1`,
          order: 1,
          title: "Modular Design Patterns & Component Boundaries",
          summary: "Decoupling logic, separation of concerns, and design patterns.",
          estimatedMinutes: 40,
          status: "NOT_STARTED",
          keyTakeaways: [
            "Encapsulation and API contracts",
            "Asynchronous event handling",
          ],
        },
        {
          id: `top_${Date.now()}_2_2`,
          order: 2,
          title: "Performance Optimization & Profiling",
          summary: "Benchmarking execution, memory leaks, and profiling tools.",
          estimatedMinutes: 45,
          status: "NOT_STARTED",
          keyTakeaways: [
            "Identifying bottlenecks before optimization",
            "Algorithmic efficiency and Big O analysis",
          ],
        },
      ],
    },
    {
      id: `mod_${Date.now()}_3`,
      order: 3,
      title: `Capstone Implementation & Real-World Portfolio Project`,
      description: `Synthesizing everything learned to build an enterprise-grade application for ${target}.`,
      topics: [
        {
          id: `top_${Date.now()}_3_1`,
          order: 1,
          title: `Architecture Setup for ${cleanGoal} Capstone`,
          summary: "Configuring production repositories, continuous testing, and scalable architecture.",
          estimatedMinutes: 50,
          status: "NOT_STARTED",
          keyTakeaways: [
            "Project scaffolding and testing harness",
            "Schema definition and deployment pipelines",
          ],
        },
        {
          id: `top_${Date.now()}_3_2`,
          order: 2,
          title: "Final Deployment, Verification & Interview Talking Points",
          summary: "Presenting the project, documenting design decisions, and answering technical questions.",
          estimatedMinutes: 45,
          status: "NOT_STARTED",
          keyTakeaways: [
            "Structuring case studies and portfolios",
            "Handling technical deep-dive queries",
          ],
        },
      ],
    },
  ];

  return {
    id: courseId,
    title: `${cleanGoal} Mastery Roadmap`,
    description: `A custom-tailored curriculum designed to take you from ${skillLevel} to expert in ${duration}. Optimized for ${target}.`,
    category: "Personalized AI Path",
    skillLevel,
    estimatedHours: 18,
    targetOutcome: target,
    completionPct: 0,
    isCompleted: false,
    learningSequence: [
      `Module 1: ${cleanGoal} Fundamentals`,
      `Module 2: Applied Architectures`,
      `Module 3: Capstone Implementation`,
    ],
    prerequisites: ["Curiosity and dedication to daily deliberate practice"],
    createdAt: new Date().toISOString(),
    modules: moduleTemplates,
  };
}
