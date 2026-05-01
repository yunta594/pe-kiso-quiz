"use client";

import Image from "next/image";
import type { Question } from "@/types";

interface Props {
  question: Question;
  selectedAnswer: number | null;
  onSelect: (idx: number) => void;
}

const NUMS = ["①", "②", "③", "④", "⑤"];

export default function QuestionCard({
  question,
  selectedAnswer,
  onSelect,
}: Props) {
  const answered = selectedAnswer !== null;

  function btnClass(idx: number) {
    if (!answered) return "choice-btn";
    const isCorrect = idx + 1 === question.answer;
    const isSelected = idx + 1 === selectedAnswer;
    if (isSelected && isCorrect) return "choice-btn selected-correct";
    if (isSelected && !isCorrect) return "choice-btn selected-wrong";
    if (!isSelected && isCorrect) return "choice-btn show-correct";
    return "choice-btn opacity-50";
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* 問題ヘッダー */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2563eb] px-6 py-4 flex items-start justify-between gap-4">
        <div className="flex-1">
          <span className="inline-block bg-white/20 text-white text-sm font-medium px-2.5 py-1 rounded-full mb-2">
            {question.yearLabel}　{question.groupLabel}
          </span>
        </div>
        {/* 年度・問題番号バッジ（右下目立たない位置） */}
        <span className="text-white/70 text-base shrink-0 mt-1">
          I-{question.group}-{question.number}
        </span>
      </div>

      <div className="px-6 pt-5 pb-2">
        {/* 問題文 */}
        <p className="text-[17px] leading-relaxed text-slate-800 whitespace-pre-wrap">
          {question.question}
        </p>
        {/* 問題図 */}
        {question.image && (
          <div className="mt-4 flex justify-center">
            <Image
              src={question.image}
              alt={`問題図 ${question.id}`}
              width={480}
              height={320}
              className="max-w-full rounded-lg border border-slate-200"
            />
          </div>
        )}
        {/* 選択肢の数式図 */}
        {question.choiceImage && (
          <div className="mt-4 flex justify-center">
            <Image
              src={question.choiceImage}
              alt={`選択肢図 ${question.id}`}
              width={480}
              height={320}
              className="max-w-full rounded-lg border border-slate-200"
            />
          </div>
        )}
      </div>

      {/* 選択肢 */}
      <div className="px-6 pb-6 space-y-3 mt-4">
        {question.choices.map((choice, idx) => (
          <button
            key={idx}
            className={btnClass(idx)}
            onClick={() => !answered && onSelect(idx + 1)}
            disabled={answered}
          >
            <span className="font-bold mr-2 text-blue-700">{NUMS[idx]}</span>
            <span>{choice.replace(/^[①②③④⑤]\s*/, "")}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
