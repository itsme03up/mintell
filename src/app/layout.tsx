import { Navbar, NavLink } from "@/components/ui/navbar"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <Navbar />
        <nav className="flex space-x-2 p-4 bg-cream-50">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/members">メンバー管理</NavLink>
          <NavLink href="/gear">零式管理</NavLink>
          {/* … */}
        </nav>
        <main className="p-4">{children}</main>
      </body>
    </html>
  )
}
