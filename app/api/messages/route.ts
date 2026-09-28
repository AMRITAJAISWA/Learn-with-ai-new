import { NextRequest, NextResponse } from "next/server";
import { store, MessageData } from "@/lib/db/store";
import { z } from "zod";

const messageSchema = z.object({
  conversationId: z.string(),
  content: z.string().min(1),
  senderId: z.string().optional(),
  senderName: z.string().optional(),
});

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      conversations: store.conversations,
      messages: store.messages,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { conversationId, content, senderId, senderName } =
      messageSchema.parse(body);

    const newMsg: MessageData = {
      id: `msg_${Date.now()}`,
      conversationId,
      senderId: senderId || "student_user",
      senderName: senderName || "Student",
      content,
      isAiGenerated: false,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    store.messages.push(newMsg);

    return NextResponse.json({
      success: true,
      message: newMsg,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 400 }
    );
  }
}
