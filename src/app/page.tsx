"use client";

import React from 'react';
import Link from 'next/link';
import { GlobeIcon, CodeIcon, BookOpenIcon } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import Hero from '@/components/ui/Hero';

export default function HomePage() {
  return (
    <>
      {/* Heroセクション */}
      <Hero />

      {/* 機能リンク */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 place-items-center">
          <Link href="/members" className="block w-1/2 max-w-xs no-underline">
            <Card className="w-full text-center transition-transform hover:scale-105 hover:shadow-lg duration-200 cursor-pointer">
              <CardHeader className="py-6">
                <CardTitle className="text-2xl">メンバー管理</CardTitle>
                <CardDescription>
                  FCメンバーのログイン状況やストーリー進行度を確認
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/gear/layer/1" className="block w-1/2 max-w-xs no-underline">
            <Card className="w-full text-center transition-transform hover:scale-105 hover:shadow-lg duration-200 cursor-pointer">
              <CardHeader className="py-6">
                <CardTitle className="text-2xl">零式管理</CardTitle>
                <CardDescription>
                  IL760零式装備の所持状況を管理
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/party-builder" className="block w-1/2 max-w-xs no-underline">
            <Card className="w-full text-center transition-transform hover:scale-105 hover:shadow-lg duration-200 cursor-pointer">
              <CardHeader className="py-6">
                <CardTitle className="text-2xl">PTビルダー</CardTitle>
                <CardDescription>
                  ドラッグ＆ドロップでPTを組成して保存
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/events" className="block w-1/2 max-w-xs no-underline">
            <Card className="w-full text-center transition-transform hover:scale-105 hover:shadow-lg duration-200 cursor-pointer">
              <CardHeader className="py-6">
                <CardTitle className="text-2xl">イベント</CardTitle>
                <CardDescription>
                  カレンダーでイベントを作成・管理
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </section>

      {/* 公式リンク集 */}
      <section className="container mx-auto px-4 pb-12">
        <h2 className="text-2xl font-bold mb-4">公式リンク集</h2>
        <Card className="p-6">
          <CardHeader>
            <CardTitle>参考サイト</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li>
                <Link
                  href="https://jp.finalfantasyxiv.com/lodestone/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 hover:text-primary"
                >
                  <GlobeIcon className="w-5 h-5" />
                  <span>Lodestone 公式サイト</span>
                </Link>
              </li>
              <li>
                <Link
                  href="https://xivapi.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 hover:text-primary"
                >
                  <CodeIcon className="w-5 h-5" />
                  <span>XIVAPI ドキュメント</span>
                </Link>
              </li>
              <li>
                <Link
                  href="https://game8.jp/ff14"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 hover:text-primary"
                >
                  <BookOpenIcon className="w-5 h-5" />
                  <span>攻略サイト</span>
                </Link>
              </li>
              <li>
                <Link
                  href="https://example.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 hover:text-primary"
                >
                  <GlobeIcon className="w-5 h-5" />
                  <span>新しいリンク</span>
                </Link>
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
