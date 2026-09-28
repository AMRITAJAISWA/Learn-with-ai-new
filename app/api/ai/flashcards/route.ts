import { NextRequest, NextResponse } from "next/server";
import { generateFlashcardsWithAI } from "@/lib/ai/flashcardGenerator";
import { store } from "@/lib/db/store";
import { z } from "zod";

const flashcardSchema = z.object({
  topic: z.string().min(2),
  sourceText: z.string().optional(),
  cardCount: z.number().min(1).max(20).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = flashcardSchema.parse(body);

    const set = await generateFlashcardsWithAI(validated);
    store.flashcardSets.unshift(set);

    return NextResponse.json({
      success: true,
      flashcardSet: set,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 400 }
    );
  }
}
