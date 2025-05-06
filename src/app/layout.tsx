'use client';
import "./globals.css";
import { Navbar } from "../components/ui/navbar"
import { RotatingBackground } from "@/components/RotatingBackground";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        {/* 背景の回転パターン */}
        <RotatingBackground />   {/* 背景の回転パターン */}
        <Navbar />
        <main className="p-4">{children}</main>
      </body>
    </html>
  )
}
