"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { GearKey, GearStatus } from "@/lib/types";
import { calcNeededTiers } from "@/lib/calcEligibleLayer";
import charactersData from "@/data/characters.json";
import initialGearStatus from "@/data/gearStatus.json";
import TokenCalculatorPage from "./token-calculator";

// ジョブとそのロールの定義
interface JobRole {
  job: string;
  role: 'tank' | 'healer' | 'dps';
}

const jobRoles: JobRole[] = [
  // タンク - 青色
  { job: "PLD", role: "tank" },
  { job: "WAR", role: "tank" },
  { job: "DRK", role: "tank" },
  { job: "GNB", role: "tank" },
  // ヒーラー - 緑色
  { job: "WHM", role: "healer" },
  { job: "SCH", role: "healer" },
  { job: "AST", role: "healer" },
  { job: "SGE", role: "healer" },
  // DPS - 赤色
  { job: "MNK", role: "dps" },
  { job: "DRG", role: "dps" },
  { job: "NIN", role: "dps" },
  { job: "SAM", role: "dps" },
  { job: "RPR", role: "dps" },
  { job: "BRD", role: "dps" },
  { job: "MCH", role: "dps" },
  { job: "DNC", role: "dps" },
  { job: "BLM", role: "dps" },
  { job: "SMN", role: "dps" },
  { job: "RDM", role: "dps" },
];

// ジョブに基づいて適切な色のクラスを返す関数
const getJobColorClass = (job: string): string => {
  const jobRole = jobRoles.find(item => item.job === job);
  switch (jobRole?.role) {
    case 'tank': return 'text-blue-500';
    case 'healer': return 'text-green-500';
    case 'dps': return 'text-red-500';
    default: return '';
  }
};

const progressOptions = [
  "未設定", "新生", "蒼天", "紅蓮", "漆黒", "暁月", "黄金"
];

// Update GearStatus type to include optIn flag
interface EnhancedGearStatus extends GearStatus {
  optIn: boolean;
}

// Combine character data with gear status
const mergeData = (): EnhancedGearStatus[] => {
  // Create a map for quick lookup of gear status by ID
  const gearMap = new Map(initialGearStatus.map(item => [item.id, item]));
  
  return charactersData.map(character => {
    const existingData = gearMap.get(character.id);
    return {
      id: character.id,
      fullName: character.fullName,
      optIn: existingData?.optIn || false, // Initialize optIn flag
      gear: existingData?.gear || {
        weapon: false, head: false, body: false, hands: false,
        legs: false, feet: false, ear: false, neck: false,
        wrist: false, ring: false
      }
    };
  });
};

export default function GearPage() {
  const [gearData, setGearData] = useState<EnhancedGearStatus[]>(mergeData());
  const [showHidden, setShowHidden] = useState(false);
  const [showOptInOnly, setShowOptInOnly] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [hiddenMembers, setHiddenMembers] = useState<Set<number>>(new Set());
  
  // Load hidden members from characters data
  useEffect(() => {
    const hidden = new Set(
      charactersData
        .filter(c => c.isHidden)
        .map(c => c.id)
    );
    setHiddenMembers(hidden);
  }, []);

  // Function to save gear data to the server
  const saveGearData = async (updatedGear: EnhancedGearStatus[]) => {
    try {
      setSaving(true);
      const response = await fetch('/api/gear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gear: updatedGear }),
      });

      if (!response.ok) {
        throw new Error('Failed to save data');
      }
    } catch (error) {
      console.error('Error saving gear data:', error);
      alert('データの保存に失敗しました。');
    } finally {
      setSaving(false);
    }
  };

  const handleGearToggle = (memberId: number, gearKey: GearKey) => {
    const updatedGear = gearData.map(member =>
      member.id === memberId
        ? { ...member, gear: { ...member.gear, [gearKey]: !member.gear[gearKey] } }
        : member
    );
    
    setGearData(updatedGear);
    saveGearData(updatedGear);
  };

  // Handle opt-in status toggle
  const handleOptInToggle = (memberId: number) => {
    const updatedGear = gearData.map(member =>
      member.id === memberId
        ? { ...member, optIn: !member.optIn }
        : member
    );
    
    setGearData(updatedGear);
    saveGearData(updatedGear);
  };

  // Update filtering to consider both hidden status and opt-in status
  const visibleMembers = gearData.filter(member => 
    (showHidden || !hiddenMembers.has(member.id)) && 
    (!showOptInOnly || member.optIn)
  );
  
  // Get all gear keys for the table header
  const gearKeys = Object.keys(gearData[0]?.gear || {}) as GearKey[];

  return (
    <div className="space-y-6 p-6 pl-10">
      <h1 className="text-2xl font-bold text-primary">零式装備管理</h1>
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="show-hidden"
              checked={showHidden}
              onCheckedChange={(checked) => setShowHidden(checked as boolean)}
            />
            <Label htmlFor="show-hidden">非表示メンバーを表示</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="show-opt-in-only"
              checked={showOptInOnly}
              onCheckedChange={(checked) => setShowOptInOnly(checked as boolean)}
            />
            <Label htmlFor="show-opt-in-only">参加希望のみ表示</Label>
          </div>
        </div>
        <Card className="p-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>アバター</TableHead>
                <TableHead>名前</TableHead>
                <TableHead className="text-center">参加?</TableHead>
                {gearKeys.map(key => (
                  <TableHead key={key} className="text-center">{key}</TableHead>
                ))}
                <TableHead>必要な層</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleMembers.map((member) => {
                const neededTiers = calcNeededTiers(member.gear);
                const character = charactersData.find(c => c.id === member.id);
                
                return (
                  <TableRow key={member.id} className={member.optIn ? "" : "opacity-50"}>
                    <TableCell className="pl-4">
                      <Image
                        src={character?.avatarUrl || '/placeholder-avatar.png'}
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
                        onCheckedChange={() => handleOptInToggle(member.id)}
                        aria-label={`Toggle participation for ${member.fullName}`}
                      />
                    </TableCell>
                    {gearKeys.map(key => (
                      <TableCell key={key} className="text-center">
                        <Checkbox
                          checked={member.gear[key]}
                          onCheckedChange={() => handleGearToggle(member.id, key)}
                          aria-label={`Toggle ${key} for ${member.fullName}`}
                        />
                      </TableCell>
                    ))}
                    <TableCell>
                      {neededTiers.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {neededTiers.map(tier => (
                            <Badge key={tier} variant="outline" className="bg-amber-100 text-amber-800">
                              {tier}層
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
              })}
            </TableBody>
          </Table>
        </Card>
      </div>
      <TokenCalculatorPage />
    </div>
  );
}
