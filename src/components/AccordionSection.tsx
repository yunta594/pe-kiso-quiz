"use client";

import { useState } from "react";

interface Props {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export default function AccordionSection({ title, children, defaultOpen = false }: Props) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-2 text-left group"
      >
        <p className="font-bold text-slate-500 text-sm flex items-center gap-1.5">
          <span className="w-1 h-3.5 bg-blue-400 rounded inline-block" />
          {title}
        </p>
        <span
          className={`text-slate-400 text-lg transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          ▾
        </span>
      </button>
      {isOpen && <div className="mt-2">{children}</div>}
    </div>
  );
}
