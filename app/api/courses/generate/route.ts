import { NextRequest, NextResponse } from "next/server";
import { generateCourseWithAI } from "@/lib/ai/courseGenerator";
import { store } from "@/lib/db/store";
import { z } from "zod";

const courseSchema = z.object({
  goal: z.string().min(2),
  skillLevel: z.enum(["Beginner", "Intermediate", "Advanced"]),
  availableTime: z.string(),
  duration: z.string(),
  target: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = courseSchema.parse(body);

    const newCourse = await generateCourseWithAI({
      goal: validated.goal,
      skillLevel: validated.skillLevel,
      availableTime: validated.availableTime,
      duration: validated.duration,
      target: validated.target,
    });

    store.courses.unshift(newCourse);

    return NextResponse.json({
      success: true,
      course: newCourse,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to generate course" },
      { status: 400 }
    );
  }
}
