import { NextRequest, NextResponse } from "next/server";
import { store, StudySessionData } from "@/lib/db/store";
import { z } from "zod";

const sessionSchema = z.object({
  title: z.string().min(2),
  subject: z.string(),
  topic: z.string(),
  durationMin: z.number().default(60),
  goal: z.string(),
  participants: z.array(z.string()).default([]),
});

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      studySessions: store.studySessions,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = sessionSchema.parse(body);

    const newSession: StudySessionData = {
      id: `session_${Date.now()}`,
      title: validated.title,
      subject: validated.subject,
      topic: validated.topic,
      scheduledAt: new Date(Date.now() + 3600000 * 2).toISOString(),
      durationMin: validated.durationMin,
      goal: validated.goal,
      participants: validated.participants.length > 0 ? validated.participants : ["Aarav Patel", "Sarah Lin"],
      isCompleted: false,
    };

    store.studySessions.unshift(newSession);

    return NextResponse.json({
      success: true,
      studySession: newSession,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 400 }
    );
  }
}
