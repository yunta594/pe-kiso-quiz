"use client";

import { useState } from "react";
import type { Question } from "@/types";

interface Props {
  question: Question;
  selectedAnswer: number;
  onNext: () => void;
  onPrev: () => void;
  hasPrev: boolean;
  isLast: boolean;
}

const NUMS = ["①", "②", "③", "④", "⑤"];

export default function ExplanationPanel({
  question,
  selectedAnswer,
  onNext,
  onPrev,
  hasPrev,
  isLast,
}: Props) {
  const isCorrect = selectedAnswer === question.answer;
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportText, setReportText] = useState("");

  async function handleAiExplain() {
    if (loading || aiExplanation) return;
    setLoading(true);
    setAiError(null);
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question.question,
          choices: question.choices,
          answer: question.answer,
          explanation: question.explanation,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "API error");
      setAiExplanation(data.explanation);
    } catch (e) {
      setAiError(e instanceof Error ? e.message : "解説の生成に失敗しました。");
    } finally {
      setLoading(false);
    }
  }

  function handleReport() {
    if (!reportText.trim()) return;
    const subject = encodeURIComponent(
      `解説の誤り報告 [${question.id}]`
    );
    const body = encodeURIComponent(
      `問題ID: ${question.id}\n` +
        `問題文: ${question.question.slice(0, 80)}...\n\n` +
        `【報告内容】\n${reportText}`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
    setReportText("");
    setReportOpen(false);
  }

  return (
    <div
      className={`rounded-2xl border-2 overflow-hidden shadow-sm ${
        isCorrect ? "border-green-400" : "border-red-400"
      }`}
    >
      {/* 正誤バナー */}
      <div
        className={`px-6 py-4 flex items-center gap-3 ${
          isCorrect ? "bg-green-500" : "bg-red-500"
        }`}
      >
        <span className="text-2xl font-bold">{isCorrect ? "○" : "×"}</span>
        <div>
          <p className="text-white font-bold text-lg">
            {isCorrect ? "正解！" : "不正解"}
          </p>
          {!isCorrect && (
            <p className="text-white/90 text-sm">
              正解：{NUMS[question.answer - 1]}
            </p>
          )}
        </div>
      </div>

      {/* 解説 */}
      <div className="bg-white px-6 py-5">
        <h3 className="font-bold text-slate-700 text-sm mb-3 flex items-center gap-1.5">
          <span className="w-1 h-4 bg-blue-600 rounded inline-block" />
          解説
        </h3>
        <p className="text-[15px] leading-relaxed text-slate-700 whitespace-pre-wrap">
          {question.explanation}
        </p>

        {/* AI解説ボタン */}
        {!aiExplanation && (
          <button
            onClick={handleAiExplain}
            disabled={loading}
            className={`mt-5 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
              ${
                loading
                  ? "bg-purple-100 text-purple-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
              }`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                AIが解説を生成中...
              </>
            ) : (
              <>
                <span>✨</span>
                生成AIによる解説
              </>
            )}
          </button>
        )}

        {aiError && <p className="mt-3 text-sm text-red-600">{aiError}</p>}

        {/* AI解説 */}
        {aiExplanation && (
          <div className="mt-5 bg-purple-50 border border-purple-200 rounded-xl px-5 py-4">
            <p className="text-xs font-bold text-purple-700 mb-2 flex items-center gap-1.5">
              <span>✨</span>
              生成AIによる解説
            </p>
            <p className="text-[15px] leading-relaxed text-slate-700 whitespace-pre-wrap">
              {aiExplanation}
            </p>
          </div>
        )}

        {/* 誤り報告 */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          {!reportOpen ? (
            <button
              onClick={() => setReportOpen(true)}
              className="text-xs text-slate-400 hover:text-slate-600 underline transition-colors"
            >
              解説に誤りを見つけたら報告
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-xs font-medium text-slate-600">
                誤りの内容を入力してください（問題ID: {question.id}）
              </p>
              <textarea
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                placeholder="例：選択肢②の説明が逆になっています..."
                rows={3}
                className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 resize-none focus:outline-none focus:border-blue-400"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleReport}
                  disabled={!reportText.trim()}
                  className={`text-sm px-4 py-1.5 rounded-lg font-medium transition-colors
                    ${
                      reportText.trim()
                        ? "bg-slate-700 hover:bg-slate-800 text-white"
                        : "bg-slate-200 text-slate-400 cursor-not-allowed"
                    }`}
                >
                  メールで報告
                </button>
                <button
                  onClick={() => {
                    setReportOpen(false);
                    setReportText("");
                  }}
                  className="text-sm px-4 py-1.5 rounded-lg text-slate-500 hover:text-slate-700 transition-colors"
                >
                  キャンセル
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ナビゲーション */}
      <div className="bg-slate-50 px-6 py-4 flex items-center justify-between gap-3">
        <button
          onClick={onPrev}
          disabled={!hasPrev}
          className={`px-5 py-2.5 rounded-xl text-sm font-medium border-2 transition-all
            ${
              hasPrev
                ? "border-slate-300 bg-white text-slate-600 hover:bg-slate-100"
                : "border-slate-200 bg-white text-slate-300 cursor-not-allowed"
            }`}
        >
          ← 前の問題
        </button>
        <button
          onClick={onNext}
          className="bg-[#1e3a5f] hover:bg-[#162d4a] text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors"
        >
          {isLast ? "結果を見る →" : "次の問題 →"}
        </button>
      </div>
    </div>
  );
}
