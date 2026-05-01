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

  const btnClass =
    variant === "orange"
      ? "bg-gradient-to-r from-orange-600 to-orange-400 hover:from-orange-700 hover:to-orange-500 border-transparent text-white shadow-sm"
      : "bg-gradient-to-r from-[#1e3a5f] to-[#2563eb] hover:from-[#162d4a] hover:to-[#1d4ed8] border-transparent text-white shadow-sm";

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full border-2 rounded-xl pl-7 pr-5 py-4
          flex items-center justify-between transition-all hover:shadow-md text-left group ${btnClass}`}
      >
        <p className="font-bold text-[17px] text-white">
          {title}
        </p>
        <span
          className={`text-white/70 text-2xl leading-none transition-transform duration-200 inline-block ${
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
