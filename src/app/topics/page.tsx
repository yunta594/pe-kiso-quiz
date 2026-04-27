import Link from "next/link";
import { TOPIC_GROUPS, allQuestions, mockQuestions } from "@/data";

export default function TopicsPage() {
  const allWithMock = [...allQuestions, ...mockQuestions];

  const groupsWithTopics = TOPIC_GROUPS.map(({ group, topics }) => ({
    group,
    topics: topics
      .map((tag) => ({
        tag,
        count: allWithMock.filter((q) => q.tags?.includes(tag)).length,
      }))
      .filter((t) => t.count > 0),
  })).filter((g) => g.topics.length > 0);

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-[#1e3a5f] text-white shadow-lg">
        <div className="max-w-2xl mx-auto px-4 py-5 flex items-center gap-3">
          <Link
            href="/"
            className="text-blue-300 hover:text-white transition-colors text-sm"
          >
            ← トップへ
          </Link>
          <span className="text-blue-400 select-none">|</span>
          <h1 className="text-xl font-bold">テーマ別で学習する</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        {groupsWithTopics.map(({ group, topics }) => (
          <section key={group}>
            <h2 className="text-base font-bold text-[#1e3a5f] mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-amber-500 rounded inline-block" />
              {group}
            </h2>
            <div className="grid gap-2">
              {topics.map(({ tag, count }) => (
                <Link
                  key={tag}
                  href={`/quiz?mode=topic&filter=${encodeURIComponent(tag)}`}
                  className="bg-white hover:bg-amber-50 border-2 border-slate-200 hover:border-amber-400
                    rounded-xl px-5 py-3.5 flex items-center justify-between transition-all group"
                >
                  <div>
                    <p className="font-bold text-[16px] text-slate-800 group-hover:text-amber-700 transition-colors">
                      {tag}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{count}問収録</p>
                  </div>
                  <span className="text-slate-300 group-hover:text-amber-400 text-2xl transition-colors">
                    ›
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </main>

      <footer className="text-center text-xs text-slate-400 py-8">
        技術士一次試験 基礎科目 練習問題アプリ
      </footer>
    </div>
  );
}
