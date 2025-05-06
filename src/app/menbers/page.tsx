"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Table } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Member = {
  id: number;
  name: string;
  lastLogin: string; // YYYY-MM-DD
  progress: string;
};

const dummyMembers: Member[] = [
  { id: 1, name: "Minfilia", lastLogin: "2025-05-01", progress: "EW_60" },
  { id: 2, name: "Alice", lastLogin: "2025-04-20", progress: "SB" },
  { id: 3, name: "Bob", lastLogin: "2025-03-15", progress: "ARR" },
  // 他のダミーメンバー
];

/** 未ログイン日数が閾値以上か判定 */
function isInactive(dateStr: string, thresholdDays = 15) {
  const last = new Date(dateStr);
  const diffDays = (Date.now() - last.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays >= thresholdDays;
}

export default function MembersPage() {
  const [showInactiveOnly, setShowInactiveOnly] = useState(false);

  const displayed = dummyMembers.filter((m) => {
    if (showInactiveOnly) return isInactive(m.lastLogin);
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">FCメンバー一覧</h1>
        <Button variant="secondary" onClick={() => setShowInactiveOnly((v) => !v)}>
          {showInactiveOnly ? "全員表示" : "非アクティブのみ"}
        </Button>
      </div>

      <Card className="p-4">
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head>名前</Table.Head>
              <Table.Head>最終ログイン</Table.Head>
              <Table.Head>進行度</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {displayed.map((m) => (
              <Table.Row
                key={m.id}
                className={isInactive(m.lastLogin) ? "bg-red-50" : undefined}
              >
                <Table.Cell>{m.name}</Table.Cell>
                <Table.Cell>{m.lastLogin}</Table.Cell>
                <Table.Cell>
                  <Badge variant="outline">{m.progress}</Badge>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Card>
    </div>
  );
}
