// src/app/gear/layer/[layer]/page.tsx
"use client";
import React from "react";

export default function LayerPage({
  params,
}: {
  params: { layer: string };
}) {
  const { layer } = params;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">零式管理 - 第 {layer} 層</h1>
      <p>ここに第 {layer} 層の装備ステータステーブルを表示します。</p>
    </div>
  );
}
