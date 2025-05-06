import "./globals.css";
import { Navbar } from "../components/ui/navbar"

export const metadata = {
  title: "FF14 FC 管理ダッシュボード",
  description: "MinfiliaとともにFC管理をサクサク進めよう",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <main className="relative z-10 p-4">{children}</main>
      </body>
    </html>
  )
}
