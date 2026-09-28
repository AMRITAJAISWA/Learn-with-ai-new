import { NextRequest, NextResponse } from "next/server";
import { askAiTutor } from "@/lib/ai/tutor";
import { z } from "zod";

const chatSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant", "system"]),
      content: z.string(),
    })
  ),
  contextTopic: z.string().optional(),
  contextCourse: z.string().optional(),
  quickAction: z
    .enum(["explain_simply", "give_example", "summarize", "quiz_me"])
    .optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = chatSchema.parse(body);

    const responseText = await askAiTutor(validated);

    return NextResponse.json({
      success: true,
      message: responseText,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 400 }
    );
  }
}
