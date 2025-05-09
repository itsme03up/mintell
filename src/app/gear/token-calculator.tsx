"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

// トークンコスト定義
const tokenCosts = [
  { key: 'weapon', label: '武器', cost: 500 },
  { key: 'body', label: '胴', cost: 825 },
  { key: 'head', label: '頭', cost: 495 },
  { key: 'hands', label: '手', cost: 495 },
  { key: 'legs', label: '脚', cost: 825 },
  { key: 'feet', label: '足', cost: 495 },
  { key: 'necklace', label: '首', cost: 375 },
  { key: 'earrings', label: '耳', cost: 375 },
  { key: 'bracelet', label: '腕', cost: 375 },
  { key: 'ring', label: '指', cost: 375 },
];

export default function TokenCalculatorPage() {
  // 選択状態
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  // 所持トークン数
  const [ownedTokens, setOwnedTokens] = useState<number>(0);

  // チェックボックス変更
  const toggle = (key: string) => {
    setSelected((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // 合計必要数計算
  const totalNeeded = tokenCosts.reduce((sum, item) => {
    return sum + (selected[item.key] ? item.cost : 0);
  }, 0);

  // 未取得数 = totalNeeded - ownedTokens
  const remaining = totalNeeded - ownedTokens;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">必要トークン計算機</h1>
      <Card className="p-4 space-y-4">
        {/* チェックリスト */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tokenCosts.map((item) => (
            <label key={item.key} className="flex items-center space-x-2">
              <Checkbox
                checked={!!selected[item.key]}
                onCheckedChange={() => toggle(item.key)}
                id={item.key}
              />
              <Label htmlFor={item.key}>
                {item.label} (必要: {item.cost} トークン)
              </Label>
            </label>
          ))}
        </div>

        {/* 所持トークン入力 */}
        <div className="flex items-center space-x-2">
          <Label htmlFor="ownedTokens">所持トークン数:</Label>
          <Input
            id="ownedTokens"
            type="number"
            value={ownedTokens}
            onChange={(e) => setOwnedTokens(parseInt(e.target.value) || 0)}
            className="w-24"
          />
        </div>

        {/* 結果表示 */}
        <Card className="bg-background p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>項目</TableHead>
                <TableHead>必要数</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tokenCosts.map((item) => (
                <TableRow key={item.key}>
                  <TableCell>{item.label}</TableCell>
                  <TableCell>
                    {selected[item.key] ? item.cost : '-'}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell className="font-bold">合計必要数</TableCell>
                <TableCell className="font-bold">{totalNeeded}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold">未取得数</TableCell>
                <TableCell className="font-bold text-destructive">
                  {remaining >= 0 ? remaining : 0}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>

        {/* リセットボタン */}
        <div>
          <Button
            variant="outline"
            onClick={() => {
              setSelected({});
              setOwnedTokens(0);
            }}
          >
            リセット
          </Button>
        </div>
      </Card>
    </div>
  );
}
