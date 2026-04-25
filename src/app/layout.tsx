import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "技術士一次試験 基礎科目 練習問題",
  description:
    "技術士一次試験（基礎科目）の過去問・模擬問題を繰り返し演習できる練習アプリです。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-slate-100">{children}</body>
    </html>
  );
}
