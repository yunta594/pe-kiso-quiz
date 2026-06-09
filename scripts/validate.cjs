/**
 * scripts/validate.cjs
 * 問題データ総合バリデーションスクリプト
 *
 * チェック項目:
 *   ① IDの重複
 *   ② 必須フィールドの欠落
 *   ③ 正解番号の範囲（1〜5）
 *   ④ 選択肢数（5つ）
 *   ⑤ 問題数（年度×30問、年度×群×6問）
 *   ⑥ 画像ファイルの存在
 *   ⑦ 解説文の正解番号とanswerフィールドの整合
 *
 * 使用方法: node scripts/validate.cjs
 */

"use strict";

const fs   = require("fs");
const path = require("path");

const dataDir   = path.join(__dirname, "../src/data");
const publicDir = path.join(__dirname, "../public");

// ─────────────────────────────────────────────────────────────
// 定数
// ─────────────────────────────────────────────────────────────

const PAST_YEARS = ["R07", "R06", "R05", "R04", "R03", "R02", "R01R", "R01"];
const YEAR_LABEL = {
  R07: "令和7年度", R06: "令和6年度", R05: "令和5年度", R04: "令和4年度",
  R03: "令和3年度", R02: "令和2年度", R01R: "令和元年度(再試験)", R01: "令和元年度",
};
const MOCK_YEARS  = ["MP1", "MP2", "MP3"];
const NUM_GROUPS  = 5;
const Q_PER_GROUP = 6;   // 1年度・1群あたり
const ANSWER_MIN  = 1;
const ANSWER_MAX  = 5;
const CHOICES_LEN = 5;

const NUM_MAP = { "①": 1, "②": 2, "③": 3, "④": 4, "⑤": 5 };

// ─────────────────────────────────────────────────────────────
// ヘルパー: choices配列の要素数をカウント（文字列内の[]を無視）
// ─────────────────────────────────────────────────────────────

function countChoices(block) {
  const start = block.indexOf("choices:");
  if (start === -1) return 0;

  // choices: の後の [ を探す
  let i = start + "choices:".length;
  while (i < block.length && block[i] !== "[") i++;
  if (i >= block.length) return 0;
  i++; // [ を跨ぐ

  // 対応する ] まで走査（文字列内を正しくスキップ）
  let depth = 1, inStr = false, escaped = false, openBracket = i;
  while (i < block.length && depth > 0) {
    const ch = block[i];
    if (escaped)       { escaped = false; }
    else if (ch === "\\" && inStr) { escaped = true; }
    else if (ch === '"') { inStr = !inStr; }
    else if (!inStr) {
      if (ch === "[") depth++;
      else if (ch === "]") depth--;
    }
    i++;
  }
  const content = block.slice(openBracket, i - 1);

  // 最外層の " ... " を数える（文字列ひとつ＝選択肢ひとつ）
  let count = 0;
  inStr = false; escaped = false;
  for (const ch of content) {
    if (escaped)       { escaped = false; }
    else if (ch === "\\" && inStr) { escaped = true; }
    else if (ch === '"') {
      if (!inStr) count++;
      inStr = !inStr;
    }
  }
  return count;
}

// ─────────────────────────────────────────────────────────────
// ファイル収集
// ─────────────────────────────────────────────────────────────

const pastFiles = fs.readdirSync(dataDir)
  .filter(f => f.endsWith(".ts") && f !== "index.ts" && !f.startsWith("mock_"))
  .sort();

const mockFiles = fs.readdirSync(dataDir)
  .filter(f => f.startsWith("mock_") && f.endsWith(".ts"))
  .sort();

// ─────────────────────────────────────────────────────────────
// 問題データ抽出
// ─────────────────────────────────────────────────────────────

function parseFile(filename) {
  const content = fs.readFileSync(path.join(dataDir, filename), "utf-8");
  const questions = [];

  // id: の出現位置を全て取得し、各ブロックの範囲を決める
  const idPat = /\bid:\s*"([^"]+)"/g;
  const markers = [];
  let m;
  while ((m = idPat.exec(content)) !== null) {
    markers.push({ id: m[1], start: m.index });
  }

  for (let i = 0; i < markers.length; i++) {
    const blockStart = markers[i].start;
    const blockEnd   = i + 1 < markers.length ? markers[i + 1].start : content.length;
    const block      = content.slice(blockStart, blockEnd);

    // 各フィールドを個別に抽出
    const id         = markers[i].id;
    const yearM      = block.match(/\byear:\s*"([^"]+)"/);
    const yearLabelM = block.match(/\byearLabel:\s*"([^"]+)"/);
    const groupM     = block.match(/\bgroup:\s*(\d+)/);
    const groupLabelM= block.match(/\bgroupLabel:\s*"([^"]+)"/);
    const numberM    = block.match(/\bnumber:\s*(\d+)/);
    const answerM    = block.match(/\banswer:\s*(\d+)/);
    const imageM     = block.match(/\bimage:\s*"([^"]+)"/);
    const choiceImgM = block.match(/\bchoiceImage:\s*"([^"]+)"/);
    const explImgM   = block.match(/\bexplanationImage:\s*"([^"]+)"/);

    // 必須フィールドの存在確認
    const hasQuestion    = /\bquestion:\s*/.test(block);
    const hasChoices     = /\bchoices:\s*\[/.test(block);
    const hasAnswer      = /\banswer:\s*\d/.test(block);
    const hasExplanation = /\bexplanation:\s*/.test(block);
    const hasYearLabel   = /\byearLabel:\s*/.test(block);
    const hasGroupLabel  = /\bgroupLabel:\s*/.test(block);

    // 選択肢数（文字列内の[]を正しくスキップして計数）
    const choicesCount = countChoices(block);

    // 参照画像リスト
    const images = [imageM?.[1], choiceImgM?.[1], explImgM?.[1]].filter(Boolean);

    // 解説テキスト（正解番号照合用）
    let explanationText = null;
    const explM = block.match(/\bexplanation:\s*\n?\s*"((?:[^"\\]|\\[\s\S])*?)"/);
    if (explM) {
      explanationText = explM[1]
        .replace(/\\n/g, "\n").replace(/\\t/g, "\t")
        .replace(/\\\\/g, "\\").replace(/\\"/g, '"');
    }

    questions.push({
      id,
      year:       yearM?.[1]       ?? null,
      yearLabel:  yearLabelM?.[1]  ?? null,
      group:      groupM  ? parseInt(groupM[1])  : null,
      groupLabel: groupLabelM?.[1] ?? null,
      number:     numberM ? parseInt(numberM[1]) : null,
      answer:     answerM ? parseInt(answerM[1]) : null,
      choicesCount,
      images,
      hasQuestion, hasChoices, hasAnswer, hasExplanation,
      hasYearLabel, hasGroupLabel,
      explanationText,
      filename,
    });
  }

  return questions;
}

const pastQuestions = pastFiles.flatMap(f => parseFile(f));
const mockQuestions = mockFiles.flatMap(f => parseFile(f));
const allQuestions  = [...pastQuestions, ...mockQuestions];

// ─────────────────────────────────────────────────────────────
// チェック結果バッファ
// ─────────────────────────────────────────────────────────────

const errors   = [];   // 確実な誤り
const warnings = [];   // 要手動確認

function fail(msg) { errors.push(msg); }
function warn(msg) { warnings.push(msg); }

// ─────────────────────────────────────────────────────────────
// ① IDの重複チェック
// ─────────────────────────────────────────────────────────────

const idCount = {};
for (const q of allQuestions) {
  idCount[q.id] = (idCount[q.id] ?? 0) + 1;
}
for (const [id, cnt] of Object.entries(idCount)) {
  if (cnt > 1) fail(`[重複ID] "${id}" が ${cnt} 件存在する`);
}

// ─────────────────────────────────────────────────────────────
// ② 必須フィールドの欠落チェック
// ─────────────────────────────────────────────────────────────

for (const q of allQuestions) {
  const missing = [];
  if (!q.year)         missing.push("year");
  if (!q.hasYearLabel) missing.push("yearLabel");
  if (q.group === null)missing.push("group");
  if (!q.hasGroupLabel)missing.push("groupLabel");
  if (q.number === null)missing.push("number");
  if (!q.hasQuestion)  missing.push("question");
  if (!q.hasChoices)   missing.push("choices");
  if (!q.hasAnswer)    missing.push("answer");
  if (!q.hasExplanation)missing.push("explanation");
  if (missing.length > 0) {
    fail(`[必須欠落] [${q.id}] ${missing.join(", ")} がない`);
  }
}

// ─────────────────────────────────────────────────────────────
// ③ 正解番号の範囲チェック（1〜5）
// ─────────────────────────────────────────────────────────────

for (const q of allQuestions) {
  if (q.answer === null) {
    fail(`[範囲外] [${q.id}] answer を読み取れない`);
  } else if (q.answer < ANSWER_MIN || q.answer > ANSWER_MAX) {
    fail(`[範囲外] [${q.id}] answer=${q.answer}（${ANSWER_MIN}〜${ANSWER_MAX} であること）`);
  }
}

// ─────────────────────────────────────────────────────────────
// ④ 選択肢数チェック（5つ）
// ─────────────────────────────────────────────────────────────

for (const q of allQuestions) {
  if (q.choicesCount !== CHOICES_LEN) {
    fail(`[選択肢数] [${q.id}] ${q.choicesCount}個（${CHOICES_LEN}個であること）`);
  }
}

// ─────────────────────────────────────────────────────────────
// ⑤ 問題数チェック（過去問のみ）
// ─────────────────────────────────────────────────────────────

// 年度別総数（30問）
for (const year of PAST_YEARS) {
  const cnt = pastQuestions.filter(q => q.year === year).length;
  const expected = NUM_GROUPS * Q_PER_GROUP;
  if (cnt !== expected) {
    fail(`[問題数] ${YEAR_LABEL[year]}(${year}): ${cnt}問（期待値 ${expected}問）`);
  }
}

// 年度×群別（6問）
for (const year of PAST_YEARS) {
  for (let g = 1; g <= NUM_GROUPS; g++) {
    const cnt = pastQuestions.filter(q => q.year === year && q.group === g).length;
    if (cnt !== Q_PER_GROUP) {
      fail(`[問題数] ${year} 群${g}: ${cnt}問（期待値 ${Q_PER_GROUP}問）`);
    }
  }
}

// 群別総数（8年×6問=48問）
for (let g = 1; g <= NUM_GROUPS; g++) {
  const cnt = pastQuestions.filter(q => q.group === g).length;
  const expected = PAST_YEARS.length * Q_PER_GROUP;
  if (cnt !== expected) {
    fail(`[問題数] ${g}群 合計: ${cnt}問（期待値 ${expected}問）`);
  }
}

// ─────────────────────────────────────────────────────────────
// ⑥ 画像ファイルの存在チェック
// ─────────────────────────────────────────────────────────────

const checkedImages = new Set();
for (const q of allQuestions) {
  for (const imgPath of q.images) {
    if (checkedImages.has(imgPath)) continue;
    checkedImages.add(imgPath);
    const full = path.join(publicDir, imgPath);
    if (!fs.existsSync(full)) {
      fail(`[画像なし] [${q.id}] "${imgPath}" が public/ に存在しない`);
    }
  }
}

// ─────────────────────────────────────────────────────────────
// ⑦ 解説文の正解番号 ↔ answerフィールドの整合チェック
// ─────────────────────────────────────────────────────────────

for (const q of allQuestions) {
  if (!q.explanationText || q.answer === null) continue;

  const text = q.explanationText;
  let found = null;

  const patterns = [
    /([①②③④⑤])が正解/g,
    /よって([①②③④⑤])/g,
    /→\s*([①②③④⑤])/g,
    /正解は([①②③④⑤])/g,
    /したがって、?正解は?([①②③④⑤])/g,
  ];

  for (const pat of patterns) {
    if (found) break;
    let m, last = null;
    while ((m = pat.exec(text)) !== null) last = m[1];
    if (last) found = NUM_MAP[last];
  }

  if (found === null) {
    warn(`[解説照合] [${q.id}] 解説から正解番号を読み取れない（answer=${q.answer}）`);
  } else if (found !== q.answer) {
    fail(`[解説照合] [${q.id}] 解説→${found} / answerフィールド→${q.answer} が不一致`);
  }
}

// ─────────────────────────────────────────────────────────────
// 出力
// ─────────────────────────────────────────────────────────────

const W  = 56;
const eq = "═".repeat(W);
const hr = "─".repeat(W);

console.log(`\n${eq}`);
console.log(`  問題データ 総合バリデーション結果`);
console.log(`${eq}`);
console.log(`  過去問 : ${pastQuestions.length}問（${PAST_YEARS.length}年度）`);
console.log(`  モック : ${mockQuestions.length}問`);
console.log(`  合  計 : ${allQuestions.length}問`);
console.log(hr);

// エラー
if (errors.length === 0) {
  console.log(`\n  ✅ エラー: なし\n`);
} else {
  console.log(`\n  ❌ エラー: ${errors.length}件`);
  console.log(hr);
  for (const e of errors) console.log(`  ✗ ${e}`);
  console.log();
}

// 警告
if (warnings.length === 0) {
  console.log(`  ✅ 警告: なし\n`);
} else {
  console.log(`  ⚠  警告（手動確認推奨）: ${warnings.length}件`);
  console.log(hr);
  for (const w of warnings) console.log(`  △ ${w}`);
  console.log();
}

// 統計サマリー
console.log(hr);
console.log("  【統計サマリー】");
console.log(hr);
const byYear = {};
for (const q of pastQuestions) {
  byYear[q.year] = (byYear[q.year] ?? 0) + 1;
}
for (const y of PAST_YEARS) {
  const cnt = byYear[y] ?? 0;
  const ok = cnt === 30 ? "✅" : "❌";
  console.log(`  ${ok} ${(YEAR_LABEL[y] ?? y).padEnd(18)} ${cnt}問`);
}
console.log(hr);
for (let g = 1; g <= NUM_GROUPS; g++) {
  const cnt = pastQuestions.filter(q => q.group === g).length;
  const ok  = cnt === PAST_YEARS.length * Q_PER_GROUP ? "✅" : "❌";
  const labels = ["設計・計画","情報・論理","解析","材料・化学・バイオ","環境・エネルギー・技術"];
  console.log(`  ${ok} ${g}群：${labels[g-1].padEnd(15)} ${cnt}問`);
}
console.log(`${eq}\n`);

process.exit(errors.length > 0 ? 1 : 0);
