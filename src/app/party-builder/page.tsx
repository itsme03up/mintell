"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table } from "@/components/ui/table";
import { DndContext, useSensor, useSensors, PointerSensor, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
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
  D4: null,
};

// Member type definition
interface Member {
  id: number;
  name: string;
  // Potentially other fields like job, stats, etc.
}

// Dummy member data
const dummyMembers: Member[] = [
  { id: 1, name: "アリサ" },
  { id: 2, name: "ボブ" },
  { id: 3, name: "キャシー" },
  { id: 4, name: "デイビッド" },
  { id: 5, name: "エマ" },
  { id: 6, name: "フランク" },
  { id: 7, name: "グレース" },
  { id: 8, name: "ヘンリー" },
];

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
      className="p-2 border border-input rounded bg-card shadow-sm hover:shadow-md"
    >
      {member.name}
    </div>
  );
}

export default function PartyBuilderPage() {
  const [slots, setSlots] = useState(initialSlots);
  const sensors = useSensors(useSensor(PointerSensor));
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.data.current?.slot && over.id.startsWith("slot-")) {
      const slotKey = over.id.replace("slot-", "") as Slot;
      setSlots((prev) => ({ ...prev, [slotKey]: active.data.current.memberId }));
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold text-primary">PTビルダー</h1>

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Party Slots */}
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">パーティスロット</h2>
            <div className="grid grid-cols-4 gap-2">
              {Object.keys(slots).map((slot) => (
                <div
                  key={slot}
                  id={`slot-${slot}`}
                  className="h-12 border border-border rounded flex items-center justify-center"
                >
                  {slots[slot as Slot]
                    ? dummyMembers.find((m) => m.id === slots[slot as Slot])?.name
                    : slot}
                </div>
              ))}
            </div>
          </Card>

          {/* Member List */}
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">メンバー候補</h2>
            <SortableContext items={dummyMembers.map((m) => `${m.id}`)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {dummyMembers.map((member) => (
                  <SortableItem key={member.id} id={`${member.id}`} member={member} />
                ))}
              </div>
            </SortableContext>
          </Card>
        </div>

        <div>
          <Button variant="primary">PTを保存</Button>
        </div>
      </DndContext>

      {/* Status Table for Selected Members */}
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">装備ステータス</h2>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head>メンバー</Table.Head>
              <Table.Head>武器</Table.Head>
              <Table.Head>頭</Table.Head>
              <Table.Head>胴</Table.Head>
              <Table.Head>手</Table.Head>
              <Table.Head>脚</Table.Head>
              <Table.Head>足</Table.Head>
              {/* 他の部位 */}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {Object.values(slots)
              .filter((id): id is number => id !== null)
              .map((memberId) => {
                const member = dummyMembers.find((m) => m.id === memberId)!;
                return (
                  <Table.Row key={member.id}>
                    <Table.Cell>{member.name}</Table.Cell>
                    {/* ダミー○×ステータス */}
                    <Table.Cell>○</Table.Cell>
                    <Table.Cell>×</Table.Cell>
                    <Table.Cell>○</Table.Cell>
                    <Table.Cell>×</Table.Cell>
                    <Table.Cell>○</Table.Cell>
                    <Table.Cell>×</Table.Cell>
                  </Table.Row>
                );
              })}
          </Table.Body>
        </Table>
      </Card>
    </div>
  );
}
