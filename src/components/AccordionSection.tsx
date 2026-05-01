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
        className="w-full bg-white hover:bg-blue-50 border-2 border-slate-200 hover:border-blue-400
          rounded-xl px-5 py-4 flex items-center justify-between transition-all hover:shadow-md text-left group"
      >
        <p className="font-bold text-[17px] text-slate-800 group-hover:text-blue-700 transition-colors">
          {title}
        </p>
        <span className="text-slate-400 text-xl leading-none transition-all duration-200">
          {isOpen ? "▲" : "▼"}
        </span>
      </button>
      {isOpen && <div className="mt-2">{children}</div>}
    </div>
  );
}
