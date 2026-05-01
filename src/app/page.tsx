import Link from "next/link";
import AccordionSection from "@/components/AccordionSection";
import RandomQuizAccordion from "@/components/RandomQuizAccordion";
import {
  YEAR_LABELS,
  GROUP_LABELS,
  MOCK_LABELS,
  TOPIC_GROUPS,
  questionsByYear,
  questionsByGroup,
  questionsByMock,
} from "@/data";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* ヘッダー */}
      <header className="bg-gradient-to-r from-[#1e3a5f] to-[#2563eb] text-white shadow-lg">
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

          <div className="space-y-3">
            {/* 年度を選ぶ */}
            <AccordionSection title="年度を選ぶ">
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
            </AccordionSection>

            {/* 問題群を選ぶ */}
            <AccordionSection title="問題群を選ぶ">
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
            </AccordionSection>

            {/* テーマを選ぶ */}
            <AccordionSection title="テーマを選ぶ">
              <div className="space-y-3">
                {TOPIC_GROUPS.map(({ group, topics }) => (
                  <div key={group}>
                    <p className="text-xs font-bold text-slate-400 px-2 mb-1">{group}</p>
                    <div className="grid gap-1.5">
                      {topics.map((topic) => (
                        <Link
                          key={topic}
                          href={`/quiz?mode=topic&filter=${encodeURIComponent(topic)}`}
                          className="bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-400
                            rounded-xl px-5 py-3 flex items-center justify-between transition-all hover:shadow-sm group"
                        >
                          <p className="font-medium text-[16px] text-slate-800 group-hover:text-blue-700 transition-colors">
                            {topic}
                          </p>
                          <span className="text-slate-300 group-hover:text-blue-400 text-xl transition-colors">›</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </AccordionSection>

            {/* ランダム演習 */}
            <RandomQuizAccordion />
          </div>
        </section>

        {/* ===== オリジナル問題による演習 ===== */}
        <section>
          <h2 className="text-xl font-bold text-amber-600 mb-4 pb-3 border-b-2 border-amber-200 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-amber-500 rounded inline-block" />
            オリジナル問題による演習
          </h2>
          <AccordionSection title="練習問題を解く" variant="orange">
            <div className="grid gap-2">
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
                      <p className="font-bold text-[17px] text-slate-800 group-hover:text-amber-700 transition-colors">
                        {label}
                      </p>
                      <p className="text-sm text-slate-400 mt-0.5">{count}問収録</p>
                    </div>
                    <span className="text-slate-300 group-hover:text-amber-400 text-2xl transition-colors">›</span>
                  </Link>
                );
              })}
            </div>
          </AccordionSection>
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
