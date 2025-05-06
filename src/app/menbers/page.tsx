"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
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
      <Card className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>名前</TableHead>
              <TableHead>最終ログイン</TableHead>
              <TableHead>進行度</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayed.map((m) => (
              <TableRow
                key={m.id}
                className={isInactive(m.lastLogin) ? "bg-red-50" : undefined}
              >
                <TableCell>{m.name}</TableCell>
                <TableCell>{m.lastLogin}</TableCell>
                <TableCell>
                  <Badge variant="outline">{m.progress}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
            </Table>
          </Card>
        </div>
      );
    }