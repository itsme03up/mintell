"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
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

// サンプルイベントデータ - FullCalendar形式に更新
const sampleEvents = [
  { id: 1, title: "暗黒PT募集", start: new Date(2023, 5, 15), color: "#4285F4" },
  { id: 2, title: "ワールドボス討伐", start: new Date(2023, 5, 18), color: "#EA4335" },
  { id: 3, title: "ギルドミーティング", start: new Date(2023, 5, 22), color: "#34A853" },
  { id: 4, title: "新マップ探索", start: new Date(2023, 5, 25), color: "#FBBC05" },
];

// サンプルメンバーデータ
const sampleMembers = [
  { id: 1, name: "タンク太郎", role: "タンク", avatar: "/avatars/tank1.png" },
  { id: 2, name: "ヒーラー花子", role: "ヒーラー", avatar: "/avatars/healer1.png" },
  { id: 3, name: "近接次郎", role: "DPS", avatar: "/avatars/melee1.png" },
  { id: 4, name: "魔法使いマリー", role: "DPS", avatar: "/avatars/caster1.png" },
  { id: 5, name: "スカウトサム", role: "DPS", avatar: "/avatars/ranged1.png" },
  { id: 6, name: "テイマートム", role: "DPS", avatar: "/avatars/ranged2.png" },
  { id: 7, name: "バード美香", role: "DPS", avatar: "/avatars/ranged3.png" },
  { id: 8, name: "忍者直樹", role: "DPS", avatar: "/avatars/melee2.png" },
];

export default function EventsPage() {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [calendarView, setCalendarView] = useState("dayGridMonth");

  // メンバー選択のトグル処理
  const toggleMember = (id: number) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((memberId) => memberId !== id)
        : [...prev, id]
    );
  };

  // 日付がクリックされたときのハンドラ
  const handleDateClick = (info: any) => {
    setDate(new Date(info.date));
    setOpen(true); // 日付クリック時にイベント作成ダイアログを開く
  };

  // イベントがクリックされたときのハンドラ
  const handleEventClick = (info: any) => {
    console.log("Event clicked:", info.event);
    // ここではイベント詳細表示ダイアログなどを実装できます
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">イベント管理</h1>
        <Dialog
          open={open}
          onOpenChange={(newOpen) => {
            setOpen(newOpen);
            if (!newOpen) {
              // ダイアログを閉じるときに選択をリセット
              setSelectedMembers([]);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button variant="default" className="whitespace-nowrap">
              + イベント作成
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>新規イベント作成</DialogTitle>
              <DialogDescription>
                イベントの詳細を入力してください。
              </DialogDescription>
            </DialogHeader>
            <form className="grid gap-4 py-4">
              {/* タイトル */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  タイトル
                </Label>
                <Input
                  id="title"
                  className="col-span-3"
                  placeholder="例: 暗黒PT募集"
                />
              </div>
              {/* 日付・時間 */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  日付
                </Label>
                <Input
                  id="date"
                  type="date"
                  className="col-span-3"
                  defaultValue={date?.toISOString().split("T")[0]}
                />
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
              {/* 参加者 */}
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-1">参加者</Label>
                <div className="col-span-3">
                  <div className="h-[180px] border rounded-md p-2 overflow-y-auto">
                    <div className="space-y-2">
                      {sampleMembers.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center space-x-2 py-1 px-2 rounded hover:bg-gray-100"
                        >
                          <Checkbox
                            id={`member-${member.id}`}
                            checked={selectedMembers.includes(member.id)}
                            onCheckedChange={() => toggleMember(member.id)}
                          />
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                              {member.avatar ? (
                                <img
                                  src={member.avatar}
                                  alt={member.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500">
                                  {member.name.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div>
                              <Label
                                htmlFor={`member-${member.id}`}
                                className="font-medium cursor-pointer"
                              >
                                {member.name}
                              </Label>
                              <p className="text-xs text-gray-500">
                                {member.role}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-right text-gray-500">
                    選択中: {selectedMembers.length}人
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
      <Card className="p-4 bg-background shadow-md overflow-hidden border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="outline"
            onClick={() => {
              const calendarApi = document
                .querySelector(".fc")
                ?.querySelector(".fc-view-harness")?.firstChild?.["getApi"];
              if (typeof calendarApi === "function") calendarApi().today();
            }}
            className="text-sm"
          >
            今日
          </Button>
          <div className="flex space-x-2">
            <Button
              variant={calendarView === "dayGridMonth" ? "default" : "outline"}
              size="sm"
              onClick={() => setCalendarView("dayGridMonth")}
            >
              月
            </Button>
            <Button
              variant={calendarView === "timeGridWeek" ? "default" : "outline"}
              size="sm"
              onClick={() => setCalendarView("timeGridWeek")}
            >
              週
            </Button>
            <Button
              variant={calendarView === "timeGridDay" ? "default" : "outline"}
              size="sm"
              onClick={() => setCalendarView("timeGridDay")}
            >
              日
            </Button>
          </div>
        </div>

        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={calendarView}
          headerToolbar={{
            left: "prev,next",
            center: "title",
            right: "",
          }}
          events={sampleEvents}
          locale="ja"
          nowIndicator={true}
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          height="auto"
          aspectRatio={1.8}
          buttonText={{
            today: "今日",
            month: "月",
            week: "週",
            day: "日",
          }}
        />
      </Card>
    </div>
  );
}