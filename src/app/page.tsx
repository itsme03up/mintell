'use client';
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "../components/ui/card"; // 小文字の 'card' に変更
import Hero from "../components/ui/Hero"; // Heroコンポーネントをインポート

export default function HomePage() {
  return (
    <>
      {/* Heroセクション */}
      <Hero />

      {/* 機能リンク */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* shadcn/ui Cardコンポーネントの正しい使い方 */}
          <Card>
            <CardHeader>
              <CardTitle>メンバー管理</CardTitle>
              <CardDescription>FCメンバーのログイン状況やストーリー進行度を確認</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <a href="/members">詳細を見る</a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>零式管理</CardTitle>
              <CardDescription>IL760零式装備の所持状況を管理</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <a href="/gear/layer/1">詳細を見る</a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>PTビルダー</CardTitle>
              <CardDescription>ドラッグ＆ドロップでPTを組成して保存</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <a href="/party-builder">詳細を見る</a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>イベント</CardTitle>
              <CardDescription>カレンダーでイベントを作成・管理</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <a href="/events">詳細を見る</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
