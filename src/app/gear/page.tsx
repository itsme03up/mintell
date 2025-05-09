"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import TokenCalculatorPage from './token-calculator';
import { GearKey, GearStatus } from '@/lib/types';
import { calcNeededTiers } from '@/lib/calcEligibleLayer';
import charactersData from '@/data/characters.json';
import initialGearStatus from '@/data/gearStatus.json';

// Enhanced type with optIn
interface EnhancedGearStatus extends GearStatus {
  optIn: boolean;
}

// Merge character and gear data
function mergeData(): EnhancedGearStatus[] {
  const gearMap = new Map(initialGearStatus.map(g => [g.id, g]));
  return charactersData.map(c => {
    const gearRec = gearMap.get(c.id);
    return {
      id: c.id,
      fullName: c.fullName,
      optIn: gearRec?.optIn ?? false,
      gear: gearRec?.gear ?? {
        weapon: false, head: false, body: false, hands: false,
        legs: false, feet: false, ear: false, neck: false,
        wrist: false, ring: false,
      },
    };
  });
}

// Custom hook to load hidden members
function useHiddenMembers() {
  const [hidden, setHidden] = useState<Set<number>>(new Set());
  useEffect(() => {
    const setH = new Set(
      charactersData.filter(c => (c as any).isHidden).map(c => c.id)
    );
    setHidden(setH);
  }, []);
  return hidden;
}

// Filter controls component
function FilterControls({
  showHidden,
  onToggleHidden,
  showOptInOnly,
  onToggleOptInOnly,
}: {
  showHidden: boolean;
  onToggleHidden: (val: boolean) => void;
  showOptInOnly: boolean;
  onToggleOptInOnly: (val: boolean) => void;
}) {
  return (
    <div className="flex items-center space-x-6">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="show-hidden"
          checked={showHidden}
          onCheckedChange={onToggleHidden}
        />
        <Label htmlFor="show-hidden">非表示メンバーを表示</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="show-opt-in"
          checked={showOptInOnly}
          onCheckedChange={onToggleOptInOnly}
        />
        <Label htmlFor="show-opt-in">参加希望のみ表示</Label>
      </div>
    </div>
  );
}

// Memoized Gear row for performance
const GearRow = React.memo(function GearRow({
  member,
  avatarUrl,
  gearKeys,
  onGearToggle,
  onOptInToggle,
}: {
  member: EnhancedGearStatus;
  avatarUrl: string;
  gearKeys: GearKey[];
  onGearToggle: (id: number, key: GearKey) => void;
  onOptInToggle: (id: number) => void;
}) {
  const needed = calcNeededTiers(member.gear);
  return (
    <TableRow key={member.id} className={member.optIn ? '' : 'opacity-50'}>
      <TableCell className="pl-4">
        <Image
          src={avatarUrl}
          alt={member.fullName}
          width={32}
          height={32}
          className="rounded-full"
        />
      </TableCell>
      <TableCell>{member.fullName}</TableCell>
      <TableCell className="text-center">
        <Checkbox
          checked={member.optIn}
          onCheckedChange={() => onOptInToggle(member.id)}
        />
      </TableCell>
      {gearKeys.map(key => (
        <TableCell key={key} className="text-center">
          <Checkbox
            checked={member.gear[key]}
            onCheckedChange={() => onGearToggle(member.id, key)}
          />
        </TableCell>
      ))}
      <TableCell>
        {needed.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {needed.map(t => (
              <Badge
                key={t}
                variant="outline"
                className="bg-amber-100 text-amber-800"
              >
                {t}層
              </Badge>
            ))}
          </div>
        ) : (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800"
          >
            完了
          </Badge>
        )}
      </TableCell>
    </TableRow>
  );
});

export default function GearPage() {
  const hiddenMembers = useHiddenMembers();
  const [gearData, setGearData] = useState<EnhancedGearStatus[]>(mergeData());
  const [showHidden, setShowHidden] = useState(false);
  const [showOptInOnly, setShowOptInOnly] = useState(false);
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Debounced save
  const scheduleSave = useCallback((data: EnhancedGearStatus[]) => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(async () => {
      setIsSaving(true);
      try {
        await fetch('/api/gear', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ gear: data }),
        });
      } catch (e) {
        console.error(e);
        alert('保存に失敗しました');
      } finally {
        setIsSaving(false);
      }
    }, 1000);
  }, []);

  // Toggle gear
  const handleGearToggle = (memberId: number, key: GearKey) => {
    setGearData(prev => {
      const next = prev.map(m =>
        m.id === memberId
          ? { ...m, gear: { ...m.gear, [key]: !m.gear[key] } }
          : m
      );
      scheduleSave(next);
      return next;
    });
  };

  // Toggle opt-in
  const handleOptInToggle = (memberId: number) => {
    setGearData(prev => {
      const next = prev.map(m =>
        m.id === memberId ? { ...m, optIn: !m.optIn } : m
      );
      scheduleSave(next);
      return next;
    });
  };

  // Filtered members
  const visible = gearData.filter(
    m => (showHidden || !hiddenMembers.has(m.id)) && (!showOptInOnly || m.optIn)
  );
  const gearKeys = Object.keys(gearData[0].gear) as GearKey[];

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold text-primary">
        零式装備管理 {isSaving && '（保存中…）'}
      </h1>
      <FilterControls
        showHidden={showHidden}
        onToggleHidden={v => setShowHidden(v as boolean)}
        showOptInOnly={showOptInOnly}
        onToggleOptInOnly={v => setShowOptInOnly(v as boolean)}
      />
      <Card className="p-4 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>アバター</TableHead>
              <TableHead>名前</TableHead>
              <TableHead className="text-center">参加?</TableHead>
              {gearKeys.map(key => (
                <TableHead key={key} className="text-center">
                  {key}
                </TableHead>
              ))}
              <TableHead>必要な層</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map(member => {
              const char = charactersData.find(c => c.id === member.id);
              const avatarUrl = char?.avatarUrl || '/placeholder-avatar.png';
              return (
                <GearRow
                  key={member.id}
                  member={member}
                  avatarUrl={avatarUrl}
                  gearKeys={gearKeys}
                  onGearToggle={handleGearToggle}
                  onOptInToggle={handleOptInToggle}
                />
              );
            })}
          </TableBody>
        </Table>
      </Card>
      {/* トークン計算機 */}
      <TokenCalculatorPage />
    </div>
  );
}
