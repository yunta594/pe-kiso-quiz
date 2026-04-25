import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  try {
    const { question, choices, answer, explanation } = await req.json();

    const NUMS = ["①", "②", "③", "④", "⑤"];

    const prompt = `あなたは技術士一次試験の基礎科目の専門家です。以下の問題について、わかりやすい解説をしてください。

問題：
${question}

選択肢：
${choices.map((c: string, i: number) => `${NUMS[i]} ${c}`).join("\n")}

正解：${NUMS[answer - 1]}

既存の解説：
${explanation}

上記の問題について、以下の点を含めて受験者にわかりやすく解説してください：
1. なぜその選択肢が正解なのか（理由を明確に）
2. 誤りの選択肢はどこが違うのか
3. 試験に役立つ重要なポイントや覚え方

技術士試験を目指す方に役立つ、具体的で丁寧な解説をお願いします。`;

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";

    return NextResponse.json({ explanation: text });
  } catch (error) {
    console.error("AI explain error:", error);
    return NextResponse.json(
      { error: "解説の生成に失敗しました。" },
      { status: 500 }
    );
  }
}
