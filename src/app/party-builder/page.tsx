"use client";

import React, { useState, useEffect } from "react";
import { DndContext, useSensor, useSensors, closestCenter, DragEndEvent, DragStartEvent, DragOverlay } from "@dnd-kit/core";
import { PointerSensor } from "@dnd-kit/core";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Member } from "@/lib/types";
import SortableItem from "../components/SortableItem";

// PT スロットキー
const SLOT_KEYS = ["MT", "ST", "H1", "H2", "D1", "D2", "D3", "D4"] as const;
type SlotKey = typeof SLOT_KEYS[number];

const initialSlotsState = () => SLOT_KEYS.reduce((acc, key) => ({ ...acc, [key]: null }), {} as Record<SlotKey, number | null>);

interface SavedParty {
  id: string;
  name: string;
  slots?: Record<SlotKey, number | null>;
  members?: number[];
}

export default function PartyBuilderPage() {
  const [slots, setSlots] = useState<Record<SlotKey, number | null>>(initialSlotsState);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [partyName, setPartyName] = useState<string>("");
  const [hasMounted, setHasMounted] = useState(false); // New state for client-side rendering
  const [savedParties, setSavedParties] = useState<SavedParty[]>([]);
  const [characters, setCharacters] = useState<Member[]>([]);

  useEffect(() => {
    setHasMounted(true); // Set to true after component mounts on client
  }, []);

  const initParties = async () => {
    const response = await fetch('/api/partybuilder');
    if (!response.ok) {
      throw new Error('Failed to fetch members data');
    }

    const data = await response.json();

    setSavedParties(data);
  }

  const initMembers = async () => {
    try {
      const response = await fetch('/api/members');
      if (!response.ok) {
        throw new Error('Failed to fetch members data');
      }
      const membersData: Member[] = await response.json();
      setCharacters(membersData);
    } catch (error) {
      console.error('Error fetching members:', error);
      alert('メンバーの取得に失敗しました。');
    }
  }

  useEffect(() => {
    initParties();
    initMembers();
  }, []); // Empty dependency array: runs once on mount.

  const saveParties = async (savedParties: SavedParty[]) => {
    try {
      const response = await fetch('/api/partybuilder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ parties: savedParties }), // 'partybuilder' を 'parties' に変更
      });

      if (!response.ok) {
        throw new Error('Failed to save data');
      }
    } catch (error) {
      console.error('Error saving party builder data:', error);
      alert('データの保存に失敗しました。');
    }
  }

  useEffect(() => {
    if (!hasMounted) return; // Ensure this runs only on client and after initial mount
    saveParties(savedParties);
  }, [savedParties, hasMounted]);

  // DnD-kit センサー
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  // ドラッグ開始ハンドラ
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  // ドラッグ終了ハンドラ
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && typeof over.id === "string" && over.id.startsWith("slot-")) {
      const slotKey = over.id.replace("slot-", "") as SlotKey;
      const memberId = parseInt(active.id as string, 10);
      setSlots(prev => ({ ...prev, [slotKey]: memberId }));
    }
    setActiveId(null);
  };

  const activeCharacter = activeId ? characters.find(c => c.id.toString() === activeId) : null;

  const handleSaveParty = () => {
    if (!partyName.trim()) {
      alert("PT名を入力してください。");
      return;
    }
    const existingPartyIndex = savedParties.findIndex(p => p.name === partyName.trim());
    if (existingPartyIndex > -1) {
      // Update existing party
      const updatedParties = [...savedParties];
      updatedParties[existingPartyIndex] = { ...savedParties[existingPartyIndex], slots: { ...slots } };
      setSavedParties(updatedParties);
      alert(`PT「${partyName}」を更新しました。`);
    } else {
      // Add new party
      const newParty: SavedParty = {
        id: Date.now().toString(),
        name: partyName.trim(),
        slots: { ...slots },
        members: [],
      };
      setSavedParties(prev => [...prev, newParty]);
      alert(`PT「${partyName}」を保存しました。`);
    }
  };

  const handleLoadParty = (partyToLoad: SavedParty) => {
    if (partyToLoad?.slots) {
      setSlots({ ...partyToLoad.slots });
    }
    setPartyName(partyToLoad.name);
    alert(`PT「${partyToLoad.name}」を読み込みました。`);
  };

  const handleDeleteParty = (partyIdToDelete: string) => {
    if (confirm("このPTを削除してもよろしいですか？")) {
      setSavedParties(prev => prev.filter(p => p.id !== partyIdToDelete));
      alert("PTを削除しました。");
    }
  };

  const handleClearParty = () => {
    setSlots(initialSlotsState());
    setPartyName("");
  };

  if (!hasMounted) {
    // Render nothing or a loading indicator on the server and during initial client hydration
    return null;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-primary">PTビルダー</h1>

      {/* Party Name Input and Save/Clear Buttons */}
      <div className="flex items-center gap-4 mb-6">
        <Input
          placeholder="PT名を入力"
          value={partyName}
          onChange={(e) => setPartyName(e.target.value)}
          className="max-w-xs"
        />
        <Button variant="default" onClick={handleSaveParty}>PTを保存</Button>
        <Button variant="outline" onClick={handleClearParty}>現在のPTをクリア</Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
        <div className="grid grid-cols-2 gap-8">
          {/* PTスロット */}
          <div>
            <h2 className="text-lg font-semibold mb-4">パーティスロット {partyName && `(${partyName})`}</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ロール</TableHead>
                  <TableHead>キャラクター</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {SLOT_KEYS.map(key => {
                  const isTankRole = key === "MT" || key === "ST";
                  const isHealerRole = key === "H1" || key === "H2";
                  const isDpsRole = key === "D1" || key === "D2" || key === "D3" || key === "D4";

                  let roleBgClass = "";
                  if (isTankRole) {
                    roleBgClass = "bg-blue-100 dark:bg-blue-900";
                  } else if (isHealerRole) {
                    roleBgClass = "bg-green-100 dark:bg-green-900";
                  } else if (isDpsRole) {
                    roleBgClass = "bg-red-100 dark:bg-red-900";
                  }

                  return (
                    <TableRow
                      key={key}
                    >
                      <TableCell className={`font-medium ${roleBgClass}`}>{key}</TableCell>
                      <TableCell className={roleBgClass}>
                        <SlotBox characters={characters} slotKey={key} assignedId={slots[key]} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* メンバー候補 */}
          <div>
            <h2 className="text-lg font-semibold mb-4">メンバー候補</h2>
            <div className="space-y-2 max-h-[400px] overflow-auto">
              <SortableContext
                items={characters.map(c => c.id.toString())}
                strategy={verticalListSortingStrategy}
              >
                {characters.map(member => (
                  <SortableItem
                    key={member.id}
                    id={member.id.toString()}
                    member={{ id: member.id, fullName: member.fullName }}
                  />
                ))}
              </SortableContext>
            </div>
          </div>
        </div>
        <DragOverlay>
          {activeCharacter ? (
            <SortableItem
              id={activeCharacter.id.toString()}
              member={{ id: activeCharacter.id, fullName: activeCharacter.fullName }}
              isDragging
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Saved Parties List */}
      {savedParties.length > 0 && (
        <div className="pt-8">
          <h2 className="text-xl font-semibold mb-4">保存済みPT</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PT名</TableHead>
                <TableHead className="text-right">アクション</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {savedParties.map(party => (
                <TableRow key={party.id}>
                  <TableCell className="font-medium">{party.name}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleLoadParty(party)}>読み込む</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteParty(party.id)}>削除</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

// ドロップ可能なスロットコンポーネント
function SlotBox({ characters, slotKey, assignedId }: { characters: Member[]; slotKey: SlotKey; assignedId: number | null }) {
  const { setNodeRef, isOver } = useDroppable({ id: `slot-${slotKey}` });
  const member = assignedId !== null ? characters.find(m => m.id === assignedId) : null;

  return (
    <div
      ref={setNodeRef}
      className={`h-10 border border-border rounded flex items-center justify-center transition-colors ${isOver ? 'bg-primary/20' : 'bg-card'
        }`}
    >
      {member ? member.fullName : 'ドロップして配置'}
    </div>
  );
}
