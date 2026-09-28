import { NextResponse } from "next/server";
import { store } from "@/lib/db/store";

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: {
        user: store.user,
        activeCourse: store.courses[0] || null,
        revisionItems: store.revisionItems.slice(0, 3),
        studySessions: store.studySessions,
        studyBuddies: store.studyBuddies.slice(0, 3),
        recentAttempt: store.quizAttempts[0] || null,
        notifications: store.notifications,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
