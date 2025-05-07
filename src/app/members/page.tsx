"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface Member {
  id: number;
  name: string;
  server: string;
  avatarUrl: string;
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInactiveOnly, setShowInactiveOnly] = useState(false);

  useEffect(() => {
    fetch("/api/members")
      .then((res) => res.json())
      .then((data: Member[]) => {
        setMembers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div>読み込み中...</div>;
  }

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="mb-4">
          <label className="flex items-center space-x-2 text-sm text-muted cursor-pointer">
            <Checkbox
              id="filter-inactive"
              checked={showInactiveOnly}
              onCheckedChange={(checked) => setShowInactiveOnly(checked as boolean)}
              className="rounded border-gray-300 text-minfilia-purple focus:ring-minfilia-purple"
            />
            <Label htmlFor="filter-inactive">未ログインメンバーのみ表示</Label>
          </label>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>名前</TableHead>
              <TableHead>サーバー</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members
              .filter(() => {
                // TODO: 未ログイン判定用 lastLogin を取得次第フィルタを適用
                return !showInactiveOnly;
              })
              .map((m) => (
                <TableRow key={m.id}>
                  <TableCell>
                    <Image
                      src={m.avatarUrl}
                      alt={m.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  </TableCell>
                  <TableCell>{m.name}</TableCell>
                  <TableCell>{m.server}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
