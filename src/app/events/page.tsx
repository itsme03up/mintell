"use client";

import { Fragment, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { Draggable, DropArg } from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { EventSourceInput } from "@fullcalendar/core/index.js";
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

// イベントインターフェース
interface Event {
  title: string;
  start: Date | string;
  allDay: boolean;
  id: number;
  color?: string;
}

// ドラッグ可能なイベントデータ
const dragEvents = [
  { title: "レイド募集", id: "drag1" },
  { title: "ギルド会議", id: "drag2" },
  { title: "アライアンス討伐", id: "drag3" },
  { title: "マップ探索", id: "drag4" },
  { title: "PvP大会", id: "drag5" },
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

// 色のオプション
const colorOptions = ["#4285F4", "#EA4335", "#34A853", "#FBBC05", "#8E24AA"];

export default function EventsPage() {
  // 初期イベントデータ
  const initialEvents: Event[] = [
    { id: 1, title: "暗黒PT募集", start: new Date(2023, 5, 15), allDay: true, color: "#4285F4" },
    { id: 2, title: "ワールドボス討伐", start: new Date(2023, 5, 18), allDay: true, color: "#EA4335" },
    { id: 3, title: "ギルドミーティング", start: new Date(2023, 5, 22), allDay: false, color: "#34A853" },
    { id: 4, title: "新マップ探索", start: new Date(2023, 5, 25), allDay: true, color: "#FBBC05" },
  ];

  // 状態管理
  const [events, setEvents] = useState(dragEvents);
  const [allEvents, setAllEvents] = useState<Event[]>(initialEvents);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [newEvent, setNewEvent] = useState<Event>({
    title: "",
    start: "",
    allDay: false,
    id: 0,
  });

  // ドラッグ＆ドロップの設定
  useEffect(() => {
    const draggableEl = document.getElementById("draggable-el");
    if (draggableEl) {
      new Draggable(draggableEl, {
        itemSelector: ".fc-event",
        eventData: function(eventEl) {
          const title = eventEl.getAttribute("title");
          const id = new Date().getTime(); // ユニークIDの生成
          const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
          return { title, id, color, allDay: true };
        }
      });
    }
  }, []);

  // イベントの追加処理
  const handleAddEvent = () => {
    if (newEvent.title) {
      const updatedEvents = [...allEvents, { ...newEvent, id: Date.now() }];
      setAllEvents(updatedEvents);
      setShowModal(false);
      setNewEvent({
        title: "",
        start: "",
        allDay: false,
        id: 0,
      });
    }
  };

  // イベントが受け取られたときの処理
  const handleReceive = (eventInfo: any) => {
    const newEvent: Event = {
      id: eventInfo.draggedEl.getAttribute("id") || Date.now(),
      title: eventInfo.draggedEl.getAttribute("title"),
      start: eventInfo.date,
      allDay: eventInfo.allDay,
      color: eventInfo.draggedEl.style.backgroundColor || colorOptions[Math.floor(Math.random() * colorOptions.length)]
    };
    
    setAllEvents(prev => [...prev, newEvent]);
  };

  // イベントのクリック処理
  const handleEventClick = (eventInfo: any) => {
    setIdToDelete(Number(eventInfo.event.id));
    setShowDeleteModal(true);
  };

  // イベントの削除処理
  const handleDeleteEvent = () => {
    if (idToDelete) {
      setAllEvents(allEvents.filter(event => event.id !== idToDelete));
    }
    setShowDeleteModal(false);
    setIdToDelete(null);
  };

  // 日付のクリック処理
  const handleDateClick = (info: any) => {
    setNewEvent({
      ...newEvent,
      start: info.dateStr,
      allDay: info.allDay
    });
    setShowModal(true);
  };

  // メンバー選択のトグル処理
  const toggleMember = (id: number) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((memberId) => memberId !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">イベント管理</h1>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-9">
          <Card className="p-4 bg-background shadow-md border border-gray-200">
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay"
              }}
              events={allEvents as EventSourceInput}
              nowIndicator={true}
              editable={true}
              droppable={true}
              selectable={true}
              selectMirror={true}
              locale="ja"
              eventClick={handleEventClick}
              dateClick={handleDateClick}
              drop={handleReceive}
              height="auto"
            />
          </Card>
        </div>

        <div className="col-span-3">
          <div id="draggable-el" className="mb-6 w-full border-2 p-2 rounded-md bg-muted/30">
            <h2 className="font-bold text-lg text-center mb-3">ドラッグできるイベント</h2>
            {events.map(event => (
              <div
                className="fc-event border-2 p-2 mb-2 w-full rounded-md text-center bg-white hover:bg-primary/10 cursor-pointer"
                title={event.title}
                key={event.id}
              >
                {event.title}
              </div>
            ))}
          </div>

          <Card className="p-4 bg-background shadow-md border border-gray-200">
            <h2 className="font-bold text-lg mb-4">新規イベント作成</h2>
            <Button variant="default" className="w-full mb-2" onClick={() => setShowModal(true)}>
              + イベント作成
            </Button>
          </Card>
        </div>
      </div>

      {/* イベント作成モーダル */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>新規イベント作成</DialogTitle>
            <DialogDescription>
              イベントの詳細を入力してください。
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* タイトル */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="event-title" className="text-right">
                タイトル
              </Label>
              <Input
                id="event-title"
                className="col-span-3"
                placeholder="例: 暗黒PT募集"
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
              />
            </div>
            
            {/* 日付・時間 */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="event-date" className="text-right">
                日付
              </Label>
              <Input
                id="event-date"
                type="date"
                className="col-span-3"
                value={typeof newEvent.start === 'string' ? newEvent.start.split('T')[0] : ''}
                onChange={(e) => setNewEvent({...newEvent, start: e.target.value})}
              />
            </div>
            
            {/* 終日フラグ */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">終日</Label>
              <div className="col-span-3">
                <Checkbox 
                  id="allDay"
                  checked={newEvent.allDay} 
                  onCheckedChange={(checked) => 
                    setNewEvent({...newEvent, allDay: checked === true})
                  }
                />
                <Label htmlFor="allDay" className="ml-2">終日イベント</Label>
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
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>
              キャンセル
            </Button>
            <Button onClick={handleAddEvent}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 削除確認モーダル */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>イベントの削除</DialogTitle>
            <DialogDescription>
              このイベントを削除してもよろしいですか？
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              キャンセル
            </Button>
            <Button variant="destructive" onClick={handleDeleteEvent}>削除</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}