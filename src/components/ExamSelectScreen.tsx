"use client";

import { useState } from "react";
import type { Question } from "@/types";
import { questionsByMock, mockQuestions, GROUP_LABELS } from "@/data";

interface Props {
  filter: string;
  onStart: (questions: Question[]) => void;
  onBack: () => void;
}

const ALL_GROUPS = [1, 2, 3, 4, 5];

export default function ExamSelectScreen({ filter, onStart, onBack }: Props) {
  const pool =
    filter === "all"
      ? mockQuestions
      : (questionsByMock[filter] ?? []);

  const [selected, setSelected] = useState<Record<number, string[]>>(
    Object.fromEntries(ALL_GROUPS.map((g) => [g, []]))
  );

  function toggle(q: Question) {
    const g = q.group;
    setSelected((prev) => {
      const current = prev[g];
      if (current.includes(q.id)) {
        return { ...prev, [g]: current.filter((id) => id !== q.id) };
      }
      if (current.length >= 3) return prev;
      return { ...prev, [g]: [...current, q.id] };
    });
  }

  const allSelected = ALL_GROUPS.every((g) => selected[g].length === 3);
  const totalSelected = ALL_GROUPS.reduce((sum, g) => sum + selected[g].length, 0);

  function handleStart() {
    const qs = ALL_GROUPS.flatMap((g) =>
      pool.filter((q) => selected[g].includes(q.id))
    );
    onStart(qs);
  }

  return (
    <div className="space-y-4">
      {/* ヘッダー */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="bg-[#1e3a5f] px-6 py-4">
          <p className="text-blue-200 text-sm mb-0.5">本試験シミュレーション</p>
          <h2 className="text-white font-bold text-xl">各群から3問を選んでください</h2>
        </div>
        <div className="px-6 py-4 flex items-center justify-between gap-4">
          <p className="text-slate-600 text-sm leading-relaxed">
            1群〜5群から各3問（合計15問）を選択して回答します。<br />
            正解率50%（8問以上）で合格です。
          </p>
          <div className="text-right shrink-0">
            <span className="text-3xl font-bold text-blue-700">{totalSelected}</span>
            <span className="text-slate-400 text-sm"> / 15</span>
          </div>
        </div>
      </div>

      {/* 群ごとの問題リスト */}
      {ALL_GROUPS.map((g) => {
        const groupQs = pool.filter((q) => q.group === g);
        const groupSelected = selected[g];
        const isDone = groupSelected.length === 3;

        return (
          <div
            key={g}
            className={`bg-white rounded-2xl border-2 overflow-hidden shadow-sm transition-colors ${
              isDone ? "border-green-400" : "border-slate-200"
            }`}
          >
            <div
              className={`px-5 py-3 flex items-center justify-between ${
                isDone ? "bg-green-50" : "bg-slate-50"
              }`}
            >
              <h3 className="font-bold text-slate-800 text-sm">
                第{g}群：{GROUP_LABELS[g]}
              </h3>
              <span
                className={`text-sm font-bold px-3 py-1 rounded-full transition-colors ${
                  isDone
                    ? "bg-green-500 text-white"
                    : groupSelected.length > 0
                    ? "bg-blue-100 text-blue-700"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {groupSelected.length} / 3
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {groupQs.map((q) => {
                const isSelected = groupSelected.includes(q.id);
                const isDisabled = !isSelected && groupSelected.length >= 3;
                return (
                  <div
                    key={q.id}
                    className={`px-4 py-3 flex items-start gap-3 transition-colors ${
                      isSelected
                        ? "bg-blue-50"
                        : isDisabled
                        ? "opacity-40"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <button
                      onClick={() => !isDisabled && toggle(q)}
                      disabled={isDisabled}
                      className={`shrink-0 w-16 py-1.5 rounded-lg text-xs font-bold border-2 transition-all ${
                        isSelected
                          ? "border-blue-600 bg-blue-600 text-white"
                          : isDisabled
                          ? "border-slate-200 bg-white text-slate-300 cursor-not-allowed"
                          : "border-slate-300 bg-white text-slate-600 hover:border-blue-400"
                      }`}
                    >
                      {isSelected ? "✓ 選択中" : "選ぶ"}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-400 mb-0.5">
                        第{q.number}問
                        {filter === "all" && q.yearLabel && (
                          <span className="ml-1 text-slate-300">({q.yearLabel})</span>
                        )}
                      </p>
                      <p className="text-[13px] text-slate-700 line-clamp-2 leading-snug">
                        {q.question.split("\n")[0]}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* ボタン群 */}
      <div className="flex flex-col gap-3">
        <button
          onClick={handleStart}
          disabled={!allSelected}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-colors shadow-md ${
            allSelected
              ? "bg-amber-500 hover:bg-amber-600 text-white"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          }`}
        >
          {allSelected
            ? "本試験スタート →"
            : `あと ${15 - totalSelected} 問選んでください`}
        </button>
        <button
          onClick={onBack}
          className="w-full py-3 rounded-xl font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
        >
          ← 戻る
        </button>
      </div>
    </div>
  );
}
