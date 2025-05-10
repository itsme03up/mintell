"use client";

import { Fragment, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
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
import characters from "@/data/characters.json";

// イベント型定義
interface Event {
  title: string;
  start: Date | string;
  allDay: boolean;
  id: number;
  color?: string;
  isBirthday?: boolean;
  memberId?: number;
  partyMembers?: number[];
  time?: string;
}

interface EventClickInfo {
  event: { id: string; title: string; start: Date | null; allDay: boolean; };
}

interface DateClickInfo { dateStr: string; allDay: boolean; }

export default function EventsPage() {
  const [allEvents, setAllEvents] = useState<Event[]>(initialEvents);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({ title: "", start: "", allDay: false, id: 0, time: "", partyMembers: [] });

  // 手動追加で使うキャラ一覧
  const availableMembers = characters.filter(c => !c.isHidden);

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.start) return;
    let title = newEvent.title;
    if (newEvent.isBirthday && newEvent.memberId) {
      const m = characters.find(c => c.id === newEvent.memberId);
      if (m) title += `: ${m.fullName}`;
    }
    let start = newEvent.start;
    if (!newEvent.allDay && newEvent.time && typeof start === 'string') {
      start = `${start.split('T')[0]}T${newEvent.time}`;
    } else if (typeof start === 'string') {
      start = start.split('T')[0];
    }
    const ev: Event = { ...(newEvent as Event), title, start, id: Date.now() };
    setAllEvents([...allEvents, ev]);
    setShowModal(false);
    setNewEvent({ title: "", start: "", allDay: false, id: 0, time: "", partyMembers: [] });
  };

  const handleEventClick = (info: EventClickInfo) => {
    setIdToDelete(Number(info.event.id));
    setShowDeleteModal(true);
  };

  const handleDeleteEvent = () => {
    if (idToDelete) setAllEvents(allEvents.filter(e => e.id !== idToDelete));
    setShowDeleteModal(false);
  };

  const handleDateClick = (info: DateClickInfo) => {
    setNewEvent({ ...newEvent, start: info.dateStr, allDay: info.allDay });
    setShowModal(true);
  };

  return (
    <>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold text-primary mb-4">イベント管理</h1>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-9">
            <Card className="p-4">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin]}
                headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' }}
                events={allEvents as EventSourceInput}
                nowIndicator
                editable
                selectable
                selectMirror
                locale="ja"
                eventClick={handleEventClick}
                dateClick={handleDateClick}
                height="auto"
              />
            </Card>
          </div>
          <div className="col-span-3">
            <Card className="p-4">
              <h2 className="text-lg font-semibold mb-2">新規イベント作成</h2>
              <Button variant="default" className="w-full" onClick={() => setShowModal(true)}>
                + イベント作成
              </Button>
            </Card>
          </div>
        </div>

        {/* 作成モーダル */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>新規イベント作成</DialogTitle>
              <DialogDescription>詳細を入力してください。</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex space-x-4">
                <Label htmlFor="event-title" className="w-24">タイトル</Label>
                <Input id="event-title" placeholder="例: 暗黒PT募集" value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} />
              </div>
              <div className="flex space-x-4">
                <Label htmlFor="event-date" className="w-24">日付</Label>
                <Input id="event-date" type="date" value={typeof newEvent.start === 'string' ? newEvent.start.split('T')[0] : ''} onChange={e => setNewEvent({ ...newEvent, start: e.target.value })} />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="allDay" checked={newEvent.allDay} onCheckedChange={val => setNewEvent({ ...newEvent, allDay: val as boolean, time: val ? '' : newEvent.time })} />
                <Label htmlFor="allDay">終日</Label>
              </div>
              {!newEvent.allDay && (
                <div className="flex space-x-4">
                  <Label htmlFor="event-time" className="w-24">時間</Label>
                  <Input id="event-time" type="time" value={newEvent.time} onChange={e => setNewEvent({ ...newEvent, time: e.target.value })} />
                </div>
              )}
              <div>
                <Label className="block mb-1">手動で追加: メンバーをドラッグ＆ドロップ</Label>
                <div className="mb-2 p-2 border rounded h-32 overflow-auto bg-gray-50">
                  {availableMembers.map(m => (
                    <div key={m.id} className="p-1 my-1 bg-white border rounded cursor-move">
                      {m.fullName}
                    </div>
                  ))}
                </div>
                <div className="p-2 border-dashed border-2 rounded h-32 overflow-auto bg-gray-50">
                  {newEvent.partyMembers?.map(id => {
                    const mb = availableMembers.find(x => x.id === id);
                    return mb ? <div key={id} className="p-1 my-1 bg-green-100 border rounded">{mb.fullName}</div> : null;
                  })}
                </div>
                <p className="text-xs text-muted mt-1">※ドラッグ＆ドロップ機能実装予定</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowModal(false)}>キャンセル</Button>
              <Button onClick={handleAddEvent}>保存</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 削除モーダル */}
        <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>削除確認</DialogTitle>
              <DialogDescription>このイベントを削除しますか？</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteModal(false)}>キャンセル</Button>
              <Button variant="destructive" onClick={handleDeleteEvent}>削除</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
