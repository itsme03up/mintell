"use client";

import * as React from "react";
import Link from "next/link";
import {
  HomeIcon,
  UsersIcon,
  ShieldIcon,
  UsersRoundIcon,
  CalendarIcon,
  CalendarClockIcon,
  BookIcon,
} from "lucide-react";

const navLinks = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/members", label: "メンバー管理", icon: UsersIcon },
  { href: "/gear", label: "零式管理", icon: ShieldIcon },
  { href: "/party-builder", label: "PTビルダー", icon: UsersRoundIcon },
  { href: "/events", label: "イベント", icon: CalendarIcon },
  { href: "/schedule", label: "メモ", icon: BookIcon },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <aside className={`h-screen bg-purple-800 text-white p-4 transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className="flex justify-between items-center mb-8">
        <h1 className={`text-xl font-bold ${collapsed ? 'hidden' : 'block'}`}>Mintell</h1>
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-purple-700"
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>
      
      <nav>
        <ul className="space-y-2">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="flex items-center p-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <link.icon className="h-5 w-5" />
                <span className={`ml-3 ${collapsed ? 'hidden' : 'block'}`}>{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
