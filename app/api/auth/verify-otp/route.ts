import { NextRequest, NextResponse } from "next/server";
import { verifyOtpCode, isValidGmail } from "@/lib/email/otpService";
import { z } from "zod";

const verifyOtpSchema = z.object({
  email: z.string().email(),
  code: z.string().min(6).max(6),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, code } = verifyOtpSchema.parse(body);

    if (!isValidGmail(email)) {
      return NextResponse.json(
        {
          success: false,
          error: "Please enter a valid Gmail address.",
        },
        { status: 400 }
      );
    }

    const verification = verifyOtpCode(email, code);
    if (!verification.success) {
      return NextResponse.json(
        { success: false, error: verification.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Gmail account successfully verified!",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Invalid verification code." },
      { status: 400 }
    );
  }
}
