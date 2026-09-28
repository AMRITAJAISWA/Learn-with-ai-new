import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/db/store";
import { z } from "zod";

const progressSchema = z.object({
  topicId: z.string(),
  status: z.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETED"]),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { topicId, status } = progressSchema.parse(body);

    const course = store.courses.find((c) => c.id === id);
    if (!course) {
      return NextResponse.json(
        { success: false, error: "Course not found" },
        { status: 404 }
      );
    }

    let foundTopic = false;
    for (const mod of course.modules) {
      const t = mod.topics.find((top) => top.id === topicId);
      if (t) {
        t.status = status;
        foundTopic = true;
        break;
      }
    }

    if (!foundTopic) {
      return NextResponse.json(
        { success: false, error: "Topic not found" },
        { status: 404 }
      );
    }

    // Recalculate percentage
    const total = course.modules.reduce((acc, m) => acc + m.topics.length, 0);
    const completed = course.modules.reduce(
      (acc, m) => acc + m.topics.filter((t) => t.status === "COMPLETED").length,
      0
    );
    course.completionPct = Math.round((completed / Math.max(1, total)) * 100);

    return NextResponse.json({
      success: true,
      completionPct: course.completionPct,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 400 }
    );
  }
}
