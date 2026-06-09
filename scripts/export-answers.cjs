/**
 * 過去問の正解番号を年度・群・問番号順に一覧出力するスクリプト。
 * 技術士会公表の正答と目視照合するために使用する。
 *
 * 使用方法: node scripts/export-answers.cjs
 */
const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "../src/data");

// 過去問ファイルのみ対象（mock, index は除外）
const files = fs
  .readdirSync(dataDir)
  .filter(
    (f) =>
      f.endsWith(".ts") &&
      f !== "index.ts" &&
      !f.startsWith("mock_")
  )
  .sort();

// 年度ラベル
const YEAR_LABELS = {
  R07: "令和7年度（2025年）",
  R06: "令和6年度（2024年）",
  R05: "令和5年度（2023年）",
  R04: "令和4年度（2022年）",
  R03: "令和3年度（2021年）",
  R02: "令和2年度（2020年）",
  R01R: "令和元年度（再試験）",
  R01: "令和元年度（2019年）",
};

// 群ラベル
const GROUP_LABELS = {
  1: "1群：設計・計画",
  2: "2群：情報・論理",
  3: "3群：解析",
  4: "4群：材料・化学・バイオ",
  5: "5群：環境・エネルギー・技術",
};

const questionRegex =
  /id:\s*"([^"]+)"[\s\S]*?year:\s*"([^"]+)"[\s\S]*?group:\s*(\d+),[\s\S]*?number:\s*(\d+),[\s\S]*?answer:\s*(\d+),/g;

const allQuestions = [];
let totalProblems = 0;

for (const file of files) {
  const content = fs.readFileSync(path.join(dataDir, file), "utf-8");
  let match;
  while ((match = questionRegex.exec(content)) !== null) {
    allQuestions.push({
      id: match[1],
      year: match[2],
      group: parseInt(match[3]),
      number: parseInt(match[4]),
      answer: parseInt(match[5]),
    });
    totalProblems++;
  }
}

// 年度 → 群 → 問番号 順にソート
const yearOrder = ["R07", "R06", "R05", "R04", "R03", "R02", "R01R", "R01"];
allQuestions.sort((a, b) => {
  const yi = yearOrder.indexOf(a.year) - yearOrder.indexOf(b.year);
  if (yi !== 0) return yi;
  if (a.group !== b.group) return a.group - b.group;
  return a.number - b.number;
});

// ── 出力 ──────────────────────────────────────────────

console.log("\n========================================");
console.log("  技術士一次試験 基礎科目 正解番号一覧");
console.log("  （技術士会公表の正答と照合してください）");
console.log("========================================\n");

let currentYear = "";
let currentGroup = "";
let yearCount = 0;
let groupCount = 0;

for (const q of allQuestions) {
  if (q.year !== currentYear) {
    if (currentYear !== "") {
      console.log(`    → 年度計: ${yearCount}問\n`);
    }
    currentYear = q.year;
    currentGroup = "";
    yearCount = 0;
    console.log(`【${YEAR_LABELS[q.year] ?? q.year}】`);
  }

  if (q.group !== currentGroup) {
    if (currentGroup !== "") {
      console.log(`      群計: ${groupCount}問`);
    }
    currentGroup = q.group;
    groupCount = 0;
    console.log(`  ${GROUP_LABELS[q.group] ?? `${q.group}群`}`);
  }

  console.log(
    `    I-${q.group}-${q.number}  正解: [${"①②③④⑤"[q.answer - 1]}] (${q.answer})   [${q.id}]`
  );
  yearCount++;
  groupCount++;
}

if (currentYear !== "") {
  console.log(`      群計: ${groupCount}問`);
  console.log(`    → 年度計: ${yearCount}問`);
}

console.log(`\n----------------------------------------`);
console.log(`  合計: ${totalProblems} 問`);
console.log(`----------------------------------------\n`);

// ─── 年度×問番号マトリクス（コンパクト版）────────────────────
console.log("【コンパクト照合表】（①②③④⑤で表示）\n");
console.log("年度         I-1-1 I-1-2 I-1-3 I-1-4 I-1-5 I-1-6  I-2-1 I-2-2 I-2-3 I-2-4 I-2-5 I-2-6  I-3-1 I-3-2 I-3-3 I-3-4 I-3-5 I-3-6  I-4-1 I-4-2 I-4-3 I-4-4 I-4-5 I-4-6  I-5-1 I-5-2 I-5-3 I-5-4 I-5-5 I-5-6");
console.log("─".repeat(185));

const byYear = {};
for (const q of allQuestions) {
  if (!byYear[q.year]) byYear[q.year] = {};
  byYear[q.year][`${q.group}-${q.number}`] = "①②③④⑤"[q.answer - 1];
}

for (const year of yearOrder) {
  if (!byYear[year]) continue;
  const data = byYear[year];
  const nums = ["①②③④⑤"];
  const cells = [];
  for (let g = 1; g <= 5; g++) {
    for (let n = 1; n <= 6; n++) {
      cells.push((data[`${g}-${n}`] ?? " ").padStart(3));
    }
    if (g < 5) cells.push(" ");
  }
  console.log(`${(YEAR_LABELS[year] ?? year).padEnd(14)} ${cells.join("")}`);
}

console.log("\n========================================\n");
