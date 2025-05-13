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
import { GearKey } from '@/lib/types';
import { calcNeededTiers } from '@/lib/calcEligibleLayer';
import charactersData from '@/data/characters.json';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

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

// Supabase table type
interface GearStatusSupabaseRow {
  id: number;
  optIn: boolean;
  gear: Record<GearKey, boolean>;
}

// Merge character and gear data from Supabase
async function fetchAndMergeData(client: SupabaseClient): Promise<EnhancedGearStatus[]> {
  const { data: gearStatusData, error } = await client
    .from('gear_status')
    .select('id, optIn, gear');

  if (error) {
    console.error('Error fetching gear status:', error);
    // Fallback to local charactersData with default gear if Supabase fetch fails
    // This ensures the app can still display characters, though without saved gear.
    return charactersData.map(c => ({
      id: c.id,
      fullName: c.fullName,
      optIn: false,
      gear: GEAR_KEYS_ORDERED.reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {} as Record<GearKey, boolean>),
    }));
  }

  const gearMap = new Map(gearStatusData?.map(g => [g.id, g as GearStatusSupabaseRow]));

  return charactersData.map(c => {
    const rec = gearMap.get(c.id);
    const baseGear: Record<GearKey, boolean> = GEAR_KEYS_ORDERED.reduce((acc, key) => {
      acc[key] = rec?.gear?.[key] ?? false;
      return acc;
    }, {} as Record<GearKey, boolean>);

    return {
      id: c.id,
      fullName: c.fullName,
      optIn: rec?.optIn ?? false,
      gear: baseGear,
    };
  });
}

// Load hidden members hook
function useHiddenMembers() {
  const [hidden, setHidden] = useState<Set<number>>(new Set());
  useEffect(() => {
    const h = new Set(
      charactersData.filter(c => (c as { isHidden?: boolean }).isHidden).map(c => c.id)
    );
    setHidden(h);
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
  const [supabaseClient, setSupabaseClient] = useState<SupabaseClient | null>(null);
  const [clientInitializationError, setClientInitializationError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize client on mount (client-side)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      try {
        setSupabaseClient(createClient(supabaseUrl, supabaseAnonKey));
      } catch (error) {
        console.error("Error creating Supabase client:", error);
        setClientInitializationError("Supabaseクライアントの作成に失敗しました。");
      }
    } else {
      console.error("Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY) are not set.");
      setClientInitializationError("Supabase環境変数が設定されていません。");
    }
  }, []); // Empty dependency array ensures this runs once on mount

  const hiddenMembers = useHiddenMembers();
  const [gearData, setGearData] = useState<EnhancedGearStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true); // For data loading, distinct from client init
  const [showHidden, setShowHidden] = useState(false);
  const [showOptInOnly, setShowOptInOnly] = useState(false);
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!supabaseClient) {
        // Don't attempt to load data if client isn't initialized or failed to initialize.
        // If there was no client init error, set isLoading to false as there's nothing to load.
        if (!clientInitializationError) setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const data = await fetchAndMergeData(supabaseClient);
        setGearData(data);
      } catch (error) {
        console.error("Error loading gear data:", error);
        // Optionally, set an error state here to show in UI
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [supabaseClient, clientInitializationError]); // Depend on supabaseClient and its init error status

  // Debounced save to Supabase
  const scheduleSave = useCallback((dataToSave: EnhancedGearStatus[]) => {
    if (!supabaseClient) {
      console.error("Supabase client not initialized. Cannot save.");
      alert('保存クライアントが初期化されていません。');
      return;
    }

    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(async () => {
      setIsSaving(true);
      const recordsToUpsert = dataToSave.map(member => ({
        id: member.id,
        optIn: member.optIn,
        gear: member.gear,
      }));

      try {
        const { error } = await supabaseClient
          .from('gear_status')
          .upsert(recordsToUpsert, { onConflict: 'id' });
        if (error) throw error;
      } catch (e) {
        console.error('Failed to save gear status:', e);
        alert('保存に失敗しました');
      } finally {
        setIsSaving(false);
      }
    }, 1000);
  }, [supabaseClient]); // Depend on supabaseClient

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
  const gearKeys = GEAR_KEYS_ORDERED;

  if (clientInitializationError) {
    return <div className="p-6 text-red-500">{clientInitializationError}</div>;
  }

  if (!supabaseClient || isLoading) { // Show loading if client is not yet set or data is loading
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
              const char = charactersData.find(c => c.id === member.id);
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
