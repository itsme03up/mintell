"use client";

import { useState } from "react";
import charactersData from "@/data/characters.json";
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
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Member {
  id: number;
  fullName: string;
  server: string;
  dataCenter: string;
  group: string;
  metric: number;
  avatarUrl: string;
  lastLoginDate: string | null;
  isHidden?: boolean;
  mainJob: string;
  progress: string;
}

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

const initialMembers: Member[] = charactersData.map(character => ({
  ...character,
  lastLoginDate: character.lastLoginDate === undefined ? null : character.lastLoginDate,
  isHidden: character.isHidden || false,
  mainJob: (character as Member).mainJob || "",
  progress: (character as Member).progress || "",
}));

export default function MembersPage() {
  const [memberList, setMemberList] = useState<Member[]>(initialMembers);
  const [showHidden, setShowHidden] = useState(false);
  const [isSaving, setSaving] = useState(false);

  // Function to save member data to the server
  const saveMemberData = async (updatedMembers: Member[]) => {
    try {
      setSaving(true);
      const response = await fetch('/api/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ members: updatedMembers }),
      });

      if (!response.ok) {
        throw new Error('Failed to save data');
      }
    } catch (error) {
      console.error('Error saving member data:', error);
      alert('データの保存に失敗しました。');
    } finally {
      setSaving(false);
    }
  };

  const handleHideInactive = () => {
    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
    fifteenDaysAgo.setHours(0, 0, 0, 0);

    const updatedMembers = memberList.map(member => {
      let newIsHidden = member.isHidden || false;
      if (!newIsHidden && member.lastLoginDate) {
        const lastLogin = new Date(member.lastLoginDate);
        if (lastLogin < fifteenDaysAgo) {
          newIsHidden = true;
        }
      }
      return { ...member, isHidden: newIsHidden };
    });

    setMemberList(updatedMembers);
    saveMemberData(updatedMembers);
  };

  const handleToggleMemberHidden = (memberId: number, checked: boolean) => {
    const updatedMembers = memberList.map(member =>
      member.id === memberId ? { ...member, isHidden: checked } : member
    );
    
    setMemberList(updatedMembers);
    saveMemberData(updatedMembers);
  };

  const handleMainJobChange = (memberId: number, newJob: string) => {
    const updatedMembers = memberList.map(member =>
      member.id === memberId ? { ...member, mainJob: newJob } : member
    );
    
    setMemberList(updatedMembers);
    saveMemberData(updatedMembers);
  };

  const handleProgressChange = (memberId: number, newProgress: string) => {
    const updatedMembers = memberList.map(member =>
      member.id === memberId ? { ...member, progress: newProgress } : member
    );
    
    setMemberList(updatedMembers);
    saveMemberData(updatedMembers);
  };

  const visibleMembers = memberList.filter(member => showHidden || !member.isHidden);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">FCメンバー一覧</h1>
      <div className="flex items-center space-x-4">
        <Button onClick={handleHideInactive} disabled={isSaving}>
          {isSaving ? "保存中..." : "長期未ログインメンバーを非表示"}
        </Button>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="show-hidden"
            checked={showHidden}
            onCheckedChange={(checked) => setShowHidden(checked as boolean)}
          />
          <Label htmlFor="show-hidden">非表示メンバーを表示</Label>
        </div>
      </div>
      <Card className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>アバター</TableHead>
              <TableHead>名前</TableHead>
              <TableHead>メインジョブ</TableHead>
              <TableHead>進度</TableHead>
              <TableHead>非表示</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="pl-4">
                  <Image
                    src={member.avatarUrl}
                    alt={member.fullName}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                </TableCell>
                <TableCell>{member.fullName}</TableCell>
                <TableCell>
                  <Select
                    value={member.mainJob}
                    onValueChange={(value) => handleMainJobChange(member.id, value)}
                  >
                    <SelectTrigger className="w-[120px]">
                      {member.mainJob ? (
                        <span className={getJobColorClass(member.mainJob)}>
                          {member.mainJob}
                        </span>
                      ) : (
                        <SelectValue placeholder="ジョブ選択" />
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      {jobRoles.map(({ job, role }) => {
                        const colorClass = 
                          role === 'tank' ? 'text-blue-500' : 
                          role === 'healer' ? 'text-green-500' : 
                          'text-red-500';
                        
                        return (
                          <SelectItem key={job} value={job}>
                            <span className={colorClass}>{job}</span>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select
                    value={member.progress}
                    onValueChange={(value) => handleProgressChange(member.id, value)}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="進度選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {progressOptions.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={!!member.isHidden}
                    onCheckedChange={(checked) => handleToggleMemberHidden(member.id, checked as boolean)}
                    aria-label={`Toggle hide for ${member.fullName}`}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
