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

// イベントインターフェース
interface Event {
  title: string;
  start: Date | string;
  allDay: boolean;
  id: number;
  color?: string;
  isBirthday?: boolean;
  memberId?: number;
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
  });

  // パーティスロットの管理
  const [partySlots, setPartySlots] = useState<{
    [key: string]: number | null;
  }>({
    MT: null,
    ST: null,
    H1: null,
    H2: null,
    D1: null,
    D2: null,
    D3: null,
    D4: null,
  });

  // パーティスロットの割り当て/解除
  const assignToSlot = (slot: string, memberId: number | null) => {
    // 既に他のスロットに割り当てられている場合、そのスロットから削除
    if (memberId !== null) {
      const currentSlot = Object.entries(partySlots).find(
        ([, id]) => id === memberId
      )?.[0];

      if (currentSlot) {
        setPartySlots(prev => ({ ...prev, [currentSlot]: null }));
      }
    }

    // 新しいスロットに割り当て
    setPartySlots(prev => ({ ...prev, [slot]: memberId }));
  };

  // メンバーがどのスロットに割り当てられているか確認
  const getMemberSlot = (memberId: number) => {
    return Object.entries(partySlots).find(
      ([, id]) => id === memberId
    )?.[0] || null;
  };

  // ドラッグ＆ドロップの設定
  useEffect(() => {
    const draggableEl = document.getElementById("draggable-el");
    if (draggableEl) {
      new Draggable(draggableEl, {
        itemSelector: ".fc-event",
        eventData: function (eventEl) {
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
      let finalTitle = newEvent.title;
      
      // 誕生日イベントで、メンバーが選択されている場合、タイトルを変更
      if (newEvent.isBirthday && newEvent.memberId) {
        const member = sampleMembers.find(m => m.id === newEvent.memberId);
        if (member) {
          finalTitle = `${newEvent.title}: ${member.name}`;
        }
      }
      
      const updatedEvents = [...allEvents, { 
        ...newEvent, 
        id: Date.now(),
        title: finalTitle 
      }];
      
      setAllEvents(updatedEvents);
      setShowModal(false);
      setNewEvent({
        title: "",
        start: "",
        allDay: false,
        id: 0,
        isBirthday: false,
        memberId: undefined
      });
    }
  };

  // イベントが受け取られたときの処理
  const handleReceive = (eventInfo: EventReceiveInfo) => {
    const title = eventInfo.draggedEl.getAttribute("title") || "新しいイベント";
    
    // 誕生日イベントの場合
    if (title === "誕生日") {
      const id = parseInt(eventInfo.draggedEl.getAttribute("id") || Date.now().toString());
      
      // モーダルを開く前に最後に追加されたイベントを削除
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

  // FullCalendarのeventReceiveハンドラを追加
  const handleEventReceive = (eventInfo: EventReceiveArg) => {
    if (eventInfo.event.title === "誕生日") {
      return;
    }
  };

  // イベントのクリック処理
  const handleEventClick = (eventInfo: EventClickInfo) => {
      if (eventInfo.event.start) {
          setIdToDelete(Number(eventInfo.event.id));
          setShowDeleteModal(true);
      }
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
              {/* パーティ構成セクション */}
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-1">パーティ構成</Label>
                <div className="col-span-3 grid grid-cols-2 gap-4">
                  {/* パーティスロット（左） */}
                  <div className="space-y-2 border rounded-md p-3">
                    <h3 className="font-medium text-sm mb-2">ロール割り当て</h3>

                    {/* タンク */}
                    <div className="space-y-1">
                      <div className="flex items-center border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/30 pl-2 py-1 rounded-r-sm">
                        <span className="text-blue-700 dark:text-blue-300 font-medium text-sm w-8">MT</span>
                        <select
                          className="flex-1 ml-2 text-sm bg-transparent border-0 focus:ring-0"
                          value={partySlots.MT || ""}
                          onChange={(e) => assignToSlot("MT", e.target.value ? Number(e.target.value) : null)}
                        >
                          <option value="">-- 選択 --</option>
                          {sampleMembers
                            .filter(m => m.role === "タンク")
                            .map(member => (
                              <option key={member.id} value={member.id}>
                                {member.name}
                              </option>
                            ))}
                        </select>
                      </div>

                      <div className="flex items-center border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/30 pl-2 py-1 rounded-r-sm">
                        <span className="text-blue-700 dark:text-blue-300 font-medium text-sm w-8">ST</span>
                        <select
                          className="flex-1 ml-2 text-sm bg-transparent border-0 focus:ring-0"
                          value={partySlots.ST || ""}
                          onChange={(e) => assignToSlot("ST", e.target.value ? Number(e.target.value) : null)}
                        >
                          <option value="">-- 選択 --</option>
                          {sampleMembers
                            .filter(m => m.role === "タンク")
                            .map(member => (
                              <option key={member.id} value={member.id}>
                                {member.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>

                    {/* ヒーラー */}
                    <div className="space-y-1 mt-3">
                      <div className="flex items-center border-l-4 border-green-500 bg-green-50 dark:bg-green-950/30 pl-2 py-1 rounded-r-sm">
                        <span className="text-green-700 dark:text-green-300 font-medium text-sm w-8">H1</span>
                        <select
                          className="flex-1 ml-2 text-sm bg-transparent border-0 focus:ring-0"
                          value={partySlots.H1 || ""}
                          onChange={(e) => assignToSlot("H1", e.target.value ? Number(e.target.value) : null)}
                        >
                          <option value="">-- 選択 --</option>
                          {sampleMembers
                            .filter(m => m.role === "ヒーラー")
                            .map(member => (
                              <option key={member.id} value={member.id}>
                                {member.name}
                              </option>
                            ))}
                        </select>
                      </div>

                      <div className="flex items-center border-l-4 border-green-500 bg-green-50 dark:bg-green-950/30 pl-2 py-1 rounded-r-sm">
                        <span className="text-green-700 dark:text-green-300 font-medium text-sm w-8">H2</span>
                        <select
                          className="flex-1 ml-2 text-sm bg-transparent border-0 focus:ring-0"
                          value={partySlots.H2 || ""}
                          onChange={(e) => assignToSlot("H2", e.target.value ? Number(e.target.value) : null)}
                        >
                          <option value="">-- 選択 --</option>
                          {sampleMembers
                            .filter(m => m.role === "ヒーラー")
                            .map(member => (
                              <option key={member.id} value={member.id}>
                                {member.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>

                    {/* DPS */}
                    <div className="space-y-1 mt-3">
                      <div className="flex items-center border-l-4 border-red-500 bg-red-50 dark:bg-red-950/30 pl-2 py-1 rounded-r-sm">
                        <span className="text-red-700 dark:text-red-300 font-medium text-sm w-8">D1</span>
                        <select
                          className="flex-1 ml-2 text-sm bg-transparent border-0 focus:ring-0"
                          value={partySlots.D1 || ""}
                          onChange={(e) => assignToSlot("D1", e.target.value ? Number(e.target.value) : null)}
                        >
                          <option value="">-- 選択 --</option>
                          {sampleMembers
                            .filter(m => m.role === "DPS")
                            .map(member => (
                              <option key={member.id} value={member.id}>
                                {member.name}
                              </option>
                            ))}
                        </select>
                      </div>

                      <div className="flex items-center border-l-4 border-red-500 bg-red-50 dark:bg-red-950/30 pl-2 py-1 rounded-r-sm">
                        <span className="text-red-700 dark:text-red-300 font-medium text-sm w-8">D2</span>
                        <select
                          className="flex-1 ml-2 text-sm bg-transparent border-0 focus:ring-0"
                          value={partySlots.D2 || ""}
                          onChange={(e) => assignToSlot("D2", e.target.value ? Number(e.target.value) : null)}
                        >
                          <option value="">-- 選択 --</option>
                          {sampleMembers
                            .filter(m => m.role === "DPS")
                            .map(member => (
                              <option key={member.id} value={member.id}>
                                {member.name}
                              </option>
                            ))}
                        </select>
                      </div>

                      <div className="flex items-center border-l-4 border-red-500 bg-red-50 dark:bg-red-950/30 pl-2 py-1 rounded-r-sm">
                        <span className="text-red-700 dark:text-red-300 font-medium text-sm w-8">D3</span>
                        <select
                          className="flex-1 ml-2 text-sm bg-transparent border-0 focus:ring-0"
                          value={partySlots.D3 || ""}
                          onChange={(e) => assignToSlot("D3", e.target.value ? Number(e.target.value) : null)}
                        >
                          <option value="">-- 選択 --</option>
                          {sampleMembers
                            .filter(m => m.role === "DPS")
                            .map(member => (
                              <option key={member.id} value={member.id}>
                                {member.name}
                              </option>
                            ))}
                        </select>
                      </div>

                      <div className="flex items-center border-l-4 border-red-500 bg-red-50 dark:bg-red-950/30 pl-2 py-1 rounded-r-sm">
                        <span className="text-red-700 dark:text-red-300 font-medium text-sm w-8">D4</span>
                        <select
                          className="flex-1 ml-2 text-sm bg-transparent border-0 focus:ring-0"
                          value={partySlots.D4 || ""}
                          onChange={(e) => assignToSlot("D4", e.target.value ? Number(e.target.value) : null)}
                        >
                          <option value="">-- 選択 --</option>
                          {sampleMembers
                            .filter(m => m.role === "DPS")
                            .map(member => (
                              <option key={member.id} value={member.id}>
                                {member.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* メンバーリスト（右） */}
                  <div className="h-[300px] border rounded-md p-2 overflow-y-auto">
                    <h3 className="font-medium text-sm mb-2">メンバー一覧</h3>
                    <div className="space-y-2">
                      {sampleMembers.map((member) => {
                        const assignedSlot = getMemberSlot(member.id);
                        return (
                          <div
                            key={member.id}
                            className={`flex items-center space-x-2 py-1 px-2 rounded ${
                              assignedSlot ? 'bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-gray-900'
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                                {member.avatar ? (
                                  <Image
                                    src={member.avatar}
                                    alt={member.name}
                                    width={32}
                                    height={32}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                                    {member.name.charAt(0)}
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-sm">{member.name}</p>
                                <p className="text-xs text-gray-500">
                                  {member.role} {assignedSlot && `(${assignedSlot})`}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
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