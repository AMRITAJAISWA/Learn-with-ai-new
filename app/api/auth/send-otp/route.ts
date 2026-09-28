import { NextRequest, NextResponse } from "next/server";
import { isValidGmail, generateOtpCode, sendOtpEmail } from "@/lib/email/otpService";
import { z } from "zod";

const sendOtpSchema = z.object({
  email: z.string().email(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = sendOtpSchema.parse(body);

    if (!isValidGmail(email)) {
      return NextResponse.json(
        {
          success: false,
          error: "Please enter a valid Gmail address (e.g. yourname@gmail.com).",
        },
        { status: 400 }
      );
    }

    const code = generateOtpCode();
    const result = await sendOtpEmail(email, code);

    return NextResponse.json({
      success: true,
      message: result.message,
      simulated: result.simulated,
      code: result.code, // Included if SMTP is not configured for easy testing
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to send verification code." },
      { status: 400 }
    );
  }
}
