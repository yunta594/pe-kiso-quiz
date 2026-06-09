import React from "react";

// ─── Combining overline mapping ───────────────────────────────────────────────
// U+0304 combining macron / U+0305 combining overline above → CSS overline

// ─── Nuclide notation (left-superscript / left-subscript) ────────────────────
// Unicode superscript digits  ⁰¹²³⁴⁵⁶⁷⁸⁹
const SUP_MAP: Record<string, string> = {
  "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4",
  "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9",
};
// Unicode subscript digits  ₀₁₂₃₄₅₆₇₈₉
const SUB_MAP: Record<string, string> = {
  "₀": "0", "₁": "1", "₂": "2", "₃": "3", "₄": "4",
  "₅": "5", "₆": "6", "₇": "7", "₈": "8", "₉": "9",
};

function isSup(ch: string) { return ch in SUP_MAP; }
function isSub(ch: string) { return ch in SUB_MAP; }
function toDigits(s: string, map: Record<string, string>) {
  return s.split("").map(c => map[c] ?? c).join("");
}

/**
 * テキスト中の特殊表記を JSX に変換する。
 *  - Combining macron/overline (U+0304/U+0305) → CSS text-decoration:overline
 *  - 核種記法 ⁴⁰₂₀Ca → 左上/左下に質量数・原子番号を CSS 配置
 * whitespace-pre-wrap コンテナ内でそのまま使用可能。
 */
export function renderWithOverlines(text: string): React.ReactNode {
  const hasOverline = text.includes("̄") || text.includes("̅");
  const hasNuclide  = /[⁰¹²³⁴⁵⁶⁷⁸⁹]/.test(text) && /[₀₁₂₃₄₅₆₇₈₉]/.test(text);
  if (!hasOverline && !hasNuclide) return text;

  const parts: React.ReactNode[] = [];
  let i = 0;
  let buf = "";

  const flush = () => { if (buf) { parts.push(buf); buf = ""; } };

  while (i < text.length) {
    const ch   = text[i];
    const next = text[i + 1];

    // ── Combining overline ────────────────────────────────────────────────────
    if (next === "̄" || next === "̅") {
      flush();
      parts.push(
        <span key={i} style={{ textDecoration: "overline" }}>{ch}</span>
      );
      i += 2;
      continue;
    }

    // ── Nuclide: sup-digits + sub-digits + Element symbol ────────────────────
    if (isSup(ch)) {
      let j = i;
      let sup = "";
      while (j < text.length && isSup(text[j])) { sup += text[j]; j++; }

      if (j < text.length && isSub(text[j])) {
        let sub = "";
        while (j < text.length && isSub(text[j])) { sub += text[j]; j++; }

        if (j < text.length && /[A-Z]/.test(text[j])) {
          let elem = text[j]; j++;
          if (j < text.length && /[a-z]/.test(text[j])) { elem += text[j]; j++; }

          flush();
          const supNum = toDigits(sup, SUP_MAP);
          const subNum = toDigits(sub, SUB_MAP);
          const padEm  = `${Math.max(supNum.length, subNum.length) * 0.52}em`;

          parts.push(
            <span
              key={i}
              style={{ display: "inline-block", position: "relative", paddingLeft: padEm }}
            >
              <span style={{
                position: "absolute", top: "-0.55em", left: 0,
                fontSize: "0.72em", lineHeight: 1, whiteSpace: "nowrap",
              }}>
                {supNum}
              </span>
              <span style={{
                position: "absolute", bottom: "-0.35em", left: 0,
                fontSize: "0.72em", lineHeight: 1, whiteSpace: "nowrap",
              }}>
                {subNum}
              </span>
              {elem}
            </span>
          );
          i = j;
          continue;
        }
      }
    }

    buf += ch;
    i++;
  }

  flush();
  return <>{parts}</>;
}
