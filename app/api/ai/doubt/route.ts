import { NextRequest, NextResponse } from "next/server";
import { solveDoubtWithAI } from "@/lib/ai/doubtSolver";
import { z } from "zod";

const doubtSchema = z.object({
  questionText: z.string().min(3),
  category: z
    .enum(["programming", "mathematics", "conceptual", "general"])
    .optional(),
  imageUrl: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = doubtSchema.parse(body);

    const solution = await solveDoubtWithAI(validated);

    return NextResponse.json({
      success: true,
      solution,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 400 }
    );
  }
}
