import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/db/store";
import { z } from "zod";

const connectSchema = z.object({
  buddyId: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { buddyId } = connectSchema.parse(body);

    const buddy = store.studyBuddies.find((b) => b.id === buddyId);
    if (!buddy) {
      return NextResponse.json(
        { success: false, error: "Study buddy not found" },
        { status: 404 }
      );
    }

    buddy.status = "CONNECTED";

    return NextResponse.json({
      success: true,
      message: `Connected with ${buddy.name}!`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 400 }
    );
  }
}
