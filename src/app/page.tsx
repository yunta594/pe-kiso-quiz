import Link from "next/link";
import {
  YEAR_LABELS,
  GROUP_LABELS,
  MOCK_LABELS,
  questionsByYear,
  questionsByGroup,
  questionsByMock,
  allQuestions,
  mockQuestions,
} from "@/data";

export default function Home() {
  const scienceHistoryCount = [...allQuestions, ...mockQuestions].filter(
    (q) => q.tags?.includes("科学技術史")
  ).length;

  return (
    <div className="min-h-screen bg-slate-100">
      {/* ヘッダー */}
      <header className="bg-[#1e3a5f] text-white shadow-lg">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <p className="text-blue-200 text-sm font-medium mb-1">技術士一次試験</p>
          <h1 className="text-2xl font-bold leading-tight">基礎科目 練習問題</h1>
          <p className="text-blue-300 text-sm mt-1">
            過去問解説付き・全{Object.values(questionsByYear).flat().length}問
          </p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        {/* 年度別 */}
        <section>
          <h2 className="text-lg font-bold text-[#1e3a5f] mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-blue-600 rounded inline-block" />
            年度別で学習する
          </h2>
          <div className="grid gap-3">
            {Object.entries(YEAR_LABELS).map(([year, label]) => {
              const count = questionsByYear[year]?.length ?? 0;
              return (
                <Link
                  key={year}
                  href={`/quiz?mode=year&filter=${year}`}
                  className="bg-white hover:bg-blue-50 border-2 border-slate-200 hover:border-blue-400
                    rounded-xl px-5 py-4 flex items-center justify-between transition-all group"
                >
                  <div>
                    <p className="font-bold text-[17px] text-slate-800 group-hover:text-blue-700 transition-colors">
                      {label}
                    </p>
                    <p className="text-sm text-slate-400 mt-0.5">{count}問収録</p>
                  </div>
                  <span className="text-slate-300 group-hover:text-blue-400 text-2xl transition-colors">
                    ›
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 問題群別 */}
        <section>
          <h2 className="text-lg font-bold text-[#1e3a5f] mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-blue-600 rounded inline-block" />
            問題群別で学習する
          </h2>
          <div className="grid gap-3">
            {Object.entries(GROUP_LABELS).map(([num, label]) => {
              const count = questionsByGroup[Number(num)]?.length ?? 0;
              return (
                <Link
                  key={num}
                  href={`/quiz?mode=group&filter=${num}`}
                  className="bg-white hover:bg-blue-50 border-2 border-slate-200 hover:border-blue-400
                    rounded-xl px-5 py-4 flex items-center justify-between transition-all group"
                >
                  <div>
                    <p className="font-bold text-[17px] text-slate-800 group-hover:text-blue-700 transition-colors">
                      {label}
                    </p>
                    <p className="text-sm text-slate-400 mt-0.5">{count}問収録</p>
                  </div>
                  <span className="text-slate-300 group-hover:text-blue-400 text-2xl transition-colors">
                    ›
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* テーマ別 */}
        <section>
          <h2 className="text-lg font-bold text-[#1e3a5f] mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-blue-600 rounded inline-block" />
            テーマ別で学習する
          </h2>
          <div className="grid gap-3">
            <Link
              href="/quiz?mode=topic&filter=科学技術史"
              className="bg-white hover:bg-amber-50 border-2 border-slate-200 hover:border-amber-400
                rounded-xl px-5 py-4 flex items-center justify-between transition-all group"
            >
              <div>
                <p className="font-bold text-[17px] text-slate-800 group-hover:text-amber-700 transition-colors">
                  科学技術史
                </p>
                <p className="text-sm text-slate-400 mt-0.5">
                  過去問＋練習問題 {scienceHistoryCount}問収録
                </p>
              </div>
              <span className="text-slate-300 group-hover:text-amber-400 text-2xl transition-colors">
                ›
              </span>
            </Link>
          </div>
        </section>

        {/* 練習問題（模擬試験） */}
        <section>
          <h2 className="text-lg font-bold text-[#1e3a5f] mb-2 flex items-center gap-2">
            <span className="w-1 h-5 bg-amber-500 rounded inline-block" />
            練習問題（模擬試験）
          </h2>
          <p className="text-xs text-slate-400 mb-4">
            ※ 練習問題はAIが生成した問題を含みます。問題カードに出典を表示しています。
          </p>
          <div className="grid gap-3">
            {Object.entries(MOCK_LABELS).map(([key, label]) => {
              const count = questionsByMock[key]?.length ?? 0;
              return (
                <Link
                  key={key}
                  href={`/quiz?mode=mock&filter=${key}`}
                  className="bg-white hover:bg-amber-50 border-2 border-slate-200 hover:border-amber-400
                    rounded-xl px-5 py-4 flex items-center justify-between transition-all group"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-bold text-[17px] text-slate-800 group-hover:text-amber-700 transition-colors">
                        {label}
                      </p>
                      <span className="text-[11px] bg-amber-100 text-amber-700 font-medium px-2 py-0.5 rounded-full">
                        AI生成含む
                      </span>
                    </div>
                    <p className="text-sm text-slate-400">{count}問収録</p>
                  </div>
                  <span className="text-slate-300 group-hover:text-amber-400 text-2xl transition-colors">
                    ›
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ランダム */}
        <section>
          <Link
            href="/quiz?mode=random&filter=all"
            className="block bg-[#1e3a5f] hover:bg-[#162d4a] text-white rounded-xl px-5 py-5
              text-center transition-colors shadow-md"
          >
            <p className="font-bold text-xl">ランダム演習</p>
            <p className="text-blue-200 text-sm mt-1">
              過去問全{Object.values(questionsByYear).flat().length}問からランダム出題
            </p>
          </Link>
        </section>

        {/* 基礎科目の説明 */}
        <section className="bg-white rounded-2xl border border-slate-200 px-5 py-5">
          <h3 className="font-bold text-slate-700 text-base mb-3">基礎科目について</h3>
          <div className="text-sm text-slate-500 space-y-1.5 leading-relaxed">
            <p>・1群〜5群から各3問選択、計15問を解答</p>
            <p>・試験時間：60分</p>
            <p>・合格ライン：50%以上（8問以上正解）が目安</p>
          </div>
        </section>
      </main>

      <footer className="text-center text-xs text-slate-400 py-8">
        技術士一次試験 基礎科目 練習問題アプリ
      </footer>
    </div>
  );
}
