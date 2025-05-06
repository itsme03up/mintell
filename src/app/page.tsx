'use client';
import Hero from "@/components/ui/Hero";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      {/* Heroセクション */}
      <Hero />

      {/* 機能リンク */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">メンバー管理</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">FCメンバーのログイン状況やストーリー進行度を確認</p>
            </div>
            <div className="px-6 pb-6">
              <Link
                href="/members"
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-150"
              >
                移動
              </Link>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">零式管理</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">IL760零式装備の所持状況を管理</p>
            </div>
            <div className="px-6 pb-6">
              <Link
                href="/gear/layer/1"
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-150"
              >
                移動
              </Link>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">PTビルダー</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">ドラッグ＆ドロップでPTを組成して保存</p>
            </div>
            <div className="px-6 pb-6">
              <Link
                href="/party-builder"
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-150"
              >
                移動
              </Link>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">イベント</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">カレンダーでイベントを作成・管理</p>
            </div>
            <div className="px-6 pb-6">
              <Link
                href="/events"
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-150"
              >
                移動
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
