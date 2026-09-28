import { NextRequest, NextResponse } from "next/server";
import { generateLessonWithAI } from "@/lib/ai/lessonGenerator";
import { z } from "zod";

const lessonSchema = z.object({
  topicTitle: z.string().min(2),
  moduleTitle: z.string().optional(),
  courseTitle: z.string().optional(),
  skillLevel: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = lessonSchema.parse(body);

    const lesson = await generateLessonWithAI(validated);

    return NextResponse.json({
      success: true,
      lesson,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to generate lesson" },
      { status: 400 }
    );
  }
}
