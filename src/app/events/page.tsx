"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

export default function EventsPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">イベント管理</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="default" className="whitespace-nowrap">
              + イベント作成
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>新規イベント作成</DialogTitle>
              <DialogDescription>イベントの詳細を入力してください。</DialogDescription>
            </DialogHeader>
            <form className="grid gap-4 py-4">
              {/* タイトル */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  タイトル
                </Label>
                <Input id="title" className="col-span-3" placeholder="例: 暗黒PT募集" />
              </div>
              {/* 日付・時間 */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  日付
                </Label>
                <Input id="date" type="date" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="time_start" className="text-right">
                  開始時間
                </Label>
                <Input id="time_start" type="time" className="col-span-1" />
                <span className="text-center">〜</span>
                <Input id="time_end" type="time" className="col-span-1" />
              </div>
              {/* 場所 */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">
                  場所
                </Label>
                <Input
                  id="location"
                  className="col-span-3"
                  placeholder="例: シュヴァリエ号甲板"
                />
              </div>
              {/* 種類 */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">種類</Label>
                <div className="col-span-3 flex items-center space-x-6">
                  <div className="flex items-center space-x-1">
                    <Checkbox id="real" />
                    <Label htmlFor="real">リアル</Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Checkbox id="online" />
                    <Label htmlFor="online">オンライン</Label>
                  </div>
                </div>
              </div>
              {/* 説明 */}
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right pt-1">
                  説明
                </Label>
                <Textarea
                  id="description"
                  className="col-span-3"
                  placeholder="イベント詳細を記入"
                  rows={4}
                />
              </div>
            </form>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                キャンセル
              </Button>
              <Button>保存</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* カレンダー */}
      <Card className="p-6 bg-background shadow-md">
        <Calendar mode="single" className="mx-auto text-center" />
      </Card>
    </div>
  );
}
