"use client";

import React, { useState } from "react";
import {
  Layers,
  Sparkles,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Plus,
  BookOpen,
} from "lucide-react";
import { store, FlashcardSetData, FlashcardData } from "@/lib/db/store";

export default function FlashcardsPage() {
  const [sets, setSets] = useState<FlashcardSetData[]>(store.flashcardSets);
  const [activeSetIndex, setActiveSetIndex] = useState(0);
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Generator modal state
  const [showGenerator, setShowGenerator] = useState(false);
  const [newTopic, setNewTopic] = useState("Object-Oriented Design & Encapsulation");
  const [newNotes, setNewNotes] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const activeSet = sets[activeSetIndex] || sets[0];
  const activeCard = activeSet?.cards[cardIndex] || activeSet?.cards[0];
  const totalCards = activeSet?.cards.length || 0;

  const handleNext = () => {
    setIsFlipped(false);
    setCardIndex((prev) => (prev + 1) % Math.max(1, totalCards));
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCardIndex((prev) => (prev - 1 + totalCards) % Math.max(1, totalCards));
  };

  const handleRateMastery = (rating: number) => {
    if (!activeCard) return;
    activeCard.mastery = rating;
    handleNext();
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic.trim()) return;
    setIsGenerating(true);

    try {
      const res = await fetch("/api/ai/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: newTopic,
          sourceText: newNotes,
          cardCount: 4,
        }),
      });

      const data = await res.json();
      if (data.success && data.flashcardSet) {
        const generated = data.flashcardSet;
        const exists = store.flashcardSets.some((s) => s.id === generated.id);
        if (!exists) {
          store.flashcardSets.unshift(generated);
        }
        setSets([...store.flashcardSets]);
        setActiveSetIndex(0);
        setCardIndex(0);
        setIsFlipped(false);
        setShowGenerator(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
            Active Recall Flashcards
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">
            AI Flashcards & Spaced Recall
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Flip cards, rate your recall confidence, or generate new decks from your course notes.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowGenerator(!showGenerator)}
          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-600/20 hover:from-purple-500 hover:to-indigo-500 active:scale-95 transition-all"
        >
          <Sparkles className="h-4 w-4" />
          <span>Generate Deck from Topic</span>
        </button>
      </div>

      {/* Generator Drawer */}
      {showGenerator && (
        <form
          onSubmit={handleGenerate}
          className="rounded-3xl border border-purple-200 bg-purple-50/50 p-6 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-purple-950 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <span>AI Flashcard Deck Synthesis</span>
            </h3>
            <button
              type="button"
              onClick={() => setShowGenerator(false)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Topic Name
              </label>
              <input
                type="text"
                required
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                placeholder="e.g. Object-Oriented Polymorphism"
                className="w-full rounded-xl border border-slate-200 py-2 px-3 text-xs bg-white focus:border-purple-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Source Notes / Text (Optional)
              </label>
              <input
                type="text"
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                placeholder="Paste paragraph or study notes..."
                className="w-full rounded-xl border border-slate-200 py-2 px-3 text-xs bg-white focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isGenerating}
              className="rounded-xl bg-purple-600 px-6 py-2 text-xs font-bold text-white hover:bg-purple-500 shadow-md"
            >
              {isGenerating ? "Synthesizing Flashcards..." : "Generate 4 Flashcards"}
            </button>
          </div>
        </form>
      )}

      {/* Deck Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {sets.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => {
              setActiveSetIndex(idx);
              setCardIndex(0);
              setIsFlipped(false);
            }}
            className={`rounded-2xl px-4 py-2 text-xs font-bold border transition-all whitespace-nowrap ${
              activeSetIndex === idx
                ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <span>{s.title}</span>
            <span className="ml-2 opacity-60 text-[10px]">({s.cards.length})</span>
          </button>
        ))}
      </div>

      {/* Main Flashcard Interactive Player */}
      {activeCard ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-2">
            <span>
              Card {cardIndex + 1} of {totalCards}
            </span>
            <span className="flex items-center gap-1">
              Click card to flip <RotateCw className="h-3 w-3" />
            </span>
          </div>

          {/* 3D Flip Card Container */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="perspective-1000 w-full h-80 sm:h-96 cursor-pointer select-none"
          >
            <div
              className={`relative h-full w-full rounded-3xl transition-transform duration-500 transform-style-3d shadow-xl ${
                isFlipped ? "rotate-y-180" : ""
              }`}
            >
              {/* Card Front */}
              <div className="absolute inset-0 backface-hidden rounded-3xl border border-slate-200/90 bg-white p-8 flex flex-col justify-between shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700 uppercase tracking-wider">
                    Question / Prompt
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Front</span>
                </div>

                <div className="my-auto text-center px-4">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-relaxed">
                    {activeCard.front}
                  </h3>
                </div>

                <div className="flex items-center justify-center text-xs text-slate-400 gap-1">
                  <span>Click anywhere to reveal answer</span>
                </div>
              </div>

              {/* Card Back */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-3xl border border-purple-200 bg-gradient-to-br from-white via-purple-50/30 to-indigo-50/40 p-8 flex flex-col justify-between shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                    Verified Answer
                  </span>
                  <span className="text-[10px] text-purple-400 font-bold uppercase">Back</span>
                </div>

                <div className="my-auto text-center px-4">
                  <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed">
                    {activeCard.back}
                  </p>
                </div>

                <div className="flex items-center justify-center text-xs text-slate-400 gap-1">
                  <span>Rate your recall below to update mastery</span>
                </div>
              </div>
            </div>
          </div>

          {/* Controls: Known / Needs Review / Previous / Next */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Prev</span>
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleRateMastery(1)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100"
              >
                <XCircle className="h-4 w-4" />
                <span>Needs Review</span>
              </button>

              <button
                type="button"
                onClick={() => handleRateMastery(5)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-500 shadow-md shadow-emerald-600/20"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Known Mastered</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-200 p-12 text-center text-xs text-slate-400">
          No cards in this deck. Generate a new deck to get started!
        </div>
      )}
    </div>
  );
}
