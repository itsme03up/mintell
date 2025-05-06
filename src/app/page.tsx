import Link from "next/link";
import { Button, Card } from "@/components/ui";
import Hero from "@/components/ui/Hero";

export const metadata = {
  title: "FF14 FC 管理ダッシュボード",
  description: "MinfiliaとともにFC管理をサクサク進めよう",
};

export default function HomePage() {
  return (
    <>
      {/* Heroセクション */}
      <Hero />

      {/* 機能リンク */}
      <section className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2">メンバー管理</h2>
          <p className="text-sm mb-4">FCメンバーのログイン状況やストーリー進行度を確認</p>
          <Button asChild>
            <Link href="/members">移動</Link>
          </Button>
        </Card>
        <Card className="hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2">零式管理</h2>
          <p className="text-sm mb-4">IL760零式装備の所持状況を管理</p>
          <Button asChild>
            <Link href="/gear/layer/1">移動</Link>
          </Button>
        </Card>
        <Card className="hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2">PTビルダー</h2>
          <p className="text-sm mb-4">ドラッグ＆ドロップでPTを組成して保存</p>
          <Button asChild>
            <Link href="/party-builder">移動</Link>
          </Button>
        </Card>
        <Card className="hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2">イベント</h2>
          <p className="text-sm mb-4">カレンダーでイベントを作成・管理</p>
          <Button asChild>
            <Link href="/events">移動</Link>
          </Button>
        </Card>
      </section>
    </>
  );
}
