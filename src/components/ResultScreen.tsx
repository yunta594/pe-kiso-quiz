"use client";

import type { Question } from "@/types";
import Link from "next/link";

interface Props {
  questions: Question[];
  answers: (number | null)[];
  filterLabel: string;
  onRetry: () => void;
  onReview?: () => void;
  isExam?: boolean;
}

const NUMS = ["①", "②", "③", "④", "⑤"];

export default function ResultScreen({
  questions,
  answers,
  filterLabel,
  onRetry,
  onReview,
  isExam,
}: Props) {
  const correctCount = answers.filter(
    (a, i) => a === questions[i].answer
  ).length;
  const total = questions.length;
  const pct = Math.round((correctCount / total) * 100);
  const passThreshold = isExam ? 50 : 60;
  const isPass = pct >= passThreshold;

  const wrongIndices = answers
    .map((a, i) => ({ i, correct: a === questions[i].answer }))
    .filter((x) => !x.correct)
    .map((x) => x.i);

  return (
    <div className="space-y-6">
      {/* スコアカード */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-[#1e3a5f] px-6 py-5 text-center">
          <p className="text-white/70 text-sm mb-1">{filterLabel}</p>
          <p className="text-white font-bold text-xl">演習結果</p>
        </div>
        <div className="px-6 py-8 text-center">
          <div className="inline-flex flex-col items-center">
            <div
              className={`text-6xl font-bold mb-2 ${
                isPass ? "text-green-600" : "text-red-500"
              }`}
            >
              {pct}
              <span className="text-3xl">%</span>
            </div>
            <p className="text-2xl text-slate-700 font-semibold">
              {correctCount} / {total} 問 正解
            </p>
            {isExam && (
              <p className="text-xs text-slate-400 mt-1">
                合格ライン：{passThreshold}%（{Math.ceil(total * passThreshold / 100)}問以上）
              </p>
            )}
            <p
              className={`mt-3 text-base font-bold px-4 py-1.5 rounded-full ${
                isPass
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {isExam
                ? (isPass ? "合格！" : "不合格...")
                : pct >= 80
                ? "優秀！"
                : isPass
                ? "合格ライン到達"
                : "もう少し頑張りましょう"}
            </p>
          </div>

          {/* スコアバー */}
          <div className="mt-6 w-full max-w-xs mx-auto">
            <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  isPass ? "bg-green-500" : "bg-red-400"
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
            {isExam && (
              <div
                className="absolute top-0 h-4 w-0.5 bg-slate-500 opacity-50"
                style={{ left: `${passThreshold}%` }}
              />
            )}
          </div>
        </div>
      </div>

      {/* 間違えた問題 */}
      {wrongIndices.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-2">
            <span className="text-red-500 font-bold text-lg">✗</span>
            <h2 className="font-bold text-slate-800 text-lg">
              間違えた問題 ({wrongIndices.length}問)
            </h2>
          </div>
          <div className="divide-y divide-slate-100">
            {wrongIndices.map((i) => {
              const q = questions[i];
              const userAns = answers[i];
              return (
                <div key={q.id} className="px-6 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-slate-500">
                      {q.yearLabel}　I-{q.group}-{q.number}
                    </span>
                    <div className="flex gap-3 text-sm">
                      <span className="text-red-600 font-medium">
                        回答: {userAns ? NUMS[userAns - 1] : "未回答"}
                      </span>
                      <span className="text-green-700 font-bold">
                        正解: {NUMS[q.answer - 1]}
                      </span>
                    </div>
                  </div>
                  <p className="text-[15px] text-slate-700 line-clamp-2">
                    {q.question.split("\n")[0]}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ボタン群 */}
      <div className="flex gap-3 flex-col">
        {/* 復習する（間違えた問題がある場合） */}
        {onReview && wrongIndices.length > 0 && (
          <button
            onClick={onReview}
            className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 rounded-xl text-base transition-colors shadow-md"
          >
            復習する（{wrongIndices.length}問）→
          </button>
        )}

        <div className="flex gap-3 flex-col sm:flex-row">
          <button
            onClick={onRetry}
            className="flex-1 bg-[#1e3a5f] hover:bg-[#162d4a] text-white font-bold py-4 rounded-xl text-base transition-colors"
          >
            設定を変えてやり直す
          </button>
          <Link
            href="/"
            className="flex-1 text-center bg-white hover:bg-slate-50 border-2 border-slate-300 text-slate-700 font-bold py-4 rounded-xl text-base transition-colors"
          >
            トップへ戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
