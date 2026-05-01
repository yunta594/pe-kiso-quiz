"use client";

import { useState } from "react";

interface Props {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  variant?: "blue" | "emerald" | "orange";
}

export default function AccordionSection({
  title,
  children,
  defaultOpen = false,
  variant = "blue",
}: Props) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const colors =
    variant === "emerald"
      ? "hover:bg-emerald-50 hover:border-emerald-400 group-hover:text-emerald-700"
      : variant === "orange"
      ? "hover:bg-orange-50 hover:border-orange-400 group-hover:text-orange-700"
      : "hover:bg-blue-50 hover:border-blue-400 group-hover:text-blue-700";

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white border-2 border-slate-200 rounded-xl px-5 py-4
          flex items-center justify-between transition-all hover:shadow-md text-left group ${colors}`}
      >
        <p className="font-bold text-[17px] text-slate-800 group-hover:transition-colors">
          {title}
        </p>
        <span
          className={`text-slate-400 text-2xl leading-none transition-transform duration-200 inline-block ${
            isOpen ? "rotate-90" : ""
          }`}
        >
          ›
        </span>
      </button>
      {isOpen && <div className="mt-2">{children}</div>}
    </div>
  );
}
