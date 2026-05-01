import type { Question } from "@/types";
import { r01Questions } from "./r01";
import { r01rQuestions } from "./r01r";
import { r02Questions } from "./r02";
import { r03Questions } from "./r03";
import { r04Questions } from "./r04";
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
  ...r04Questions,
  ...r03Questions,
  ...r02Questions,
  ...r01rQuestions,
  ...r01Questions,
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
  R04: r04Questions,
  R03: r03Questions,
  R02: r02Questions,
  R01R: r01rQuestions,
  R01: r01Questions,
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
  R04: "令和4年度（2022年）",
  R03: "令和3年度（2021年）",
  R02: "令和2年度（2020年）",
  R01R: "令和元年度（再試験）（2019年）",
  R01: "令和元年度（2019年）",
};

export const MOCK_LABELS: Record<string, string> = {
  MP1: "練習問題 ver.1",
  MP2: "練習問題 ver.2",
  MP3: "練習問題 ver.3",
};

export const TOPIC_LABELS: Record<string, string> = {
  // 1群：設計・計画
  ユニバーサルデザイン: "ユニバーサルデザイン",
  最適化: "最適化",
  信頼性: "信頼性",
  安全設計: "安全設計",
  "材料力学・機械設計": "材料力学・機械設計",
  "確率・統計": "確率・統計",
  // 2群：情報・論理
  "基数変換・数値表現": "基数変換・数値表現",
  "論理・集合": "論理・集合",
  アルゴリズム: "アルゴリズム",
  情報セキュリティ: "情報セキュリティ",
  "ネットワーク・通信": "ネットワーク・通信",
  // 3群：解析
  "微分積分・ベクトル解析": "微分積分・ベクトル解析",
  数値解析: "数値解析",
  "材料力学・弾性体": "材料力学・弾性体",
  "振動・運動": "振動・運動",
  電気回路: "電気回路",
  電磁気学: "電磁気学",
  // 4群：材料・化学・バイオ
  化学: "化学",
  金属材料: "金属材料",
  "バイオ・生命科学": "バイオ・生命科学",
  // 5群：環境・エネルギー・技術
  環境: "環境",
  エネルギー: "エネルギー",
  "技術・施策": "技術・施策",
  科学技術史: "科学技術史",
};

export const TOPIC_GROUPS: { group: string; topics: string[] }[] = [
  {
    group: "1群：設計・計画",
    topics: ["ユニバーサルデザイン", "最適化", "信頼性", "安全設計", "材料力学・機械設計", "確率・統計"],
  },
  {
    group: "2群：情報・論理",
    topics: ["基数変換・数値表現", "論理・集合", "アルゴリズム", "情報セキュリティ", "ネットワーク・通信"],
  },
  {
    group: "3群：解析",
    topics: ["微分積分・ベクトル解析", "数値解析", "材料力学・弾性体", "振動・運動", "電気回路", "電磁気学"],
  },
  {
    group: "4群：材料・化学・バイオ",
    topics: ["化学", "金属材料", "バイオ・生命科学"],
  },
  {
    group: "5群：環境・エネルギー・技術",
    topics: ["環境", "エネルギー", "技術・施策", "科学技術史"],
  },
];

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
