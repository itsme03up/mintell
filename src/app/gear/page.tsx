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
import { GearKey, Member } from '@/lib/types';
import { calcNeededTiers } from '@/lib/calcEligibleLayer';

// Define the order and full set of gear keys
const GEAR_KEYS_ORDERED: GearKey[] = [
  'weapon', 'head', 'body', 'hands', 'legs', 'feet', 'ear', 'neck', 'wrist', 'ring'
];

// Enhanced type: track boolean gear possession
interface EnhancedGearStatus {
  id: number;
  fullName: string;
  optIn: boolean;
  gear: Record<GearKey, boolean>;
}

interface GearStatusItem {
  id: number;
  optIn: boolean;
  gear: Record<GearKey, boolean>;
}

async function fetchCharactersData(): Promise<Member[]> {
  const response = await fetch('/api/members');
  if (!response.ok) {
    throw new Error('Failed to fetch members data');
  }
  const data: Member[] = await response.json();
  return data;
}

// Merge character and gear data from Supabase
async function fetchAndMergeData(): Promise<EnhancedGearStatus[]> {
  try {
    const response = await fetch('/api/gear');
    if (!response.ok) {
      throw new Error('Failed to fetch members data');
    }

    const membersData: Member[] = await fetchCharactersData();

    const data: GearStatusItem[] = await response.json();

    const gearMap = new Map(data?.map(g => [g.id, g as GearStatusItem]));

    return membersData.map(member => {
      const rec = gearMap.get(member.id);
      const baseGear: Record<GearKey, boolean> = GEAR_KEYS_ORDERED.reduce((acc, key) => {
        acc[key] = rec?.gear?.[key] ?? false;
        return acc;
      }, {} as Record<GearKey, boolean>);

      return {
        id: member.id,
        fullName: member.fullName,
        optIn: rec?.optIn ?? false,
        gear: baseGear,
      };
    });
  } catch (error) {
    console.error('Error loading member data:', error);
    alert('メンバー情報の読み込みに失敗しました。');
  }

  return [];
}

// Load hidden members hook
function useHiddenMembers() {
  const [hidden, setHidden] = useState<Set<number>>(new Set());

  const applyHidden = async () => {
    const membersData = await fetchCharactersData();

    const h = new Set(
      membersData.filter(c => (c as { isHidden?: boolean }).isHidden).map(c => c.id)
    );
    setHidden(h);
  }

  useEffect(() => {
    applyHidden();
  }, []);
  return hidden;
}

// Filter controls
function FilterControls({
  showHidden,
  onToggleHidden,
  showOptInOnly,
  onToggleOptInOnly,
}: {
  showHidden: boolean;
  onToggleHidden: (v: boolean | string) => void;
  showOptInOnly: boolean;
  onToggleOptInOnly: (v: boolean | string) => void;
}) {
  return (
    <div className="flex items-center space-x-6">
      <div className="flex items-center space-x-2">
        <Checkbox id="show-hidden" checked={showHidden} onCheckedChange={onToggleHidden} />
        <Label htmlFor="show-hidden">非表示メンバーを表示</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="show-opt-in" checked={showOptInOnly} onCheckedChange={onToggleOptInOnly} />
        <Label htmlFor="show-opt-in">参加希望のみ表示</Label>
      </div>
    </div>
  );
}

// Memoized row with boolean checkbox for gear
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
        <Image src={avatarUrl} alt={member.fullName} width={32} height={32} className="rounded-full" />
      </TableCell>
      <TableCell>{member.fullName}</TableCell>
      <TableCell className="text-center">
        <Checkbox checked={member.optIn} onCheckedChange={() => onOptInToggle(member.id)} />
      </TableCell>
      {gearKeys.map(key => (
        <TableCell key={key} className="text-center">
          <Checkbox
            checked={member.gear[key]}
            onCheckedChange={() => onGearToggle(member.id, key)}
            aria-label={`${key}装備チェック for ${member.fullName}`}
          />
        </TableCell>
      ))}
      <TableCell>
        {needed.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {needed.map(t => (
              <Badge key={t} variant="outline" className="bg-amber-100 text-amber-800">
                {t}層
              </Badge>
            ))}
          </div>
        ) : (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            完了
          </Badge>
        )}
      </TableCell>
    </TableRow>
  );
});

export default function GearPage() {
  const hiddenMembers = useHiddenMembers();
  const [gearData, setGearData] = useState<EnhancedGearStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showHidden, setShowHidden] = useState(false);
  const [showOptInOnly, setShowOptInOnly] = useState(false);
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [membersData, setMembersData] = useState<Member[]>([]);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);

      const data = await fetchAndMergeData();
      setGearData(data);

      const members = await fetchCharactersData();
      setMembersData(members);

      setIsLoading(false);
    }
    loadData();
  }, []);

  // Debounced save to Supabase
  const scheduleSave = useCallback(async (dataToSave: EnhancedGearStatus[]) => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);

    saveTimeout.current = setTimeout(async () => {
      try {
        setIsSaving(true);
        const response = await fetch('/api/gear', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ gearStatus: dataToSave }),
        });

        if (!response.ok) {
          throw new Error('Failed to save data');
        }
      } catch (error) {
        console.error('Error saving gear status data:', error);
        alert('データの保存に失敗しました。');
      } finally {
        setIsSaving(false);
      }
    }, 1000);
  }, []);

  // Toggle gear boolean
  const handleGearToggle = (memberId: number, key: GearKey) => {
    setGearData(prev => {
      const next = prev.map(m => m.id === memberId ? { ...m, gear: { ...m.gear, [key]: !m.gear[key] } } : m);
      scheduleSave(next);
      return next;
    });
  };

  // Toggle opt-in
  const handleOptInToggle = (memberId: number) => {
    setGearData(prev => {
      const next = prev.map(m => m.id === memberId ? { ...m, optIn: !m.optIn } : m);
      scheduleSave(next);
      return next;
    });
  };

  // Filter visible
  const visible = gearData.filter(m => (showHidden || !hiddenMembers.has(m.id)) && (!showOptInOnly || m.optIn));
  // Use the statically defined GEAR_KEYS_ORDERED for consistency
  const gearKeys = GEAR_KEYS_ORDERED;

  if (isLoading) {
    return <div className="p-6">読み込み中...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold text-primary">零式装備管理 {isSaving && '（保存中…）'}</h1>
      <FilterControls showHidden={showHidden} onToggleHidden={v => setShowHidden(v as boolean)} showOptInOnly={showOptInOnly} onToggleOptInOnly={v => setShowOptInOnly(v as boolean)} />
      <Card className="p-4 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>アバター</TableHead>
              <TableHead>名前</TableHead>
              <TableHead className="text-center">参加?</TableHead>
              {gearKeys.map(key => <TableHead key={key} className="text-center">{key.charAt(0).toUpperCase() + key.slice(1)}</TableHead>)}
              <TableHead>必要な層</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map(member => {
              const char = membersData.find(c => c.id === member.id);
              const avatarUrl = char?.avatarUrl || '/placeholder-avatar.png';
              return <GearRow key={member.id} member={member} avatarUrl={avatarUrl} gearKeys={gearKeys} onGearToggle={handleGearToggle} onOptInToggle={handleOptInToggle} />;
            })}
          </TableBody>
        </Table>
      </Card>
      {/* トークン計算機 */}
      <TokenCalculatorPage />
    </div>
  );
}
