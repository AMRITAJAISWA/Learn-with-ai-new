import type { Metadata } from "next";
import "./globals.css";
import { PlasmaCursorEffect } from "@/components/animations/PlasmaCursorEffect";
import { GlobalScrollFrameAnimation } from "@/components/animations/GlobalScrollFrameAnimation";
import { AuthProvider } from "@/lib/auth/authContext";

export const metadata: Metadata = {
  title: "LearnWithAI - Learn Smarter. Learn Together. Learn With AI.",
  description:
    "AI-powered personalized learning platform for students. Generate custom courses, smart revision, video recommendations, AI tutoring, quizzes, and peer study buddy matching.",
  keywords: [
    "AI learning",
    "personalized courses",
    "study buddy matching",
    "AI tutor",
    "smart revision",
    "AI flashcards",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-slate-950">
      <body className="min-h-screen bg-transparent text-slate-900 antialiased selection:bg-sky-500 selection:text-white relative">
        <AuthProvider>
          {/* Full-Viewport Global 148-Frame 3D Robot Video Background */}
          <GlobalScrollFrameAnimation totalFrames={148} />

          {/* Eulerian Navier-Stokes Fluid Plasma Cursor from CursorGesture */}
          <PlasmaCursorEffect />

          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
