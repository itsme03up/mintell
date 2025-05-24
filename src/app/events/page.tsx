"use client";

import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Member } from "@/lib/types";

interface Event {
  id: string;
  title: string;
  start: string;
  partyId?: number;
}

interface Party {
  id: string;
  name: string;
  members?: number[];
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [selectedPartyId, setSelectedPartyId] = useState<string | undefined>(undefined);
  const [characters, setCharacters] = useState<Member[]>([]);
  const [availableMembers, setAvailableMembers] = useState<Member[]>([]);
  const [eventMembers, setEventMembers] = useState<Member[]>([]);
  const [parties, setParties] = useState<Party[]>([]);

  const initParties = async () => {
    const response = await fetch('/api/partybuilder');
    if (!response.ok) {
      throw new Error('Failed to fetch members data');
    }

    const data = await response.json();

    setParties(data);
  }

  const initMembers = async () => {
    try {
      const response = await fetch('/api/members');
      if (!response.ok) {
        throw new Error('Failed to fetch members data');
      }

      const membersData: Member[] = await response.json();

      setCharacters(membersData);
      setAvailableMembers(membersData);
    } catch (error) {
      console.error('Error fetching members:', error);
      alert('メンバーの取得に失敗しました。');
    }
  }

  useEffect(() => {
    initParties();
    initMembers();
  }, []);

  const resetNewEventForm = () => {
    setNewEventTitle("");
    setNewEventDate("");
    setSelectedPartyId(undefined);
    setEventMembers([]); // Reset event members
    setAvailableMembers(characters); // Reset available members
  };

  const handleDateClick = (info: { dateStr: string }) => {
    setNewEventDate(info.dateStr);
    setShowModal(true);
  };

  const handleAddEvent = () => {
    if (!newEventTitle || !newEventDate) return;

    const newEvent: Event = {
      id: Date.now().toString(),
      title: newEventTitle,
      start: newEventDate,
      partyId: selectedPartyId ? parseInt(selectedPartyId, 10) : undefined,
    };

    setEvents((prev) => [...prev, newEvent]);
    setShowModal(false);

    const startDate = new Date(newEventDate);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // +2時間

    const formatGCalDate = (date: Date) =>
      date.toISOString().replace(/[-:.]/g, "").split(".")[0] + "Z";

    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(newEventTitle)}&dates=${formatGCalDate(startDate)}/${formatGCalDate(endDate)}&details=${encodeURIComponent("参加メンバー：" + eventMembers.map(m => m.fullName).join(", "))}`;

    window.open(gcalUrl, "_blank");
    resetNewEventForm(); // Reset form fields AFTER gcalUrl is constructed
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents((prevEvents) => prevEvents.filter(event => event.id !== eventId));
  };

  const handleDragStart = (e: React.DragEvent, memberId: number) => {
    e.dataTransfer.setData("memberId", memberId.toString());
  };

  const handleDrop = (e: React.DragEvent, target: "available" | "event") => {
    e.preventDefault();
    const memberId = parseInt(e.dataTransfer.getData("memberId"), 10);
    if (isNaN(memberId)) return;

    if (target === "event") {
      const member = availableMembers.find((m) => m.id === memberId);
      if (member) {
        setEventMembers((prev) => [...prev, member]);
        setAvailableMembers((prev) => prev.filter((m) => m.id !== memberId));
      }
    } else if (target === "available") {
      const member = eventMembers.find((m) => m.id === memberId);
      if (member) {
        setAvailableMembers((prev) => [...prev, member]);
        setEventMembers((prev) => prev.filter((m) => m.id !== memberId));
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handlePartySelect = (partyIdStr: string) => {
    setSelectedPartyId(partyIdStr);

    const party = parties.find((p) => p.id === partyIdStr);
    if (party) {
      const membersInParty = characters.filter((c) => party.members?.includes(c.id));
      const remainingAvailable = characters.filter((c) => !party.members?.includes(c.id));
      setEventMembers(membersInParty);
      setAvailableMembers(remainingAvailable);
    } else {
      // If partyIdStr is undefined or party not found, reset members
      setEventMembers([]);
      setAvailableMembers(characters);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-4">Mintell イベント管理</h1>
      <Card className="p-4">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          dateClick={handleDateClick}
          eventContent={(eventInfo) => (
            <div className="flex items-center justify-between w-full">
              <span className="truncate" title={eventInfo.event.title}>{eventInfo.event.title}</span>
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 p-1 h-auto text-xs text-red-500 hover:bg-red-100"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent eventClick if we were using it
                  handleDeleteEvent(eventInfo.event.id);
                }}
              >
                削除
              </Button>
            </div>
          )}
        />
      </Card>

      <Dialog open={showModal} onOpenChange={(isOpen) => {
        setShowModal(isOpen);
        if (!isOpen) {
          resetNewEventForm(); // Reset form fields when dialog is closed
        }
      }}>
        <DialogContent>
          <DialogHeader>新規イベント作成</DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>タイトル</Label>
              <Input value={newEventTitle} onChange={(e) => setNewEventTitle(e.target.value)} />
            </div>
            <div>
              <Label>日付</Label>
              <Input type="date" value={newEventDate} onChange={(e) => setNewEventDate(e.target.value)} />
            </div>
            <div>
              <Label>パーティ選択</Label>
              <Select value={selectedPartyId} onValueChange={handlePartySelect}>
                <SelectTrigger><SelectValue placeholder="選択してください" /></SelectTrigger>
                <SelectContent>
                  {parties.map((p) => (
                    <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div
                onDrop={(e) => handleDrop(e, "available")}
                onDragOver={handleDragOver}
                className="border p-2 rounded bg-gray-50 min-h-[200px]" // Added min-h for better drop target
              >
                <h3 className="font-semibold mb-2">全メンバー</h3>
                <div className="max-h-40 overflow-y-auto"> {/* Added max-h and overflow */}
                  {availableMembers.map((m) => (
                    <div
                      key={m.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, m.id)}
                      className="p-1 border rounded my-1 bg-white cursor-move"
                    >
                      {m.fullName}
                    </div>
                  ))}
                </div>
              </div>

              <div
                onDrop={(e) => handleDrop(e, "event")}
                onDragOver={handleDragOver}
                className="border p-2 rounded bg-green-50 min-h-[200px]" // Added min-h for better drop target
              >
                <h3 className="font-semibold mb-2">イベント参加者</h3>
                <div className="max-h-40 overflow-y-auto"> {/* Added max-h and overflow */}
                  {eventMembers.map((m) => (
                    <div
                      key={m.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, m.id)}
                      className="p-1 border rounded my-1 bg-green-100 cursor-move"
                    >
                      {m.fullName}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowModal(false);
              resetNewEventForm(); // Also reset on explicit cancel
            }}>キャンセル</Button>
            <Button onClick={handleAddEvent}>Googleカレンダーで登録</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
