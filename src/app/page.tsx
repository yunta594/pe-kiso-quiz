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

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {/* 年度別 */}
        <section>
          <h2 className="text-lg font-bold text-[#1e3a5f] mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-blue-600 rounded inline-block" />
            過去問題を学習する
          </h2>
          <div className="grid gap-3">
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
                    rounded-xl px-5 py-4 flex items-center justify-between transition-all hover:shadow-md hover:-translate-y-0.5 group"
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
            <span className="w-1 h-5 bg-amber-500 rounded inline-block" />
            テーマ別で学習する
          </h2>
          <Link
            href="/topics"
            className="bg-white hover:bg-amber-50 border-2 border-slate-200 hover:border-amber-400
              rounded-xl px-5 py-4 flex items-center justify-between transition-all hover:shadow-md hover:-translate-y-0.5 group"
          >
            <div>
              <p className="font-bold text-[17px] text-slate-800 group-hover:text-amber-700 transition-colors">
                テーマを選ぶ
              </p>
              <p className="text-sm text-slate-400 mt-0.5">
                確率・統計・アルゴリズム・科学技術史 など
              </p>
            </div>
            <span className="text-slate-300 group-hover:text-amber-400 text-2xl transition-colors">
              ›
            </span>
          </Link>
        </section>

        {/* 練習問題（模擬試験） */}
        <section>
          <h2 className="text-lg font-bold text-[#1e3a5f] mb-2 flex items-center gap-2">
            <span className="w-1 h-5 bg-amber-500 rounded inline-block" />
            練習問題で学習する
          </h2>
          <div className="grid gap-3">
            {Object.entries(MOCK_LABELS).map(([key, label]) => {
              const count = questionsByMock[key]?.length ?? 0;
              return (
                <Link
                  key={key}
                  href={`/quiz?mode=mock&filter=${key}`}
                  className="bg-white hover:bg-amber-50 border-2 border-slate-200 hover:border-amber-400
                    rounded-xl px-5 py-4 flex items-center justify-between transition-all hover:shadow-md hover:-translate-y-0.5 group"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-bold text-[17px] text-slate-800 group-hover:text-amber-700 transition-colors">
                        {label}
                      </p>
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

        {/* 10問チャレンジ */}
        <section>
          <Link
            href="/quiz?mode=random&filter=all&autostart=10"
            className="block bg-gradient-to-r from-[#1e3a5f] to-[#1e5ba8] hover:from-[#162d4a] hover:to-[#1a4f96] text-white rounded-xl px-5 py-5
              text-center transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            <p className="font-bold text-xl">10問チャレンジ</p>
            <p className="text-blue-200 text-sm mt-1">
              設定不要・全群からランダム10問をすぐスタート
            </p>
          </Link>
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
