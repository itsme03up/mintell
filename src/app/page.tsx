'use client';
import { Button } from "../components/ui/button";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "../components/ui/card";
import Hero from "../components/ui/Hero";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      {/* Heroセクション */}
      <Hero />

      {/* 機能リンク */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 place-items-center">
          {/* クリック可能なカード */}
          <Link href="/members" className="block w-1/2 max-w-xl no-underline">
            <Card className="w-full h-auto text-center transition-shadow hover:shadow-lg cursor-pointer">
              <CardHeader className="py-3">
                <CardTitle className="text-2xl">メンバー管理</CardTitle>
                <CardDescription className="text-lg">FCメンバーのログイン状況やストーリー進行度を確認</CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
              </CardContent>
            </Card>
          </Link>

          <Link href="/gear/layer/1" className="block w-1/2 max-w-xl no-underline">
            <Card className="w-full h-auto text-center transition-shadow hover:shadow-lg cursor-pointer">
              <CardHeader className="py-3">
                <CardTitle className="text-2xl">零式管理</CardTitle>
                <CardDescription className="text-lg">IL760零式装備の所持状況を管理</CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
              </CardContent>
            </Card>
          </Link>

          <Link href="/party-builder" className="block w-1/2 max-w-xl no-underline">
            <Card className="w-full h-auto text-center transition-shadow hover:shadow-lg cursor-pointer">
              <CardHeader className="py-3">
                <CardTitle className="text-2xl">PTビルダー</CardTitle>
                <CardDescription className="text-lg">ドラッグ＆ドロップでPTを組成して保存</CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
              </CardContent>
            </Card>
          </Link>

          <Link href="/events" className="block w-1/2 max-w-xl no-underline">
            <Card className="w-full h-auto text-center transition-shadow hover:shadow-lg cursor-pointer">
              <CardHeader className="py-3">
                <CardTitle className="text-2xl">イベント</CardTitle>
                <CardDescription className="text-lg">カレンダーでイベントを作成・管理</CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>
    </>
  );
}
