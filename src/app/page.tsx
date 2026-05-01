import Link from "next/link";
import {
  YEAR_LABELS,
  GROUP_LABELS,
  MOCK_LABELS,
  questionsByYear,
  questionsByGroup,
  questionsByMock,
} from "@/data";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* ヘッダー */}
      <header className="bg-gradient-to-r from-[#1e3a5f] to-[#1e5ba8] text-white shadow-lg">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <p className="text-blue-200 text-sm font-medium mb-1">技術士一次試験</p>
          <h1 className="text-2xl font-bold leading-tight">基礎科目 練習問題</h1>
          <p className="text-blue-300 text-sm mt-1">
            過去問解説付き・全{Object.values(questionsByYear).flat().length}問
          </p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-10">

        {/* ===== 過去問題演習 ===== */}
        <section>
          <h2 className="text-xl font-bold text-[#1e3a5f] mb-6 pb-3 border-b-2 border-blue-200 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-blue-600 rounded inline-block" />
            過去問題演習
          </h2>

          <div className="space-y-6">
            {/* 年度別 */}
            <div>
              <p className="font-bold text-slate-500 text-sm mb-2 flex items-center gap-1.5">
                <span className="w-1 h-3.5 bg-blue-400 rounded inline-block" />
                年度別
              </p>
              <div className="grid gap-2">
                {Object.entries(YEAR_LABELS).map(([year, label]) => {
                  const count = questionsByYear[year]?.length ?? 0;
                  return (
                    <Link
                      key={year}
                      href={`/quiz?mode=year&filter=${year}`}
                      className="bg-white hover:bg-blue-50 border-2 border-slate-200 hover:border-blue-400
                        rounded-xl px-5 py-4 flex items-center justify-between transition-all hover:shadow-md hover:-translate-y-0.5 group"
                    >
                      <div>
                        <p className="font-bold text-[17px] text-slate-800 group-hover:text-blue-700 transition-colors">
                          {label}
                        </p>
                        <p className="text-sm text-slate-400 mt-0.5">{count}問収録</p>
                      </div>
                      <span className="text-slate-300 group-hover:text-blue-400 text-2xl transition-colors">›</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* 問題群別 */}
            <div>
              <p className="font-bold text-slate-500 text-sm mb-2 flex items-center gap-1.5">
                <span className="w-1 h-3.5 bg-blue-400 rounded inline-block" />
                問題群別
              </p>
              <div className="grid gap-2">
                {Object.entries(GROUP_LABELS).map(([num, label]) => {
                  const count = questionsByGroup[Number(num)]?.length ?? 0;
                  return (
                    <Link
                      key={num}
                      href={`/quiz?mode=group&filter=${num}`}
                      className="bg-white hover:bg-blue-50 border-2 border-slate-200 hover:border-blue-400
                        rounded-xl px-5 py-4 flex items-center justify-between transition-all hover:shadow-md hover:-translate-y-0.5 group"
                    >
                      <div>
                        <p className="font-bold text-[17px] text-slate-800 group-hover:text-blue-700 transition-colors">
                          {label}
                        </p>
                        <p className="text-sm text-slate-400 mt-0.5">{count}問収録</p>
                      </div>
                      <span className="text-slate-300 group-hover:text-blue-400 text-2xl transition-colors">›</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* テーマ別 */}
            <div>
              <p className="font-bold text-slate-500 text-sm mb-2 flex items-center gap-1.5">
                <span className="w-1 h-3.5 bg-blue-400 rounded inline-block" />
                テーマ別
              </p>
              <Link
                href="/topics"
                className="bg-white hover:bg-blue-50 border-2 border-slate-200 hover:border-blue-400
                  rounded-xl px-5 py-4 flex items-center justify-between transition-all hover:shadow-md hover:-translate-y-0.5 group"
              >
                <div>
                  <p className="font-bold text-[17px] text-slate-800 group-hover:text-blue-700 transition-colors">
                    テーマを選ぶ
                  </p>
                  <p className="text-sm text-slate-400 mt-0.5">
                    確率・統計・アルゴリズム・科学技術史 など
                  </p>
                </div>
                <span className="text-slate-300 group-hover:text-blue-400 text-2xl transition-colors">›</span>
              </Link>
            </div>

            {/* ランダム出題演習 */}
            <div>
              <p className="font-bold text-slate-500 text-sm mb-2 flex items-center gap-1.5">
                <span className="w-1 h-3.5 bg-blue-400 rounded inline-block" />
                ランダム出題演習
              </p>
              <Link
                href="/quiz?mode=random&filter=all"
                className="bg-white hover:bg-blue-50 border-2 border-slate-200 hover:border-blue-400
                  rounded-xl px-5 py-4 flex items-center justify-between transition-all hover:shadow-md hover:-translate-y-0.5 group"
              >
                <div>
                  <p className="font-bold text-[17px] text-slate-800 group-hover:text-blue-700 transition-colors">
                    ランダム演習
                  </p>
                  <p className="text-sm text-slate-400 mt-0.5">
                    全年度の過去問からランダム出題
                  </p>
                </div>
                <span className="text-slate-300 group-hover:text-blue-400 text-2xl transition-colors">›</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ===== オリジナル問題による演習 ===== */}
        <section>
          <h2 className="text-xl font-bold text-emerald-700 mb-4 pb-3 border-b-2 border-emerald-200 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-emerald-500 rounded inline-block" />
            オリジナル問題による演習
          </h2>
          <div className="ml-4 pl-4 border-l-2 border-emerald-200 grid gap-2">
            {Object.entries(MOCK_LABELS).map(([key, label]) => {
              const count = questionsByMock[key]?.length ?? 0;
              return (
                <Link
                  key={key}
                  href={`/quiz?mode=mock&filter=${key}`}
                  className="bg-white hover:bg-emerald-50 border-2 border-slate-200 hover:border-emerald-400
                    rounded-xl px-5 py-4 flex items-center justify-between transition-all hover:shadow-md hover:-translate-y-0.5 group"
                >
                  <div>
                    <p className="font-bold text-[17px] text-slate-800 group-hover:text-emerald-700 transition-colors">
                      {label}
                    </p>
                    <p className="text-sm text-slate-400 mt-0.5">{count}問収録</p>
                  </div>
                  <span className="text-slate-300 group-hover:text-emerald-400 text-2xl transition-colors">›</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 基礎科目の説明 */}
        <section className="bg-white rounded-2xl border border-slate-200 px-5 py-5">
          <h3 className="font-bold text-slate-700 text-base mb-3">基礎科目について</h3>
          <div className="text-[15px] text-slate-500 space-y-1.5 leading-relaxed">
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
