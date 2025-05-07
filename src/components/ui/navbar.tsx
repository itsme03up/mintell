"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/members", label: "メンバー管理" },
  { href: "/gear", label: "零式管理" },
  { href: "/party-builder", label: "PTビルダー" },
  { href: "/events", label: "イベント" },
  { href: "/schedule", label: "スケジュール" },
];

export function Navbar() {
  return (
    <NavigationMenu className="relative z-50 bg-black text-neutral-100 p-4 w-full">
      {/* ↑ ナビゲーションバー全体のスタイル（背景色、パディングなど）を確認・変更 */}
      <NavigationMenuList className="flex flex-row justify-start space-x-2 w-full">
        {/* ↑ リストアイテムのレイアウト（フレックス方向、アイテム間のスペースなど）を確認・変更 */}
        {navLinks.map((link) => (
          <NavigationMenuItem key={link.href}>
            <NavLink href={link.href}>{link.label}</NavLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="px-4 py-2 hover:text-pink-500 transition-colors"
    >
      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
        {children}
      </NavigationMenuLink>
    </Link>
  );
}
