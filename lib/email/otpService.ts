import nodemailer from "nodemailer";

interface OtpEntry {
  code: string;
  expiresAt: number;
  attempts: number;
}

// Global in-memory OTP cache across API requests
const globalForOtp = globalThis as unknown as {
  otpStore: Map<string, OtpEntry> | undefined;
};

export const otpStore = globalForOtp.otpStore ?? new Map<string, OtpEntry>();
if (process.env.NODE_ENV !== "production") globalForOtp.otpStore = otpStore;

export function isValidGmail(email: string): boolean {
  if (!email || typeof email !== "string") return false;
  const trimmed = email.trim().toLowerCase();
  // Validates standard gmail address format: must contain valid username and end with @gmail.com
  const gmailRegex = /^[a-z0-9](\.?[a-z0-9_-]+)*@gmail\.com$/i;
  return gmailRegex.test(trimmed);
}

export function generateOtpCode(): string {
  // Generate 6-digit numeric OTP
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function storeOtp(email: string, code: string): void {
  const normalized = email.trim().toLowerCase();
  otpStore.set(normalized, {
    code,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes validity
    attempts: 0,
  });
}

export function verifyOtpCode(
  email: string,
  code: string
): { success: boolean; error?: string } {
  const normalized = email.trim().toLowerCase();
  const entry = otpStore.get(normalized);

  if (!entry) {
    return {
      success: false,
      error: "No active verification code found for this Gmail. Please request a new OTP.",
    };
  }

  if (Date.now() > entry.expiresAt) {
    otpStore.delete(normalized);
    return {
      success: false,
      error: "Verification code has expired. Please request a new code.",
    };
  }

  entry.attempts += 1;
  if (entry.attempts > 5) {
    otpStore.delete(normalized);
    return {
      success: false,
      error: "Too many failed attempts. Please request a new OTP.",
    };
  }

  if (entry.code !== code.trim()) {
    return {
      success: false,
      error: "Invalid 6-digit verification code. Please check and try again.",
    };
  }

  // Verification successful - consume code
  otpStore.delete(normalized);
  return { success: true };
}

export async function sendOtpEmail(
  email: string,
  code: string
): Promise<{ success: boolean; code?: string; simulated: boolean; message: string }> {
  const normalized = email.trim().toLowerCase();
  storeOtp(normalized, code);

  // Check if SMTP environment variables are configured (e.g. Gmail App Password)
  const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER;
  const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;
  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = Number(process.env.SMTP_PORT) || 587;

  if (smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: `"LearnWithAI Security" <${smtpUser}>`,
        to: normalized,
        subject: `${code} is your LearnWithAI Verification Code`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 20px;">
            <div style="text-align: center; margin-bottom: 24px;">
              <span style="font-size: 22px; font-weight: 900; color: #0f172a; letter-spacing: -0.5px;">Learn<span style="color: #0284c7;">WithAI</span></span>
              <p style="font-size: 12px; color: #64748b; margin-top: 4px;">Learn Smarter. Learn Together. Learn With AI.</p>
            </div>
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; text-align: center;">
              <h2 style="font-size: 16px; font-weight: 700; color: #1e293b; margin: 0 0 8px 0;">Verify Your Gmail Account</h2>
              <p style="font-size: 13px; color: #64748b; line-height: 1.5; margin: 0 0 20px 0;">Please enter the following 6-digit one-time password to complete your account setup and unlock collaborative study buddy connections.</p>
              <div style="display: inline-block; background: #0284c7; color: #ffffff; font-size: 32px; font-weight: 800; letter-spacing: 8px; padding: 12px 28px; border-radius: 12px; font-family: monospace;">
                ${code}
              </div>
              <p style="font-size: 11px; color: #94a3b8; margin-top: 16px;">This code is valid for 10 minutes. If you did not request this, you can safely ignore this email.</p>
            </div>
          </div>
        `,
      });

      console.log(`[LearnWithAI] Real SMTP email sent successfully to ${normalized}`);
      return {
        success: true,
        simulated: false,
        message: `Verification code sent to your Gmail (${normalized}).`,
      };
    } catch (err: any) {
      console.error("[LearnWithAI] SMTP dispatch error, falling back to simulated dispatch:", err.message);
    }
  }

  // If no SMTP configured, log to server console and provide code in response for instant frictionless verification
  console.log(`=======================================================`);
  console.log(`[LearnWithAI OTP DISPATCH]`);
  console.log(`Target Gmail: ${normalized}`);
  console.log(`Verification Code: ${code}`);
  console.log(`Expires in: 10 minutes`);
  console.log(`=======================================================`);

  return {
    success: true,
    code, // Return code so frontend can display in interactive notification banner
    simulated: true,
    message: `Verification code dispatched to ${normalized}. Check notification banner or console for code.`,
  };
}
