"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const COUNT_OPTIONS = [10, 20, 30, 40, 50] as const;

export default function RandomQuizAccordion() {
  const [isOpen, setIsOpen] = useState(false);
  const [count, setCount] = useState(10);
  const router = useRouter();

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-gradient-to-r from-[#1e3a5f] to-[#1e5ba8] hover:from-[#162d4a] hover:to-[#1a4f96]
          border-2 border-transparent rounded-xl px-5 py-4 flex items-center justify-between transition-all shadow-sm text-left"
      >
        <p className="font-bold text-[17px] text-white">
          ランダム演習
        </p>
        <span
          className={`text-white/70 text-2xl leading-none transition-transform duration-200 inline-block ${
            isOpen ? "rotate-90" : ""
          }`}
        >
          ›
        </span>
      </button>

      {isOpen && (
        <div className="mt-2 bg-white border-2 border-slate-200 rounded-xl px-5 py-4 space-y-4">
          <p className="text-sm font-bold text-slate-600">出題数を選ぶ</p>
          <div className="grid grid-cols-5 gap-2">
            {COUNT_OPTIONS.map((n) => (
              <button
                key={n}
                onClick={() => setCount(n)}
                className={`py-3 rounded-xl border-2 font-bold text-base transition-all
                  ${
                    count === n
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:border-blue-400"
                  }`}
              >
                {n}問
              </button>
            ))}
          </div>
          <button
            onClick={() => router.push(`/quiz?mode=random&filter=all&autostart=${count}`)}
            className="w-full bg-gradient-to-r from-[#1e3a5f] to-[#1e5ba8] hover:from-[#162d4a] hover:to-[#1a4f96]
              text-white font-bold py-3 rounded-xl text-base transition-all shadow-sm"
          >
            {count}問スタート →
          </button>
        </div>
      )}
    </div>
  );
}
