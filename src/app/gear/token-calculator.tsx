"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const tokenCosts = [
  { key: 'weapon', label: '武器', cost: 500 },
  { key: 'body',   label: '胴', cost: 825 },
  { key: 'head',   label: '頭', cost: 495 },
  { key: 'hands',  label: '手', cost: 495 },
  { key: 'legs',   label: '脚', cost: 825 },
  { key: 'feet',   label: '足', cost: 495 },
  { key: 'necklace', label: '首', cost: 375 },
  { key: 'earrings', label: '耳', cost: 375 },
  { key: 'bracelet', label: '腕', cost: 375 },
  { key: 'ring',     label: '指', cost: 375 },
];

export default function SimpleTokenCalculator() {
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [owned, setOwned] = useState<number>(0);

  // 選択中の部位についてコストを合算
  const totalNeeded = tokenCosts.reduce(
    (sum, item) => sum + (selected[item.key] ? item.cost : 0),
    0
  );
  // 所持分を引いて、0未満は0
  const remaining = Math.max(0, totalNeeded - owned);

  const resetAll = () => {
    setSelected({});
    setOwned(0);
  };

  return (
    <Card className="p-6 space-y-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold">必要トークン計算機</h2>

      {/* 必要装備チェック */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {tokenCosts.map(item => (
          <label key={item.key} className="flex items-center space-x-2">
            <Checkbox
              checked={!!selected[item.key]}
              onCheckedChange={() =>
                setSelected(prev => ({ ...prev, [item.key]: !prev[item.key] }))
              }
            />
            <span>{item.label}</span>
          </label>
        ))}
      </div>

      {/* 所持数入力 */}
      <div className="flex items-center space-x-2">
        <Label htmlFor="ownedTokens">所持トークン:</Label>
        <Input
          id="ownedTokens"
          type="number"
          min={1}
          value={owned}
          onChange={e => setOwned(parseInt(e.target.value) || 0)}
          className="w-24"
        />
      </div>

      {/* 結果表示 */}
      <div className="text-center">
        <p className="text-lg">
          <span className="font-semibold">必要トークン数：</span>
          {remaining}
        </p>
      </div>

      {/* リセット */}
      <div className="text-right">
        <Button variant="outline" onClick={resetAll}>
          リセット
        </Button>
      </div>
    </Card>
  );
}
