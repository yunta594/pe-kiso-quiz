import React from "react";

/**
 * Combining overline (U+0305) を CSS text-decoration:overline に変換して JSX を返す。
 * whitespace-pre-wrap コンテナ内でそのまま使用可能。
 */
export function renderWithOverlines(text: string): React.ReactNode {
  if (!text.includes("̅")) return text;

  const parts: React.ReactNode[] = [];
  let i = 0;
  let buf = "";

  while (i < text.length) {
    if (text[i + 1] === "̅") {
      if (buf) { parts.push(buf); buf = ""; }
      parts.push(
        <span key={i} style={{ textDecoration: "overline" }}>
          {text[i]}
        </span>
      );
      i += 2;
    } else {
      buf += text[i];
      i++;
    }
  }

  if (buf) parts.push(buf);
  return <>{parts}</>;
}
