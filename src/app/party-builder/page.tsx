"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DndContext, useSensor, useSensors, PointerSensor, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Slot definitions
type Slot = "MT" | "ST" | "H1" | "H2" | "D1" | "D2" | "D3" | "D4";
const initialSlots: Record<Slot, number | null> = {
  MT: null,
  ST: null,
  H1: null,
  H2: null,
  D1: null,
  D2: null,
  D3: null, // Added missing D3 slot
  D4: null,
};

// Member type definition updated to match members page
interface Member {
  id: number;
  name: string;
  server: string;
  avatarUrl: string;
  // Potentially other fields like job, stats, etc.
}

// SortableItem component for displaying draggable members
function SortableItem({ id, member }: { id: string; member: Member }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id,
    data: {
      memberId: member.id,
      type: 'MEMBER_LIST_ITEM', // Differentiate item type for handleDragEnd logic
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab', // Visual cue for draggable item
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-2 border border-input rounded bg-card shadow-sm hover:shadow-md flex items-center space-x-2"
    >
      <Image
        src={member.avatarUrl}
        alt={member.name}
        width={32}
        height={32}
        className="rounded-full"
      />
      <span>{member.name}</span>
      <span className="text-sm text-muted-foreground">{member.server}</span>
    </div>
  );
}

export default function PartyBuilderPage() {
  const [slots, setSlots] = useState(initialSlots);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const sensors = useSensors(useSensor(PointerSensor));

  // Fetch real members from API
  useEffect(() => {
    fetch("/api/members")
      .then((res) => res.json())
      .then((data: Member[]) => {
        setMembers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    // Ensure active.data.current exists and its memberId property is a number.
    // Also ensure over.id is a slot ID.
    if (
      over &&
      active.data.current && // Check active.data.current is not undefined
      typeof active.data.current.memberId === 'number' && // Check memberId is a number
      String(over.id).startsWith("slot-")
    ) {
      const memberId = active.data.current.memberId; // memberId is now safely typed as number
      const slotKey = String(over.id).replace("slot-", "") as Slot;
      setSlots((prev) => ({ ...prev, [slotKey]: memberId }));
    }
  };

  if (loading) {
    return <div>読み込み中...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold text-primary">PTビルダー</h1>

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Party Slots */}
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">パーティスロット</h2>
            <div className="grid grid-cols-4 gap-2">
              {Object.keys(slots).map((slot) => {
                const memberId = slots[slot as Slot];
                const member = memberId !== null ? members.find((m) => m.id === memberId) : null;
                
                return (
                  <div
                    key={slot}
                    id={`slot-${slot}`}
                    className="h-16 border border-border rounded flex flex-col items-center justify-center p-1"
                  >
                    <div className="text-xs text-muted-foreground">{slot}</div>
                    {member ? (
                      <div className="flex flex-col items-center">
                        <Image
                          src={member.avatarUrl}
                          alt={member.name}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                        <div className="text-xs truncate max-w-full">{member.name}</div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Member List */}
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">メンバー候補</h2>
            <SortableContext items={members.map((m) => `${m.id}`)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {members.map((member) => (
                  <SortableItem key={member.id} id={`${member.id}`} member={member} />
                ))}
              </div>
            </SortableContext>
          </Card>
        </div>

        <div>
          <Button variant="default">PTを保存</Button>
        </div>
      </DndContext>

      {/* Status Table for Selected Members */}
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">装備ステータス</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>メンバー</TableHead>
              <TableHead>武器</TableHead>
              <TableHead>頭</TableHead>
              <TableHead>胴</TableHead>
              <TableHead>手</TableHead>
              <TableHead>脚</TableHead>
              <TableHead>足</TableHead>
              {/* 他の部位 */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.values(slots)
              .filter((id): id is number => id !== null)
              .map((memberId) => {
                const member = members.find((m) => m.id === memberId)!;
                return (
                  <TableRow key={member.id}>
                    <TableCell className="flex items-center space-x-2">
                      <Image
                        src={member.avatarUrl}
                        alt={member.name}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                      <span>{member.name}</span>
                    </TableCell>
                    {/* ダミー○×ステータス */}
                    <TableCell>○</TableCell>
                    <TableCell>×</TableCell>
                    <TableCell>○</TableCell>
                    <TableCell>×</TableCell>
                    <TableCell>○</TableCell>
                    <TableCell>×</TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
