# FF14 FC 管理ダッシュボード

公式LodestoneデータとXIVAPIを活用して、ファイナルファンタジーXIVのフリーカンパニー（FC）運営を効率化する管理ツールです。Minfiliaテーマの配色や、ドラッグ＆ドロップでPT編成など、さくさく動くUIを提供します。

---

## 🧰 技術スタック

| レイヤー        | 技術／ライブラリ                         |
| ----------- | -------------------------------- |
| フレームワーク     | Next.js（App Router, React 18）    |
| 言語          | TypeScript                       |
| スタイリング      | Tailwind CSS (v4.x), shadcn/ui   |
| リアルタイム      | Supabase（検討中）                    |
| APIクライアント   | @xivapi/js                       |
| Drag & Drop | @dnd-kit/core, @dnd-kit/sortable |
| スクレイピング     | Cheerio (Lodestone用)             |
| デプロイ        | Vercel / Netlify                 |

---

## 📂 ディレクトリ構成

```
mintell/
├── README.md
├── package.json
├── tailwind.config.mjs
├── postcss.config.js
├── scripts/                # 外部バッチ／ユーティリティスクリプト
│   └── fetch-fc-members.js
├── public/                 # 静的ファイル(Crest, Images)
├── src/
│   ├── app/                # Next.js App Router ページ
│   │   ├── layout.tsx      # 全体レイアウト
│   │   ├── globals.css     # Tailwind & カラーテーマ変数
│   │   ├── page.tsx        # Landing Page
│   │   ├── members/        # /members
│   │   ├── gear/           # /gear, /gear/layer/[layer]
│   │   ├── party-builder/  # /party-builder
│   │   ├── parties/        # /parties
│   │   ├── events/         # /events
│   │   └── schedule/       # /schedule
│   ├── components/         # UIコンポーネント（shadcn/uiベース）
│   ├── lib/                # APIラッパー、ユーティリティ
│   │   └── xivapi.ts       # XIVAPIクライアント初期化
│   └── styles/             # CSS変数、ベーススタイル
└── scripts/                # サーバー外スクリプト
```

---

## 🚀 セットアップ

1. リポジトリをクローン

   ```bash
   git clone <REPO_URL> mintell
   cd mintell
   ```

2. 依存パッケージをインストール

   ```bash
   npm install
   ```

3. Tailwind CSS のビルドを有効化

   * `tailwind.config.mjs` の `content` パスをプロジェクトに合わせているか確認
   * `src/app/globals.css` に `@tailwind base; @tailwind components; @tailwind utilities;` を記述

4. 開発サーバー起動

   ```bash
   npm run dev
   ```

   [http://localhost:3000](http://localhost:3000) にアクセス

5. プロダクションビルド

   ```bash
   npm run build
   npm start
   ```

---

## 📖 主要機能一覧

* **メンバー管理**: Lodestone/XIVAPI からメンバー一覧取得、ログイン状況・進行度フィルタ
* **零式装備管理**: IL760零式ドロップ可否チェック、部位ごとの所持状況管理
* **PTビルダー**: ドラッグ＆ドロップでMT/ST/H1…D4のPT編成、保存・読み込み
* **イベント管理**: カレンダービュー、モーダルでイベント作成、Discord通知連携（Webhook）
* **スケジュール管理**: リマインダー付きカレンダー、定期タスク化
* **テーマ**: Minfiliaカラー（ピンク、紫、クリーム、黒、銀）＆背景パターンの回転アニメ

---

## 💡 開発メモ

* **XIVAPI**: `src/lib/xivapi.ts` で `@xivapi/js` を初期化。API キーなしでも FCメンバー取得可。
* **スクレイピング**: Lodestone FC詳細は `src/app/api/freecompany/route.ts` で Cheerio 解析。
* **shadcn/ui**: コンポーネントは手動で `npx shadcn-ui add <component>` して追加。
* **ESM tailwind**: `tailwind.config.mjs` を使用。PostCSS は `postcss.config.js` のまま。

---
