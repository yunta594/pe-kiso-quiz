"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { Question } from "@/types";
import { getQuestions, YEAR_LABELS, GROUP_LABELS, MOCK_LABELS } from "@/data";
import ProgressBar from "@/components/ProgressBar";
import QuestionCard from "@/components/QuestionCard";
import ExplanationPanel from "@/components/ExplanationPanel";
import ResultScreen from "@/components/ResultScreen";
import QuizSetup from "@/components/QuizSetup";
import Link from "next/link";

type Phase = "setup" | "quiz" | "result";

function QuizContent() {
  const params = useSearchParams();
  const mode = params.get("mode") ?? "random";
  const filter = params.get("filter") ?? "all";

  const autostart = params.get("autostart");

  const [phase, setPhase] = useState<Phase>("setup");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);

  useEffect(() => {
    if (autostart) {
      const count = parseInt(autostart, 10);
      const qs = getQuestions(mode, filter, [1, 2, 3, 4, 5], count);
      setQuestions(qs);
      setAnswers(new Array(qs.length).fill(null));
      setCurrentIdx(0);
      setPhase("quiz");
    }
  }, []);

  const filterLabel =
    mode === "year"
      ? (YEAR_LABELS[filter] ?? filter)
      : mode === "group"
      ? (GROUP_LABELS[Number(filter)] ?? filter)
      : mode === "mock"
      ? (MOCK_LABELS[filter] ?? "練習問題")
      : mode === "topic"
      ? filter
      : "ランダム演習";

  function handleStart(groups: number[], count: number, ordered?: boolean) {
    const qs = getQuestions(mode, filter, groups, count, ordered);
    setQuestions(qs);
    setAnswers(new Array(qs.length).fill(null));
    setCurrentIdx(0);
    setPhase("quiz");
  }

  function handleRetry() {
    setPhase("setup");
  }

  function handleReview() {
    const wrongQs = questions.filter((_, i) => answers[i] !== questions[i].answer);
    if (wrongQs.length === 0) return;
    setQuestions(wrongQs);
    setAnswers(new Array(wrongQs.length).fill(null));
    setCurrentIdx(0);
    setPhase("quiz");
  }

  // ── Setup phase ──────────────────────────────────────────────────────────
  if (phase === "setup") {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-gradient-to-r from-[#1e3a5f] to-[#2563eb] text-white px-4 py-4 flex items-center gap-3 shadow-md">
          <Link
            href="/"
            className="text-white/60 hover:text-white text-sm transition-colors"
          >
            ← トップ
          </Link>
          <span className="text-white/40">|</span>
          <h1 className="font-bold text-base">{filterLabel}</h1>
        </header>
        <div className="max-w-3xl mx-auto px-4 py-8">
          <QuizSetup
            mode={mode}
            filter={filter}
            filterLabel={filterLabel}
            onStart={handleStart}
          />
        </div>
      </div>
    );
  }

  // ── Result phase ─────────────────────────────────────────────────────────
  if (phase === "result") {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-gradient-to-r from-[#1e3a5f] to-[#2563eb] text-white px-4 py-4 flex items-center gap-3 shadow-md">
          <Link
            href="/"
            className="text-white/60 hover:text-white text-sm transition-colors"
          >
            ← トップ
          </Link>
          <span className="text-white/40">|</span>
          <h1 className="font-bold text-base">{filterLabel}</h1>
        </header>
        <div className="max-w-3xl mx-auto px-4 py-8">
          <ResultScreen
            questions={questions}
            answers={answers}
            filterLabel={filterLabel}
            onRetry={handleRetry}
            onReview={handleReview}
          />
        </div>
      </div>
    );
  }

  // ── Quiz phase ────────────────────────────────────────────────────────────
  const current = questions[currentIdx];
  const currentAnswer = answers[currentIdx];
  const isAnswered = currentAnswer !== null;
  const isLast = currentIdx === questions.length - 1;
  const hasPrev = currentIdx > 0;

  function handleSelect(choice: number) {
    if (isAnswered) return;
    const next = [...answers];
    next[currentIdx] = choice;
    setAnswers(next);
  }

  function handleNext() {
    if (isLast) {
      setPhase("result");
    } else {
      setCurrentIdx((i) => i + 1);
    }
  }

  function handlePrev() {
    if (hasPrev) setCurrentIdx((i) => i - 1);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-gradient-to-r from-[#1e3a5f] to-[#2563eb] text-white px-4 py-4 flex items-center gap-3 sticky top-0 z-10 shadow-md">
        <Link
          href="/"
          className="text-white/60 hover:text-white text-sm transition-colors"
        >
          ← トップ
        </Link>
        <span className="text-white/40">|</span>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm truncate">{filterLabel}</p>
        </div>
        <span className="text-white/70 text-sm shrink-0">
          {currentIdx + 1} / {questions.length}
        </span>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
        <ProgressBar current={currentIdx + 1} total={questions.length} />

        {/* 未回答時の前へボタン */}
        {!isAnswered && hasPrev && (
          <div>
            <button
              onClick={handlePrev}
              className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              ← 前の問題
            </button>
          </div>
        )}

        <QuestionCard
          question={current}
          selectedAnswer={currentAnswer}
          onSelect={handleSelect}
        />

        {isAnswered && (
          <ExplanationPanel
            question={current}
            selectedAnswer={currentAnswer!}
            onNext={handleNext}
            onPrev={handlePrev}
            hasPrev={hasPrev}
            isLast={isLast}
          />
        )}
      </div>
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-100 flex items-center justify-center"><p className="text-slate-500">読み込み中...</p></div>}>
      <QuizContent />
    </Suspense>
  );
}
