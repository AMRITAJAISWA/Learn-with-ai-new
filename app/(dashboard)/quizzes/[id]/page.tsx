"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileQuestion,
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  RotateCcw,
  ArrowRight,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { store, QuizData, QuestionData } from "@/lib/db/store";
import confetti from "canvas-confetti";

export default function ActiveQuizRunnerPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.id as string;

  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeSpentSec, setTimeSpentSec] = useState(0);

  useEffect(() => {
    const found = store.quizzes.find((q) => q.id === quizId) || store.quizzes[0];
    if (found) {
      setQuiz(found);
    }
  }, [quizId]);

  useEffect(() => {
    if (isSubmitted) return;
    const interval = setInterval(() => {
      setTimeSpentSec((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitted]);

  if (!quiz) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-600 border-t-transparent" />
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentIndex];
  const totalQuestions = quiz.questions.length;

  const handleSelectOption = (option: string) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: option,
    }));
  };

  const calculateResults = () => {
    let score = 0;
    const weakTopics: string[] = [];

    quiz.questions.forEach((q) => {
      const selected = selectedAnswers[q.id];
      if (selected === q.correctAnswer) {
        score++;
      } else {
        weakTopics.push(`${quiz.topicTitle}: ${q.questionText.slice(0, 35)}...`);
      }
    });

    const accuracyPct = Math.round((score / totalQuestions) * 100);

    return { score, accuracyPct, weakTopics };
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    const { score, accuracyPct, weakTopics } = calculateResults();

    // Trigger celebratory confetti if score >= 75%
    if (accuracyPct >= 75) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }

    // Save attempt to store
    store.quizAttempts.unshift({
      id: `attempt_${Date.now()}`,
      quizId: quiz.id,
      quizTitle: quiz.title,
      score,
      totalQuestions,
      accuracyPct,
      timeSpentSec,
      weakTopics,
      completedAt: new Date().toISOString(),
    });

    // If weak topics exist, add to smart revision
    if (weakTopics.length > 0) {
      store.revisionItems.unshift({
        id: `rev_quiz_${Date.now()}`,
        topicTitle: quiz.topicTitle,
        courseTitle: "Diagnostic Quiz",
        lastStudied: new Date().toISOString(),
        nextRevisionAt: new Date(Date.now() + 86400000).toISOString(),
        intervalDays: 1,
        difficulty: accuracyPct < 50 ? "Hard" : "Medium",
        performance: accuracyPct,
        needsPractice: true,
      });
    }
  };

  const results = isSubmitted ? calculateResults() : null;

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-4">
      {/* Top Quiz Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
            {quiz.difficulty} Diagnostic Assessment
          </span>
          <h1 className="text-xl font-extrabold text-slate-900">{quiz.title}</h1>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-slate-500">
          <Clock className="h-4 w-4 text-slate-400" />
          <span>
            {Math.floor(timeSpentSec / 60)}:
            {String(timeSpentSec % 60).padStart(2, "0")}
          </span>
        </div>
      </div>

      {!isSubmitted ? (
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-400 mb-2">
              <span>
                Question {currentIndex + 1} of {totalQuestions}
              </span>
              <span>{Math.round(((currentIndex + 1) / totalQuestions) * 100)}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all"
                style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Text */}
          <div className="pt-2">
            <h2 className="text-base font-bold text-slate-900 leading-relaxed">
              {currentQuestion.questionText}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((opt, idx) => {
              const isSelected = selectedAnswers[currentQuestion.id] === opt;
              const letter = String.fromCharCode(65 + idx);

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectOption(opt)}
                  className={`w-full flex items-center gap-3.5 rounded-2xl p-4 border text-left text-xs font-semibold transition-all ${
                    isSelected
                      ? "border-amber-500 bg-amber-50/80 text-amber-950 shadow-sm"
                      : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-xl text-xs font-bold ${
                      isSelected
                        ? "bg-amber-500 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {letter}
                  </span>
                  <span className="flex-1">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Navigation buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(currentIndex - 1)}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-30"
            >
              Previous
            </button>

            {currentIndex < totalQuestions - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentIndex(currentIndex + 1)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-slate-800"
              >
                <span>Next Question</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-7 py-2.5 text-xs font-bold text-white shadow-md shadow-amber-600/20 hover:bg-amber-500 active:scale-95 transition-all"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Submit & View Results</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Results View */
        <div className="space-y-6">
          {/* Score Header Card */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm text-center space-y-3">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 mx-auto">
              <Award className="h-8 w-8" />
            </div>

            <h2 className="text-2xl font-black text-slate-900">Quiz Completed!</h2>

            <div className="flex items-center justify-center gap-6 pt-2">
              <div>
                <span className="text-xs text-slate-400">Score</span>
                <p className="text-xl font-black text-slate-900">
                  {results?.score} / {totalQuestions}
                </p>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <span className="text-xs text-slate-400">Accuracy</span>
                <p className="text-xl font-black text-emerald-600">
                  {results?.accuracyPct}%
                </p>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <span className="text-xs text-slate-400">Time Taken</span>
                <p className="text-xl font-black text-slate-900 font-mono">
                  {timeSpentSec}s
                </p>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/revision"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Go to Smart Revision</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false);
                  setCurrentIndex(0);
                  setSelectedAnswers({});
                  setTimeSpentSec(0);
                }}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Retry Quiz
              </button>
            </div>
          </div>

          {/* Detailed Question Review Breakdown */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900">Detailed Answer Review</h3>

            {quiz.questions.map((q, idx) => {
              const userAns = selectedAnswers[q.id];
              const isCorrect = userAns === q.correctAnswer;

              return (
                <div
                  key={q.id}
                  className={`rounded-2xl border p-5 space-y-3 ${
                    isCorrect
                      ? "border-emerald-200 bg-emerald-50/40"
                      : "border-rose-200 bg-rose-50/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="text-xs font-bold text-slate-900">
                      {idx + 1}. {q.questionText}
                    </h4>
                    {isCorrect ? (
                      <span className="flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 flex-shrink-0">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Correct
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 rounded-md bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800 flex-shrink-0">
                        <XCircle className="h-3.5 w-3.5" /> Incorrect
                      </span>
                    )}
                  </div>

                  <div className="text-xs space-y-1">
                    <p className="text-slate-600">
                      Your answer:{" "}
                      <span
                        className={`font-semibold ${
                          isCorrect ? "text-emerald-700" : "text-rose-700"
                        }`}
                      >
                        {userAns || "No answer selected"}
                      </span>
                    </p>
                    {!isCorrect && (
                      <p className="text-slate-600">
                        Correct answer:{" "}
                        <span className="font-semibold text-emerald-700">
                          {q.correctAnswer}
                        </span>
                      </p>
                    )}
                  </div>

                  <div className="rounded-xl bg-white/80 p-3 border border-slate-200/60 text-xs text-slate-600 leading-relaxed">
                    <strong className="text-slate-900">Explanation: </strong>
                    {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
