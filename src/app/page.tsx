'use client';
import Hero from "@/components/ui/Hero";
import Card from "@/components/ui/Card";

export default function HomePage() {
  return (
    <>
      {/* Heroセクション */}
      <Hero />

      {/* 機能リンク */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card
            title="メンバー管理"
            description="FCメンバーのログイン状況やストーリー進行度を確認"
            href="/members"
          />
          <Card
            title="零式管理"
            description="IL760零式装備の所持状況を管理"
            href="/gear/layer/1"
          />
          <Card
            title="PTビルダー"
            description="ドラッグ＆ドロップでPTを組成して保存"
            href="/party-builder"
          />
          <Card
            title="イベント"
            description="カレンダーでイベントを作成・管理"
            href="/events"
          />
        </div>
      </section>
    </>
  );
}
