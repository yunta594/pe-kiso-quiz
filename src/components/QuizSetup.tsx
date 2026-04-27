"use client";

import { useState } from "react";
import {
  GROUP_LABELS,
  questionsByYear,
  questionsByGroup,
  allQuestions,
  mockQuestions,
  questionsByMock,
} from "@/data";

interface Props {
  mode: string;
  filter: string;
  filterLabel: string;
  onStart: (groups: number[], count: number) => void;
}

const COUNT_OPTIONS = [6, 10, 15, 30] as const;
const ALL_GROUPS = [1, 2, 3, 4, 5];

export default function QuizSetup({ mode, filter, filterLabel, onStart }: Props) {
  const isGroupMode = mode === "group";
  const isTopicMode = mode === "topic";
  const showGroupSelect = !isGroupMode && !isTopicMode;
  const fixedGroup = isGroupMode ? Number(filter) : null;

  const [selectedGroups, setSelectedGroups] = useState<number[]>(
    isGroupMode ? [Number(filter)] : ALL_GROUPS
  );
  const [count, setCount] = useState<number>(10);

  function toggleGroup(g: number) {
    setSelectedGroups((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g].sort()
    );
  }

  function getAvailable(): number {
    let pool =
      mode === "year"
        ? (questionsByYear[filter] ?? [])
        : mode === "group"
        ? (questionsByGroup[Number(filter)] ?? [])
        : mode === "mock"
        ? filter === "all"
          ? mockQuestions
          : (questionsByMock[filter] ?? [])
        : mode === "topic"
        ? [...allQuestions, ...mockQuestions].filter(
            (q) => q.tags?.includes(filter)
          )
        : allQuestions;

    if (showGroupSelect && selectedGroups.length > 0 && selectedGroups.length < 5) {
      pool = pool.filter((q) => selectedGroups.includes(q.group));
    }
    return pool.length;
  }

  const available = getAvailable();
  const canStart = (showGroupSelect ? selectedGroups.length > 0 : true) && available > 0;

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="bg-[#1e3a5f] px-6 py-4">
          <p className="text-blue-200 text-sm mb-0.5">演習設定</p>
          <h2 className="text-white font-bold text-xl">{filterLabel}</h2>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* 群選択（year / random / mock モード） */}
          {showGroupSelect && (
            <div>
              <p className="font-bold text-slate-700 text-base mb-3 flex items-center gap-2">
                <span className="w-1 h-4 bg-blue-600 rounded inline-block" />
                出題する問題群を選ぶ
              </p>
              <div className="grid gap-2">
                {ALL_GROUPS.map((g) => (
                  <label
                    key={g}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all
                      ${
                        selectedGroups.includes(g)
                          ? "border-blue-500 bg-blue-50"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-blue-600"
                      checked={selectedGroups.includes(g)}
                      onChange={() => toggleGroup(g)}
                    />
                    <span
                      className={`text-[15px] font-medium ${
                        selectedGroups.includes(g)
                          ? "text-blue-800"
                          : "text-slate-700"
                      }`}
                    >
                      {GROUP_LABELS[g]}
                    </span>
                  </label>
                ))}
              </div>
              {selectedGroups.length === 0 && (
                <p className="text-red-500 text-sm mt-2">
                  ※ 1つ以上の群を選択してください
                </p>
              )}
            </div>
          )}

          {/* group モード：固定群を表示 */}
          {isGroupMode && fixedGroup && (
            <div>
              <p className="font-bold text-slate-700 text-base mb-2 flex items-center gap-2">
                <span className="w-1 h-4 bg-blue-600 rounded inline-block" />
                出題する問題群
              </p>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-blue-500 bg-blue-50">
                <span className="text-blue-600 text-lg">✓</span>
                <span className="text-blue-800 font-medium text-[15px]">
                  {GROUP_LABELS[fixedGroup]}
                </span>
              </div>
            </div>
          )}

          {/* topic モード：テーマ固定の説明 */}
          {isTopicMode && (
            <div>
              <p className="font-bold text-slate-700 text-base mb-2 flex items-center gap-2">
                <span className="w-1 h-4 bg-blue-600 rounded inline-block" />
                出題テーマ
              </p>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-blue-500 bg-blue-50">
                <span className="text-blue-600 text-lg">✓</span>
                <span className="text-blue-800 font-medium text-[15px]">
                  {filter}（過去問＋練習問題）
                </span>
              </div>
            </div>
          )}

          {/* 問題数選択 */}
          <div>
            <p className="font-bold text-slate-700 text-base mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-blue-600 rounded inline-block" />
              出題数を選ぶ
              <span className="text-sm text-slate-400 font-normal">
                （最大 {available} 問）
              </span>
            </p>
            <div className="grid grid-cols-4 gap-2">
              {COUNT_OPTIONS.map((n) => {
                const disabled = n > available;
                return (
                  <button
                    key={n}
                    onClick={() => !disabled && setCount(n)}
                    disabled={disabled}
                    className={`py-3 rounded-xl border-2 font-bold text-lg transition-all
                      ${
                        count === n && !disabled
                          ? "border-blue-600 bg-blue-600 text-white"
                          : disabled
                          ? "border-slate-200 bg-slate-100 text-slate-300 cursor-not-allowed"
                          : "border-slate-200 bg-white text-slate-700 hover:border-blue-400"
                      }`}
                  >
                    {n}問
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => canStart && onStart(selectedGroups, count)}
        disabled={!canStart}
        className={`w-full py-4 rounded-xl font-bold text-lg transition-colors shadow-md
          ${
            canStart
              ? "bg-[#1e3a5f] hover:bg-[#162d4a] text-white"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          }`}
      >
        {canStart ? `${count}問スタート →` : "群を1つ以上選択してください"}
      </button>
    </div>
  );
}
