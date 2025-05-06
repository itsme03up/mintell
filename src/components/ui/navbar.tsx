"use client"

import Link from "next/link"
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"

export function Navbar() {
  return (
    <NavigationMenu className="bg-purple-700 text-cream-100 p-2">
      <NavigationMenuList className="flex space-x-4">
        <NavigationMenuItem>
          <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
          <NavigationMenuContent className="bg-white p-4 rounded shadow">
            <ul>
              <li><NavigationMenuLink asChild><Link href="/">Home</Link></NavigationMenuLink></li>
              <li><NavigationMenuLink asChild><Link href="/members">メンバー管理</Link></NavigationMenuLink></li>
              <li><NavigationMenuLink asChild><Link href="/gear">零式管理</Link></NavigationMenuLink></li>
              {/* …他のリンク */}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

export function NavLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link href={href} className="px-3 py-1 hover:underline">
      {children}
    </Link>
  )
}
