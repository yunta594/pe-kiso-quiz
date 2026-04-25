import type { Question } from "@/types";
import { r05Questions } from "./r05";
import { r06Questions } from "./r06";
import { r07Questions } from "./r07";
import { mockP1Questions } from "./mock_p1";
import { mockP2Questions } from "./mock_p2";
import { mockP3Questions } from "./mock_p3";

export const allQuestions: Question[] = [
  ...r07Questions,
  ...r06Questions,
  ...r05Questions,
];

export const mockQuestions: Question[] = [
  ...mockP1Questions,
  ...mockP2Questions,
  ...mockP3Questions,
];

export const questionsByYear: Record<string, Question[]> = {
  R07: r07Questions,
  R06: r06Questions,
  R05: r05Questions,
};

export const questionsByMock: Record<string, Question[]> = {
  MP1: mockP1Questions,
  MP2: mockP2Questions,
  MP3: mockP3Questions,
};

export const questionsByGroup: Record<number, Question[]> = {
  1: allQuestions.filter((q) => q.group === 1),
  2: allQuestions.filter((q) => q.group === 2),
  3: allQuestions.filter((q) => q.group === 3),
  4: allQuestions.filter((q) => q.group === 4),
  5: allQuestions.filter((q) => q.group === 5),
};

export const GROUP_LABELS: Record<number, string> = {
  1: "1群：設計・計画",
  2: "2群：情報・論理",
  3: "3群：解析",
  4: "4群：材料・化学・バイオ",
  5: "5群：環境・エネルギー・技術",
};

export const YEAR_LABELS: Record<string, string> = {
  R07: "令和7年度（2025年）",
  R06: "令和6年度（2024年）",
  R05: "令和5年度（2023年）",
};

export const MOCK_LABELS: Record<string, string> = {
  MP1: "模擬試験 パターン1",
  MP2: "模擬試験 パターン2",
  MP3: "模擬試験 パターン3",
};

export const TOPIC_LABELS: Record<string, string> = {
  科学技術史: "科学技術史",
};

export function getQuestions(
  mode: string,
  filter: string,
  groups: number[],
  count: number
): Question[] {
  let pool: Question[];

  if (mode === "year") {
    pool = [...(questionsByYear[filter] ?? [])];
  } else if (mode === "group") {
    pool = [...(questionsByGroup[Number(filter)] ?? [])];
  } else if (mode === "mock") {
    pool =
      filter === "all"
        ? [...mockQuestions]
        : [...(questionsByMock[filter] ?? [])];
  } else if (mode === "topic") {
    const allWithMock = [...allQuestions, ...mockQuestions];
    pool = allWithMock.filter((q) => q.tags?.includes(filter));
  } else {
    pool = [...allQuestions];
  }

  // group・topic モード以外でグループ絞り込み
  if (mode !== "group" && mode !== "topic" && groups.length > 0 && groups.length < 5) {
    pool = pool.filter((q) => groups.includes(q.group));
  }

  shuffle(pool);
  return pool.slice(0, Math.min(count, pool.length));
}

function shuffle<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
