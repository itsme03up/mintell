"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { ChevronLeft, ChevronRight } from "lucide-react";

// サンプルイベントデータ
const sampleEvents = [
  { id: 1, title: "暗黒PT募集", date: new Date(2023, 5, 15), color: "#4285F4" },
  { id: 2, title: "ワールドボス討伐", date: new Date(2023, 5, 18), color: "#EA4335" },
  { id: 3, title: "ギルドミーティング", date: new Date(2023, 5, 22), color: "#34A853" },
  { id: 4, title: "新マップ探索", date: new Date(2023, 5, 25), color: "#FBBC05" },
];

export default function EventsPage() {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [month, setMonth] = useState<Date>(new Date());

  // 前月へ移動
  const prevMonth = () => {
    const newMonth = new Date(month);
    newMonth.setMonth(newMonth.getMonth() - 1);
    setMonth(newMonth);
  };

  // 次月へ移動
  const nextMonth = () => {
    const newMonth = new Date(month);
    newMonth.setMonth(newMonth.getMonth() + 1);
    setMonth(newMonth);
  };

  // 今日へ移動
  const goToToday = () => {
    setMonth(new Date());
    setDate(new Date());
  };

  // 日付のイベントを取得
  const getEventsForDate = (day: Date | undefined) => {
    if (!day) return [];
    return sampleEvents.filter(
      (event) => event.date.toDateString() === day.toDateString()
    );
  };

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
      <Card className="p-0 bg-background shadow-md overflow-hidden border border-gray-200">
        {/* カレンダーヘッダー */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={goToToday} className="text-sm">
              今日
            </Button>
            <div className="flex items-center">
              <Button variant="ghost" size="icon" onClick={prevMonth} className="mr-2">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-semibold px-4">
                {month.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' })}
              </h2>
              <Button variant="ghost" size="icon" onClick={nextMonth} className="ml-2">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">月</Button>
            <Button variant="outline" size="sm">週</Button>
            <Button variant="outline" size="sm">日</Button>
          </div>
        </div>
        
        {/* カレンダー本体 */}
        <div className="p-3">
          <Calendar 
            mode="single" 
            selected={date} 
            onSelect={setDate}
            month={month}
            onMonthChange={setMonth}
            className="rounded-md"
            styles={{
              head_cell: {
                width: "100%",
                textAlign: "center",
                padding: "8px 0",
                fontWeight: 500,
                color: "#70757a",
                borderBottom: "1px solid #e0e0e0",
              },
              cell: {
                width: "100%",
                height: "100px",
                border: "1px solid #e0e0e0",
                verticalAlign: "top",
                padding: "4px",
                position: "relative",
              },
              day: {
                margin: "0",
                width: "32px",
                height: "32px",
                fontSize: "14px",
              },
            }}
            modifiersStyles={{
              selected: {
                backgroundColor: "#1a73e8",
                color: "white",
                fontWeight: "bold",
              },
              today: {
                border: "1px solid #1a73e8",
                color: "#1a73e8",
                fontWeight: "bold",
              },
            }}
            components={{
              Day: (props) => {
                // date オブジェクトが有効か確認
                const date = props.date;
                if (!date || !(date instanceof Date)) {
                  return <div className="h-full w-full"></div>;
                }
                
                // 日付のイベントを取得
                const dayEvents = getEventsForDate(date);
                
                return (
                  <div className="h-full w-full">
                    <button
                      className="mb-1 text-sm font-medium flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100"
                    >
                      {date.getDate()}
                    </button>
                    <div className="flex flex-col space-y-1 mt-1">
                      {dayEvents.map(event => (
                        <div 
                          key={event.id}
                          style={{ backgroundColor: event.color }}
                          className="text-xs text-white p-1 rounded truncate"
                          title={event.title}
                        >
                          {event.title}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
            }}
          />
        </div>
      </Card>
    </div>
  );
}
