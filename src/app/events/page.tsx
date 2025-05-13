"use client";

import { Fragment, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // Import interactionPlugin
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import characters from "@/data/characters.json";
import partiesData from "../../data/partybuilder.json";
import { supabase } from "@/lib/supabase"; // Supabase client import

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
  partyId?: number;
  time?: string;
}

interface Character {
  id: number;
  fullName: string;
  shortName?: string;
  nickname?: string;
  role?: string;
  job?: string;
  isHidden?: boolean;
  birthdate?: string;
  color?: string;
}

interface Party {
  id: number;
  name: string;
  members: number[];
}

interface EventClickInfo {
  event: { id: string; title: string; start: Date | null; allDay: boolean };
}

interface DateClickInfo {
  dateStr: string;
  allDay: boolean;
}

export default function EventsPage() {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);
  const [currentEventId, setCurrentEventId] = useState<number | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: "",
    start: "",
    allDay: false,
    id: 0,
    time: "",
    partyMembers: [],
    partyId: undefined,
  });

  const initialAvailableMembers: Character[] = characters;
  const [availableMembers, setAvailableMembers] =
    useState<Character[]>(initialAvailableMembers);
  const [partyMembersForNewEvent, setPartyMembersForNewEvent] = useState<
    Character[]
  >([]);

  const [allParties] = useState<Party[]>(partiesData);
  const [selectedPartyIdInModal, setSelectedPartyIdInModal] = useState<
    string | undefined
  >(undefined);

  // State for HTML5 Drag and Drop
  const [draggedCharacter, setDraggedCharacter] = useState<Character | null>(
    null
  );
  const [sourceList, setSourceList] = useState<"available" | "party" | null>(
    null
  );
  const [dragOverTarget, setDragOverTarget] = useState<
    "available" | "party" | null
  >(null);

  // Fetch initial events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase.from("events").select("*");
        if (error) throw error;
        setAllEvents(data as Event[]);
      } catch (e) {
        console.error("Error fetching events:", e);
      }
    };
    fetchEvents();
  }, []);

  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.start) return;
    let title = newEvent.title;
    if (newEvent.isBirthday && newEvent.memberId) {
      const m = characters.find((c) => c.id === newEvent.memberId);
      if (m) title += `: ${m.fullName}`;
    }
    let start = newEvent.start;
    if (!newEvent.allDay && newEvent.time && typeof start === "string") {
      start = `${start.split("T")[0]}T${newEvent.time}`;
    } else if (typeof start === "string") {
      start = start.split("T")[0];
    }

    let finalPartyMembers: number[];
    let finalPartyId: number | undefined = newEvent.partyId;

    if (finalPartyId) {
      const selectedParty = allParties.find((p) => p.id === finalPartyId);
      if (selectedParty) {
        finalPartyMembers = selectedParty.members;
      } else {
        finalPartyMembers = partyMembersForNewEvent.map((pm) => pm.id);
        finalPartyId = undefined;
      }
    } else {
      finalPartyMembers = partyMembersForNewEvent.map((pm) => pm.id);
    }

    const eventData: Event = {
      title,
      start,
      allDay: newEvent.allDay || false,
      id: isEditMode && currentEventId ? currentEventId : Date.now(),
      partyMembers: finalPartyMembers,
      partyId: finalPartyId,
      color: newEvent.color,
      isBirthday: newEvent.isBirthday,
      memberId: newEvent.memberId,
      time: newEvent.time,
    };

    try {
      const { data: upserted, error } = await supabase
        .from("events")
        .upsert([eventData], { onConflict: "id" })
        .select();
      if (error) throw error;
      const saved = upserted?.[0] ?? eventData;
      setAllEvents((prev) =>
        isEditMode
          ? prev.map((ev) => (ev.id === saved.id ? saved : ev))
          : [...prev, saved]
      );
      setShowModal(false);
      setIsEditMode(false);
      setCurrentEventId(null);
      setNewEvent({
        title: "",
        start: "",
        allDay: false,
        id: 0,
        time: "",
        partyMembers: [],
        partyId: undefined,
      });
      setPartyMembersForNewEvent([]);
      setAvailableMembers(initialAvailableMembers);
      setSelectedPartyIdInModal(undefined);
    } catch (e) {
      console.error("Error saving event:", e);
    }
  };

  const handleEventClick = (info: EventClickInfo) => {
    const clickedEventId = Number(info.event.id);
    const eventToEdit = allEvents.find((e) => e.id === clickedEventId);

    if (eventToEdit) {
      const baseEventState = {
        ...eventToEdit,
        start:
          typeof eventToEdit.start === "string"
            ? eventToEdit.start
            : eventToEdit.start.toISOString(),
        time: eventToEdit.allDay
          ? ""
          : eventToEdit.start &&
            typeof eventToEdit.start === "string"
          ? eventToEdit.start.split("T")[1]?.substring(0, 5)
          : new Date(eventToEdit.start).toTimeString().substring(0, 5) || "",
      };
      setNewEvent(baseEventState);

      if (eventToEdit.partyId) {
        const party = allParties.find((p) => p.id === eventToEdit.partyId);
        if (party) {
          setSelectedPartyIdInModal(party.id.toString());
          const partyMemberObjects = initialAvailableMembers.filter((c) =>
            party.members.includes(c.id)
          );
          setPartyMembersForNewEvent(partyMemberObjects);
          setAvailableMembers(
            initialAvailableMembers.filter(
              (c) => !party.members.includes(c.id)
            )
          );
        } else {
          setSelectedPartyIdInModal(undefined);
          const currentPartyMembers = eventToEdit.partyMembers
            ? characters.filter((c) =>
                eventToEdit.partyMembers?.includes(c.id)
              )
            : [];
          setPartyMembersForNewEvent(currentPartyMembers);
          setAvailableMembers(
            initialAvailableMembers.filter(
              (c) => !eventToEdit.partyMembers?.includes(c.id)
            )
          );
        }
      } else {
        setSelectedPartyIdInModal(undefined);
        const currentPartyMembers = eventToEdit.partyMembers
          ? characters.filter((c) => eventToEdit.partyMembers?.includes(c.id))
          : [];
        setPartyMembersForNewEvent(currentPartyMembers);
        setAvailableMembers(
          initialAvailableMembers.filter(
            (c) => !eventToEdit.partyMembers?.includes(c.id)
          )
        );
      }

      setCurrentEventId(clickedEventId);
      setIsEditMode(true);
      setShowModal(true);
    } else {
      setIdToDelete(clickedEventId);
      setShowDeleteModal(true);
    }
  };

  const handleDeleteEvent = async () => {
    if (idToDelete == null) return;
    try {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", idToDelete);
      if (error) throw error;
      setAllEvents((prev) => prev.filter((e) => e.id !== idToDelete));
      if (isEditMode && currentEventId === idToDelete) {
        setShowModal(false);
        setIsEditMode(false);
        setCurrentEventId(null);
        setNewEvent({
          title: "",
          start: "",
          allDay: false,
          id: 0,
          time: "",
          partyMembers: [],
          partyId: undefined,
        });
        setPartyMembersForNewEvent([]);
        setAvailableMembers(initialAvailableMembers);
        setSelectedPartyIdInModal(undefined);
      }
    } catch (e) {
      console.error("Error deleting event:", e);
    } finally {
      setShowDeleteModal(false);
      setIdToDelete(null);
    }
  };

  const handleDateClick = (info: DateClickInfo) => {
    setNewEvent({
      title: "",
      start: info.dateStr,
      allDay: info.allDay,
      time: "",
      partyMembers: [],
      partyId: undefined,
    });
    setPartyMembersForNewEvent([]);
    setAvailableMembers(initialAvailableMembers);
    setSelectedPartyIdInModal(undefined);
    setIsEditMode(false);
    setCurrentEventId(null);
    setShowModal(true);
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    member: Character,
    listType: "available" | "party"
  ) => {
    setDraggedCharacter(member);
    setSourceList(listType);
    e.dataTransfer.setData("application/json", JSON.stringify(member));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    targetListType: "available" | "party"
  ) => {
    e.preventDefault();
    if (draggedCharacter && sourceList !== targetListType) {
      e.dataTransfer.dropEffect = "move";
      setDragOverTarget(targetListType);
    } else {
      e.dataTransfer.dropEffect = "none";
      setDragOverTarget(null);
    }
  };

  const handleDragLeave = () => {
    setDragOverTarget(null);
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    targetListType: "available" | "party"
  ) => {
    e.preventDefault();
    if (!draggedCharacter || !sourceList || sourceList === targetListType) {
      setDragOverTarget(null);
      setDraggedCharacter(null);
      setSourceList(null);
      return;
    }

    if (selectedPartyIdInModal) {
      setSelectedPartyIdInModal(undefined);
      setNewEvent((prev) => ({ ...prev, partyId: undefined }));
    }

    if (sourceList === "available" && targetListType === "party") {
      setPartyMembersForNewEvent((prev) => [...prev, draggedCharacter]);
      setAvailableMembers((prev) =>
        prev.filter((m) => m.id !== draggedCharacter.id)
      );
    } else if (sourceList === "party" && targetListType === "available") {
      setAvailableMembers((prev) => [...prev, draggedCharacter]);
      setPartyMembersForNewEvent((prev) =>
        prev.filter((m) => m.id !== draggedCharacter.id)
      );
    }
    setDragOverTarget(null);
    setDraggedCharacter(null);
    setSourceList(null);
  };

  const handleDragEnd = () => {
    setDraggedCharacter(null);
    setSourceList(null);
    setDragOverTarget(null);
  };

  const openDeleteModalFromEdit = () => {
    if (currentEventId) {
      setIdToDelete(currentEventId);
      setShowDeleteModal(true);
    }
  };

  const handlePartySelectionChange = (partyIdStr: string | undefined) => {
    if (!partyIdStr || partyIdStr === "custom") {
      setSelectedPartyIdInModal(undefined);
      setNewEvent((prev) => ({ ...prev, partyId: undefined }));
    } else {
      const partyId = parseInt(partyIdStr, 10);
      const selectedParty = allParties.find((p) => p.id === partyId);
      if (selectedParty) {
        setSelectedPartyIdInModal(partyIdStr);
        setNewEvent((prev) => ({ ...prev, partyId: partyId }));
        const partyMemberObjects = initialAvailableMembers.filter((c) =>
          selectedParty.members.includes(c.id)
        );
        setPartyMembersForNewEvent(partyMemberObjects);
        setAvailableMembers(
          initialAvailableMembers.filter(
            (c) => !selectedParty.members.includes(c.id)
          )
        );
      }
    }
  };

  return (
    <>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold text-primary mb-4">イベント管理</h1>
        <div className="col-span-9">
          <Card className="p-4">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} // Add interactionPlugin
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
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
            <Button
              variant="default"
              className="w-full"
              onClick={() => setShowModal(true)}
            >
              + イベント作成
            </Button>
          </Card>
        </div>
      </div>

      {/* 作成モーダル */}
      <Dialog
        open={showModal}
        onOpenChange={(isOpen) => {
          setShowModal(isOpen);
          if (!isOpen) {
            setPartyMembersForNewEvent([]);
            setAvailableMembers(initialAvailableMembers);
            setDraggedCharacter(null);
            setSourceList(null);
            setDragOverTarget(null);
            setIsEditMode(false);
            setCurrentEventId(null);
            setNewEvent({
              title: "",
              start: "",
              allDay: false,
              id: 0,
              time: "",
              partyMembers: [],
              partyId: undefined,
            });
            setSelectedPartyIdInModal(undefined);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "イベント編集" : "新規イベント作成"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "イベント詳細を編集してください。"
                : "詳細を入力してください。"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex space-x-4">
              <Label htmlFor="event-title" className="w-24">
                タイトル
              </Label>
              <Input
                id="event-title"
                placeholder="例: 暗黒PT募集"
                value={newEvent.title}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, title: e.target.value })
                }
              />
            </div>
            <div className="flex space-x-4">
              <Label htmlFor="event-date" className="w-24">
                日付
              </Label>
              <Input
                id="event-date"
                type="date"
                value={
                  typeof newEvent.start === "string"
                    ? newEvent.start.split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setNewEvent({ ...newEvent, start: e.target.value })
                }
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="allDay"
                checked={newEvent.allDay}
                onCheckedChange={(val) =>
                  setNewEvent({
                    ...newEvent,
                    allDay: val as boolean,
                    time: val ? "" : newEvent.time,
                  })
                }
              />
              <Label htmlFor="allDay">終日</Label>
            </div>
            {!newEvent.allDay && (
              <div className="flex space-x-4">
                <Label htmlFor="event-time" className="w-24">
                  時間
                </Label>
                <Input
                  id="event-time"
                  type="time"
                  value={newEvent.time}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, time: e.target.value })
                  }
                />
              </div>
            )}
            <div>
              <Label htmlFor="party-select" className="block mb-1">
                パーティー選択
              </Label>
              <Select
                value={selectedPartyIdInModal}
                onValueChange={handlePartySelectionChange}
              >
                <SelectTrigger id="party-select">
                  <SelectValue placeholder="カスタム / パーティー指定なし" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="custom">
                    カスタム / パーティー指定なし
                  </SelectItem>
                  {allParties.map((party) => (
                    <SelectItem key={party.id} value={party.id.toString()}>
                      {party.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="block mb-1 mt-2">メンバー</Label>
              <div className="grid grid-cols-2 gap-2">
                {/* Available Members List */}
                <div
                  onDragOver={(e) => handleDragOver(e, "available")}
                  onDrop={(e) => handleDrop(e, "available")}
                  onDragLeave={handleDragLeave}
                  className={`p-2 border rounded h-48 overflow-auto bg-gray-50 ${
                    dragOverTarget === "available"
                      ? "bg-blue-100 border-blue-300"
                      : ""
                  }`}
                >
                  <p className="text-xs text-muted mb-1">利用可能なメンバー</p>
                  {availableMembers.map((member) => (
                    <div
                      key={member.id}
                      draggable
                      onDragStart={(e) =>
                        handleDragStart(e, member, "available")
                      }
                      onDragEnd={handleDragEnd}
                      className={`p-1 my-1 bg-white border rounded cursor-move ${
                        draggedCharacter?.id === member.id ? "opacity-50" : ""
                      }`}
                    >
                      {member.fullName}
                    </div>
                  ))}
                </div>
                {/* Party Members List */}
                <div
                  onDragOver={(e) => handleDragOver(e, "party")}
                  onDrop={(e) => handleDrop(e, "party")}
                  onDragLeave={handleDragLeave}
                  className={`p-2 border-dashed border-2 rounded h-48 overflow-auto bg-gray-50 ${
                    dragOverTarget === "party"
                      ? "bg-green-100 border-green-300"
                      : ""
                  }`}
                >
                  <p className="text-xs text-muted mb-1">
                    イベント参加メンバー
                  </p>
                  {partyMembersForNewEvent.map((member) => (
                    <div
                      key={member.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, member, "party")}
                      onDragEnd={handleDragEnd}
                      className={`p-1 my-1 bg-green-100 border rounded cursor-move ${
                        draggedCharacter?.id === member.id ? "opacity-50" : ""
                      }`}
                    >
                      {member.fullName}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowModal(false);
              }}
            >
              キャンセル
            </Button>
            <Button onClick={handleAddEvent}>
              {isEditMode ? "更新" : "保存"}
            </Button>
            {isEditMode && (
              <Button
                variant="destructive"
                onClick={openDeleteModalFromEdit}
                className="ml-2"
              >
                削除
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 削除モーダル */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>削除確認</DialogTitle>
            <DialogDescription>
              このイベントを削除しますか？
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              キャンセル
            </Button>
            <Button variant="destructive" onClick={handleDeleteEvent}>
              削除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
