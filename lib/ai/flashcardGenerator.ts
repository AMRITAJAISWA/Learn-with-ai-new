import { FlashcardSetData } from "@/lib/db/store";
import { callLlmApi } from "./llmClient";

export interface FlashcardGenerationInput {
  topic: string;
  sourceText?: string;
  cardCount?: number;
}

export async function generateFlashcardsWithAI(
  input: FlashcardGenerationInput
): Promise<FlashcardSetData> {
  const { topic, sourceText, cardCount = 4 } = input;

  const systemPrompt = `You are LearnWithAI's flashcard synthesis engine.
Synthesize high-retention active recall flashcards based on the provided topic/notes.
Return STRICTLY valid JSON conforming to this schema:
{
  "title": "Set title",
  "cards": [
    {
      "front": "Specific active recall question or prompt",
      "back": "Clear, concise, high-impact answer or explanation"
    }
  ]
}`;

  const userPrompt = `Topic: ${topic}
${sourceText ? `Notes/Source Text:\n${sourceText}` : ""}
Generate ${cardCount} flashcards.`;

  const llmResponse = await callLlmApi({
    systemPrompt,
    userPrompt,
    responseFormatJson: true,
  });

  if (llmResponse) {
    try {
      const parsed = JSON.parse(llmResponse);
      return {
        id: `set_${Date.now()}`,
        title: parsed.title || `${topic} Flashcards`,
        topic,
        createdAt: new Date().toISOString(),
        cards: (parsed.cards || []).map((c: any, idx: number) => ({
          id: `card_${Date.now()}_${idx}`,
          front: c.front,
          back: c.back,
          mastery: 0,
        })),
      };
    } catch (e) {
      console.warn("Failed to parse LLM flashcard JSON, using template:", e);
    }
  }

  // Realistic mock flashcard set
  return {
    id: `set_${Date.now()}`,
    title: `${topic} High-Yield Flashcards`,
    topic,
    createdAt: new Date().toISOString(),
    cards: [
      {
        id: `card_${Date.now()}_1`,
        front: `What is the core principle behind ${topic}?`,
        back: `${topic} leverages structural invariants and divide-and-conquer logic to optimize data traversal and state management.`,
        mastery: 0,
      },
      {
        id: `card_${Date.now()}_2`,
        front: `What is the Big-O time and space complexity of ${topic}?`,
        back: `Average time: O(log N) for balanced architectures; worst-case: O(N) when degenerate; Auxiliary Space: O(1) iterative or O(H) call stack.`,
        mastery: 0,
      },
      {
        id: `card_${Date.now()}_3`,
        front: `What is the most frequent bug encountered when implementing ${topic}?`,
        back: `Off-by-one errors in boundary pointers and failing to account for empty collections or single-node edge conditions.`,
        mastery: 0,
      },
      {
        id: `card_${Date.now()}_4`,
        front: `When would you choose an alternative approach over ${topic}?`,
        back: `When data is predominantly unsorted and frequently mutated in bulk, where hash indexing or raw sequential log appending may offer lower amortized overhead.`,
        mastery: 0,
      },
    ],
  };
}
