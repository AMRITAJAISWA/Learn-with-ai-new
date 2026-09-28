"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  User,
  Mail,
  Lock,
  School,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";
import { useAuth } from "@/lib/auth/authContext";

export default function SignupPage() {
  const router = useRouter();
  const { register } = useAuth();

  // Step 1: Details, Step 2: OTP Verification
  const [step, setStep] = useState<"DETAILS" | "OTP">("DETAILS");

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [college, setCollege] = useState("");
  const [password, setPassword] = useState("");

  // OTP state
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [dispatchedOtp, setDispatchedOtp] = useState<string | null>(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resending OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === "OTP" && resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, resendCooldown]);

  // Validate Gmail format
  const isGmailValid = (val: string) => {
    return /^[a-zA-Z0-9](\.?[a-zA-Z0-9_-]+)*@gmail\.com$/i.test(val.trim());
  };

  // Step 1: Submit details and send OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!name.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }

    if (!isGmailValid(email)) {
      setErrorMsg("Please enter a real Gmail address ending in @gmail.com.");
      return;
    }

    if (!password.trim() || password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    setIsSendingOtp(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to send verification code.");
      }

      setStep("OTP");
      setResendCooldown(60);
      setSuccessMsg(data.message);
      if (data.code) {
        setDispatchedOtp(data.code);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Could not dispatch verification code.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Resend OTP handler
  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setErrorMsg("");
    setSuccessMsg("");
    setIsSendingOtp(true);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to resend code.");
      }

      setResendCooldown(60);
      setSuccessMsg("A fresh 6-digit OTP code has been sent to your Gmail.");
      if (data.code) {
        setDispatchedOtp(data.code);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to resend verification code.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Handle OTP digit changes
  const handleOtpChange = (index: number, val: string) => {
    const digit = val.slice(-1); // Only take last typed character
    if (!/^\d?$/.test(digit)) return;

    const updated = [...otpDigits];
    updated[index] = digit;
    setOtpDigits(updated);
    setErrorMsg("");

    // Auto-advance to next input
    if (digit && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  // Handle backspace navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  // Handle paste full 6-digit code
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pasteData)) {
      const digits = pasteData.split("");
      setOtpDigits(digits);
      otpInputsRef.current[5]?.focus();
    }
  };

  const handleAutofillCode = () => {
    if (!dispatchedOtp) return;
    const digits = dispatchedOtp.split("");
    setOtpDigits(digits);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Step 2: Verify OTP and finalize registration
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    const enteredCode = otpDigits.join("");

    if (enteredCode.length !== 6) {
      setErrorMsg("Please enter the complete 6-digit verification code.");
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          code: enteredCode,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Invalid verification code.");
      }

      // Successful verification -> create account & login
      register({
        name,
        email: email.trim().toLowerCase(),
        password,
        college: college || "University Student",
      });

      router.push("/dashboard");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to verify code.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md space-y-7 rounded-3xl border border-slate-200/90 bg-white p-8 shadow-xl">
        {/* Brand Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 to-sky-500 text-white shadow-md group-hover:scale-105 transition-transform">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">
              Learn<span className="text-sky-600">WithAI</span>
            </span>
          </Link>
          <h2 className="mt-4 text-2xl font-extrabold text-slate-900">
            {step === "DETAILS" ? "Create Verified Student Account" : "Verify Your Gmail OTP"}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            {step === "DETAILS"
              ? "Sign up with a real Gmail account to send and receive study buddy requests."
              : `Enter the 6-digit verification code dispatched to ${email}`}
          </p>
        </div>

        {/* Live OTP Notification / Simulated Dispatch Banner */}
        {dispatchedOtp && step === "OTP" && (
          <div className="rounded-2xl border-2 border-emerald-400 bg-emerald-50/90 p-4 shadow-md space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                <Mail className="h-4 w-4 text-emerald-600" />
                <span>Verification OTP Dispatched:</span>
              </div>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                10m validity
              </span>
            </div>
            <div className="flex items-center justify-between bg-white rounded-xl p-2.5 border border-emerald-200">
              <span className="font-mono text-xl font-black text-slate-900 tracking-widest pl-2">
                {dispatchedOtp}
              </span>
              <button
                type="button"
                onClick={handleAutofillCode}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 text-xs font-bold shadow-sm transition-all"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "Autofilled!" : "Autofill Code"}</span>
              </button>
            </div>
            <p className="text-[10px] text-emerald-700 leading-tight">
              A 6-digit code has been sent. If testing locally without SMTP credentials, use the code above.
            </p>
          </div>
        )}

        {/* Status Alerts */}
        {errorMsg && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 font-semibold flex items-center gap-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && !dispatchedOtp && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700 font-semibold flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* STEP 1: Account Info + Gmail Verification Request */}
        {step === "DETAILS" && (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setErrorMsg("");
                  }}
                  placeholder="e.g. Alex Johnson"
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-xs text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Real Gmail Account
                </label>
                <span className="text-[10px] font-bold text-sky-600">
                  Must end in @gmail.com
                </span>
              </div>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMsg("");
                  }}
                  placeholder="yourname@gmail.com"
                  className={`w-full rounded-xl border py-2.5 pl-10 pr-3 text-xs text-slate-900 focus:outline-none focus:ring-2 ${
                    email && !email.endsWith("@gmail.com")
                      ? "border-amber-400 focus:ring-amber-100"
                      : "border-slate-200 focus:border-sky-500 focus:ring-sky-100"
                  }`}
                />
              </div>
              {email && !email.toLowerCase().endsWith("@gmail.com") && (
                <p className="mt-1 text-[11px] text-amber-600 font-medium">
                  ⚠️ Please provide a real Gmail address ending in @gmail.com
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                College or University
              </label>
              <div className="relative">
                <School className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="e.g. Stanford University, MIT, Berkeley"
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-xs text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMsg("");
                  }}
                  placeholder="Minimum 6 characters"
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-xs text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSendingOtp}
              className="w-full rounded-xl bg-slate-900 py-3 text-xs font-bold text-white shadow-md hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {isSendingOtp ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>Send OTP Verification Code →</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: Enter 6-Digit OTP & Confirm */}
        {step === "OTP" && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 text-center mb-3">
                Enter the 6-digit code sent to{" "}
                <strong className="text-slate-900 underline">{email}</strong>
              </label>

              {/* 6 Digit Input Boxes */}
              <div className="flex items-center justify-center gap-2" onPaste={handlePaste}>
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      otpInputsRef.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="h-12 w-12 text-center text-xl font-bold rounded-xl border-2 border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition-all"
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isVerifyingOtp || otpDigits.some((d) => !d)}
              className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 py-3 text-xs font-bold text-white shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isVerifyingOtp ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Verify OTP & Complete Account Setup</span>
                </>
              )}
            </button>

            {/* Resend & Back controls */}
            <div className="flex items-center justify-between text-xs pt-2">
              <button
                type="button"
                onClick={() => setStep("DETAILS")}
                className="text-slate-500 hover:text-slate-800 font-semibold underline"
              >
                ← Edit details / Gmail
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendCooldown > 0 || isSendingOtp}
                className="text-sky-600 hover:text-sky-700 font-bold disabled:text-slate-400"
              >
                {resendCooldown > 0
                  ? `Resend OTP in ${resendCooldown}s`
                  : "Resend OTP Code"}
              </button>
            </div>
          </form>
        )}

        <div className="text-center text-xs text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-sky-600 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
