"use client";

import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Card, Button, Dialog, DialogContent, DialogHeader, DialogFooter, Input, Label, Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui";
import characters from "@/data/characters.json";
import partiesData from "@/data/partybuilder.json";

interface Event {
  id: string;
  title: string;
  start: string;
  partyId?: number;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [selectedPartyId, setSelectedPartyId] = useState<string | undefined>(undefined);

  const allParties = partiesData;

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

    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(newEventTitle)}&dates=${formatGCalDate(startDate)}/${formatGCalDate(endDate)}&details=${encodeURIComponent("Mintell イベントです")}`;

    window.open(gcalUrl, "_blank");
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
        />
      </Card>

      <Dialog open={showModal} onOpenChange={setShowModal}>
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
              <Select value={selectedPartyId} onValueChange={setSelectedPartyId}>
                <SelectTrigger><SelectValue placeholder="選択してください" /></SelectTrigger>
                <SelectContent>
                  {allParties.map((p) => (
                    <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedPartyId && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">パーティメンバー</h3>
                <ul className="space-y-1">
                  {characters
                    .filter((c) => allParties.find((p) => p.id === parseInt(selectedPartyId))?.members.includes(c.id))
                    .map((c) => (
                      <li key={c.id}>{c.fullName}</li>
                    ))}
                </ul>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>キャンセル</Button>
            <Button onClick={handleAddEvent}>Googleカレンダーで登録</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
