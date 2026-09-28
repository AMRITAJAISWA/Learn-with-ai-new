import { NextRequest, NextResponse } from "next/server";
import { generateQuizWithAI } from "@/lib/ai/quizGenerator";
import { store } from "@/lib/db/store";
import { z } from "zod";

const quizSchema = z.object({
  topic: z.string().min(2),
  courseTitle: z.string().optional(),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]).optional(),
  questionCount: z.number().min(1).max(20).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = quizSchema.parse(body);

    const quiz = await generateQuizWithAI(validated);
    store.quizzes.unshift(quiz);

    return NextResponse.json({
      success: true,
      quiz,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 400 }
    );
  }
}
