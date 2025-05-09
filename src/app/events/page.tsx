"use client";

import { Fragment, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import FullCalendar from "@fullcalendar/react";
import { EventReceiveArg } from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { EventSourceInput } from "@fullcalendar/core/index.js";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";

// Import party data (assuming it will be created in src/data)
// Note: You'll need to create this file.
// For now, we'll use a placeholder if the import fails or the file is empty.
let partyBuilderData: any[] = [];
try {
  partyBuilderData = require('@/data/partybuilder.json');
} catch (e) {
  console.warn("Could not load @/data/partybuilder.json. Proceeding with empty party configurations.");
}

// イベントインターフェース
interface Event {
  title: string;
  start: Date | string;
  allDay: boolean;
  id: number;
  color?: string;
  isBirthday?: boolean;
  memberId?: number; // For birthday person
  partyMembers?: number[]; // For general event party
}

// FullCalendar イベント関連の型
interface EventClickInfo {
  event: {
    id: string;
    title: string;
    start: Date | null;
    allDay: boolean;
  };
}

interface DateClickInfo {
  dateStr: string;
  allDay: boolean;
}

interface EventReceiveInfo {
  draggedEl: HTMLElement;
  date: Date;
  allDay: boolean;
}

// ドラッグ可能なイベントデータ
const dragEvents = [
  { title: "極・零式", id: "drag1" },
  { title: "オフ会", id: "drag2" },
  { title: "DD", id: "drag3" },
  { title: "地図", id: "drag4" },
  { title: "誕生日", id: "drag5" },
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
  const [, /* events */ ] = useState(dragEvents);
  const [allEvents, setAllEvents] = useState<Event[]>(initialEvents);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);
  const [, /* selectedMembers */ ] = useState<number[]>([]);
  const [newEvent, setNewEvent] = useState<Event>({
    title: "",
    start: "",
    allDay: false,
    id: 0,
    isBirthday: false,
    memberId: undefined,
    partyMembers: [],
  });
  const [partyConfigurations, setPartyConfigurations] = useState<any[]>([]);

  // Load party configurations from JSON
  useEffect(() => {
    setPartyConfigurations(partyBuilderData || []);
  }, []);

  // ドラッグ＆ドロップの設定
  useEffect(() => {
    const draggableEl = document.getElementById("draggable-el");
    if (draggableEl) {
      new Draggable(draggableEl, {
        itemSelector: ".fc-event",
        eventData: function (eventEl) {
          const title = eventEl.getAttribute("title");
          const id = new Date().getTime();
          const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
          return { title, id, color, allDay: true };
        }
      });
    }
  }, []);

  // イベントの追加処理
  const handleAddEvent = () => {
    if (newEvent.title) {
      let finalTitle = newEvent.title;
      
      if (newEvent.isBirthday && newEvent.memberId) {
        const member = sampleMembers.find(m => m.id === newEvent.memberId);
        if (member) {
          finalTitle = `${newEvent.title}: ${member.name}`;
        }
      }
      
      const eventToAdd: Event = { 
        ...newEvent, 
        id: Date.now(),
        title: finalTitle,
      };
      
      const updatedEvents = [...allEvents, eventToAdd];
      
      setAllEvents(updatedEvents);
      setShowModal(false);
      setNewEvent({
        title: "",
        start: "",
        allDay: false,
        id: 0,
        isBirthday: false,
        memberId: undefined,
        partyMembers: [],
      });
    }
  };

  // イベントが受け取られたときの処理
  const handleReceive = (eventInfo: EventReceiveInfo) => {
    const title = eventInfo.draggedEl.getAttribute("title") || "新しいイベント";
    
    if (title === "誕生日") {
      const id = parseInt(eventInfo.draggedEl.getAttribute("id") || Date.now().toString());
      
      setAllEvents(prev => {
        if (prev.length > 0) {
          return prev.slice(0, -1);
        }
        return prev;
      });
      
      setNewEvent({
        title: title,
        start: eventInfo.date,
        allDay: eventInfo.allDay,
        id: id,
        isBirthday: true,
        memberId: undefined,
        color: colorOptions[Math.floor(Math.random() * colorOptions.length)]
      });
      
      setShowModal(true);
    }
  };

  const handleEventReceive = (eventInfo: EventReceiveArg) => {
    if (eventInfo.event.title === "誕生日") {
      return;
    }
  };

  const handleEventClick = (eventInfo: EventClickInfo) => {
    if (eventInfo.event.start) {
      setIdToDelete(Number(eventInfo.event.id));
      setShowDeleteModal(true);
    }
  };

  const handleDeleteEvent = () => {
    if (idToDelete) {
      setAllEvents(allEvents.filter(event => event.id !== idToDelete));
    }
    setShowDeleteModal(false);
    setIdToDelete(null);
  };

  const handleDateClick = (info: DateClickInfo) => {
    setNewEvent({
      ...newEvent,
      start: info.dateStr,
      allDay: info.allDay,
      isBirthday: false,
      memberId: undefined
    });
    setShowModal(true);
  };

  return (
    <>
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
                eventReceive={handleEventReceive}
                height="auto" />
            </Card>
          </div>

          <div className="col-span-3">
            <div id="draggable-el" className="mb-6 w-full border-2 p-2 rounded-md bg-muted/30">
              <h2 className="font-bold text-lg text-center mb-3">ドラッグできるイベント</h2>
              {dragEvents.map(event => (
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
          <DialogContent className="sm:max-w-xl">
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
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
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
                  onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
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
                      setNewEvent({ ...newEvent, allDay: checked === true })
                    }
                  />
                  <Label htmlFor="allDay" className="ml-2">終日イベント</Label>
                </div>
              </div>

              {/* 新しいパーティ構成セクション */}
              <div className="grid grid-cols-4 items-start gap-4 mt-4">
                <Label className="text-right pt-1">パーティ構成</Label>
                <div className="col-span-3 space-y-4">
                  {/* Option 1: Select from pre-registered parties */}
                  <div>
                    <Label htmlFor="party-config-select">登録済みPTから選択</Label>
                    <select
                      id="party-config-select"
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      onChange={(e) => {
                        const selectedPartyId = e.target.value;
                        const selectedParty = partyConfigurations.find(p => p.id === selectedPartyId);
                        if (selectedParty) {
                          setNewEvent({ ...newEvent, partyMembers: selectedParty.members.map((m: any) => m.memberId) });
                        } else {
                          setNewEvent({ ...newEvent, partyMembers: [] });
                        }
                      }}
                      value={newEvent.partyMembers && newEvent.partyMembers.length > 0 && partyConfigurations.find(p => JSON.stringify(p.members.map((m:any) => m.memberId).sort()) === JSON.stringify([...newEvent.partyMembers!].sort()))?.id || ""}
                    >
                      <option value="">-- 手動で構成または選択 --</option>
                      {partyConfigurations.map((party) => (
                        <option key={party.id} value={party.id}>
                          {party.name}
                        </option>
                      ))}
                    </select>
                    {newEvent.partyMembers && newEvent.partyMembers.length > 0 && (
                      <div className="mt-2 text-sm text-gray-600">
                        選択中のメンバー: {newEvent.partyMembers.map(id => sampleMembers.find(m => m.id === id)?.name || `ID:${id}`).join(', ')}
                      </div>
                    )}
                  </div>

                  {/* Option 2: Drag and drop members */}
                  <div className="border rounded-md p-3">
                    <h3 className="font-medium text-sm mb-2">メンバーを手動で追加 (ドラッグ＆ドロップ)</h3>
                    <div className="mb-2 p-2 border rounded-md h-32 overflow-y-auto bg-gray-50">
                      <p className="text-xs text-gray-500 text-center">ここに利用可能なメンバーリストを表示 (ドラッグ元)</p>
                      {sampleMembers.map(member => (
                        <div key={member.id} className="p-1 my-1 bg-white border rounded cursor-grab">
                          {member.name} ({member.role})
                        </div>
                      ))}
                    </div>
                    <div className="p-4 border-dashed border-2 border-gray-300 rounded-md h-40 overflow-y-auto bg-gray-50">
                      <p className="text-xs text-gray-500 text-center">ここにメンバーをドラッグ＆ドロップ (ドロップ先)</p>
                      {newEvent.partyMembers && newEvent.partyMembers.map(memberId => {
                        const member = sampleMembers.find(m => m.id === memberId);
                        return member ? (
                          <div key={memberId} className="p-1 my-1 bg-green-100 border border-green-300 rounded">
                            {member.name}
                          </div>
                        ) : null;
                      })}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      （注意：ドラッグ＆ドロップ機能の実装が必要です）
                    </p>
                  </div>
                </div>
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
    </>
  );
}