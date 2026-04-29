// 解説文の「Xが正解」とanswerフィールドを照合するチェックスクリプト
const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "../src/data");
const files = fs
  .readdirSync(dataDir)
  .filter((f) => f.endsWith(".ts") && f !== "index.ts")
  .sort();

const numMap = { "①": 1, "②": 2, "③": 3, "④": 4, "⑤": 5 };

const errors = [];
const warnings = []; // 解説から答えを読み取れなかった問題
let checked = 0;

for (const file of files) {
  const content = fs.readFileSync(path.join(dataDir, file), "utf-8");

  // 各質問ブロックを抽出（id → answer → explanation）
  const questionRegex =
    /id:\s*"([^"]+)"[\s\S]*?answer:\s*(\d+),[\s\S]*?explanation:\s*\n?\s*"((?:[^"\\]|\\[\s\S])*?)"/g;

  let match;
  while ((match = questionRegex.exec(content)) !== null) {
    const id = match[1];
    const storedAnswer = parseInt(match[2], 10);
    // エスケープを元に戻す
    const explanation = match[3]
      .replace(/\\n/g, "\n")
      .replace(/\\t/g, "\t")
      .replace(/\\\\/g, "\\")
      .replace(/\\"/g, '"');

    // 解説から正解番号を読み取る（複数パターン試行、最後のマッチを優先）
    let foundAnswer = null;

    // パターン1: 「Xが正解」（最後の出現）
    const p1 = /([①②③④⑤])が正解/g;
    let m1, last1 = null;
    while ((m1 = p1.exec(explanation)) !== null) last1 = m1[1];
    if (last1) foundAnswer = numMap[last1];

    // パターン2: 「よってX」（最後の出現、パターン1で見つからない場合）
    if (!foundAnswer) {
      const p2 = /よって([①②③④⑤])/g;
      let m2, last2 = null;
      while ((m2 = p2.exec(explanation)) !== null) last2 = m2[1];
      if (last2) foundAnswer = numMap[last2];
    }

    // パターン3: 「→ X」「→X」（最後の出現）
    if (!foundAnswer) {
      const p3 = /→\s*([①②③④⑤])/g;
      let m3, last3 = null;
      while ((m3 = p3.exec(explanation)) !== null) last3 = m3[1];
      if (last3) foundAnswer = numMap[last3];
    }

    // パターン4: 「正解は X」
    if (!foundAnswer) {
      const p4 = /正解は([①②③④⑤])/g;
      let m4, last4 = null;
      while ((m4 = p4.exec(explanation)) !== null) last4 = m4[1];
      if (last4) foundAnswer = numMap[last4];
    }

    if (foundAnswer === null) {
      warnings.push({ id, storedAnswer, file });
    } else if (foundAnswer !== storedAnswer) {
      errors.push({ id, storedAnswer, explanationAnswer: foundAnswer, file });
    }

    checked++;
  }
}

// ── 結果出力 ──────────────────────────────────────────
console.log(`\n========================================`);
console.log(`  正解番号チェック結果`);
console.log(`========================================`);
console.log(`チェック数: ${checked} 問\n`);

if (errors.length === 0) {
  console.log("✓ 不一致なし（解説文のanswerと一致）");
} else {
  console.log(`⚠  不一致 ${errors.length} 件：`);
  for (const e of errors) {
    console.log(
      `  [${e.file}] ${e.id}  ← 要確認`
    );
    console.log(
      `      answerフィールド: ${e.storedAnswer}  /  解説文から読み取り: ${e.explanationAnswer}`
    );
  }
}

if (warnings.length > 0) {
  console.log(
    `\n△ 解説から正解番号を読み取れなかった問題 ${warnings.length} 件：`
  );
  for (const w of warnings) {
    console.log(`  [${w.file}] ${w.id}  (answer: ${w.storedAnswer})`);
  }
  console.log("  ※ 手動で確認してください");
}

console.log(`\n========================================\n`);
