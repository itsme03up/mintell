"use client";

import React, { useState } from "react";
import characters from "@/data/characters.json";
import { DndContext, useSensor, useSensors, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { PointerSensor } from "@dnd-kit/core";
import { useDroppable } from "@dnd-kit/core";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import SortableItem from "../components/SortableItem";

// PT スロットキー
const SLOT_KEYS = ["MT", "ST", "H1", "H2", "D1", "D2", "D3", "D4"] as const;
type SlotKey = typeof SLOT_KEYS[number];

export default function PartyBuilderPage() {
  const [slots, setSlots] = useState<Record<SlotKey, number | null>>(() => {
    return SLOT_KEYS.reduce((acc, key) => ({ ...acc, [key]: null }), {} as Record<SlotKey, number | null>);
  });

  // DnD-kit センサー
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  // ドラッグ終了ハンドラ
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && typeof over.id === "string" && over.id.startsWith("slot-")) {
      const slotKey = over.id.replace("slot-", "") as SlotKey;
      const memberId = parseInt(active.id as string, 10);
      setSlots(prev => ({ ...prev, [slotKey]: memberId }));
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-primary">PTビルダー</h1>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-2 gap-8">
          {/* PTスロット */}
          <div>
            <h2 className="text-lg font-semibold mb-4">パーティスロット</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ロール</TableHead>
                  <TableHead>キャラクター</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {SLOT_KEYS.map(key => (
                  <TableRow key={key}>
                    <TableCell className="font-medium">{key}</TableCell>
                    <TableCell>
                      <SlotBox slotKey={key} assignedId={slots[key]} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* メンバー候補 */}
          <div>
            <h2 className="text-lg font-semibold mb-4">メンバー候補</h2>
            <div className="space-y-2 max-h-[400px] overflow-auto">
              {characters.map(member => (
                <SortableItem
                  key={member.id}
                  id={member.id.toString()}
                  member={{ id: member.id, fullName: member.fullName }}
                />
              ))}
            </div>
          </div>
        </div>
      </DndContext>
      <div className="pt-4">
        <Button variant="default">PTを保存</Button>
      </div>
    </div>
  );
}

// ドロップ可能なスロットコンポーネント
function SlotBox({ slotKey, assignedId }: { slotKey: SlotKey; assignedId: number | null }) {
  const { setNodeRef, isOver } = useDroppable({ id: `slot-${slotKey}` });
  const member = assignedId !== null ? characters.find(m => m.id === assignedId) : null;

  return (
    <div
      ref={setNodeRef}
      className={`h-10 border border-border rounded flex items-center justify-center transition-colors ${
        isOver ? 'bg-primary/20' : 'bg-card'
      }`}
    >
      {member ? member.fullName : 'ドロップして配置'}
    </div>
  );
}
