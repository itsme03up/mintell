"use client";

import { useState } from "react";
import characters from "@/data/characters.json";
import { DndContext, useSensor, useSensors, closestCenter } from "@dnd-kit/core";
import { PointerSensor } from "@dnd-kit/core";
import { useDroppable } from "@dnd-kit/core";
import { Button } from "@/components/ui/button";
import SortableItem from "@/components/sortable-item";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

// PT スロット定義
const SLOT_KEYS = ["MT", "ST", "H1", "H2", "D1", "D2", "D3", "D4"] as const;
type SlotKey = typeof SLOT_KEYS[number];

export default function PartyBuilderPage() {
  const [slots, setSlots] = useState<Record<SlotKey, number | null>>(() => {
    const init: Record<SlotKey, number | null> = {} as Record<SlotKey, number | null>;
    SLOT_KEYS.forEach((key) => {
      init[key] = null;
    });
    return init;
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = (event: { active: { id: string }; over: { id: string } | null }) => {
    const { active, over } = event;
    if (over && typeof over.id === "string" && over.id.startsWith("slot-")) {
      const slotKey = over.id.replace("slot-", "") as SlotKey;
      const memberId = parseInt(active.id, 10);
      setSlots((prev) => ({ ...prev, [slotKey]: memberId }));
    }
  };

  return (
    <div className="space-y-6 p-6 pl-10">
      <h1 className="text-2xl font-bold text-primary">PTビルダー</h1>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-2 gap-6">
          {/* パーティスロット */}
          <div>
            <h2 className="text-lg font-semibold mb-4">パーティスロット</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/3">ロール</TableHead>
                  <TableHead className="w-2/3">キャラクター</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {SLOT_KEYS.map((key) => (
                  <TableRow key={key}>
                    <TableCell className="font-medium w-1/3">{key}</TableCell>
                    <TableCell className="w-2/3">
                      <SlotBox
                        slotKey={key}
                        assignedId={slots[key]}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* メンバー候補 */}
          <div>
            <h2 className="text-lg font-semibold mb-4">メンバー候補</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>キャラクター名</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="max-h-[400px] overflow-auto">
                {characters.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <SortableItem
                        id={member.id.toString()}
                        member={{ id: member.id, fullName: member.fullName }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </DndContext>

      <div>
        <Button variant="primary">PTを保存</Button>
      </div>
    </div>
  );
}

// ドロップ可能なスロットコンポーネント
function SlotBox({
  slotKey,
  assignedId,
}: {
  slotKey: SlotKey;
  assignedId: number | null;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: `slot-${slotKey}` });
  const member = assignedId
    ? characters.find((m) => m.id === assignedId)
    : null;

  return (
    <div
      ref={setNodeRef}
      className={`h-10 border border-border rounded flex items-center justify-center ${
        isOver ? 'bg-primary/20' : 'bg-card'
      }`}
    >
      {member ? member.fullName : "ドロップ"}
    </div>
  );
}
