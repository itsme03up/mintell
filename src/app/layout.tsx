import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { Navbar, NavLink } from "@/components/ui"; // shadcn-ui 由来

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "FC管理アプリ",
  description: "FF14 FC 管理ツール",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <Navbar className="bg-purple-700 text-cream-100">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/members">メンバー管理</NavLink>
          <NavLink href="/gear">零式管理</NavLink>
          <NavLink href="/party-builder">PTビルダー</NavLink>
          <NavLink href="/parties">保存パーティ</NavLink>
          <NavLink href="/events">イベント</NavLink>
          <NavLink href="/schedule">スケジュール</NavLink>
        </Navbar>
        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}
