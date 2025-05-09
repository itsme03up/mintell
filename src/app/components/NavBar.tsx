'use client';

import Link from "next/link";
import {
  HomeIcon,
  UsersIcon,
  ShieldIcon,
  UsersRoundIcon,
  CalendarIcon,
  BookIcon,
  StickyNoteIcon,
} from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"

const navLinks = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/members", label: "メンバー管理", icon: UsersIcon },
  { href: "/parties", label: "PTビルダー", icon: UsersRoundIcon },
  { href: "/gear", label: "零式管理", icon: ShieldIcon },
  { href: "/events", label: "イベント", icon: CalendarIcon },
  { href: "/memo", label: "メモ", icon: StickyNoteIcon},
  { href: "/blog", label: "お知らせ", icon: BookIcon },
 
];

export default function NavBar() {
  return (
    <header className="sticky top-0 z-50 flex flex-wrap sm:justify-start sm:flex-nowrap w-full bg-white dark:bg-background dark:text-white text-sm py-4 dark:border-gray-600 border-b border-gray-600">
      <nav className="max-w-full w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between" aria-label="Global">
        <NavigationMenu>
          <NavigationMenuList>
            {navLinks.map((link) => (
              <NavigationMenuItem key={link.href}>
                <Link
                  href={link.href}
                  className="flex items-center p-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <link.icon className="h-5 w-5" />
                  <span className="ml-3 hidden sm:block">{link.label}</span>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </nav>
    </header>
  );
}