"use client";

import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Member } from "@/lib/types";

interface Event {
  id: string;
  title: string;
  start: string;
  end?: string;
  description?: string;
  location?: string;
  maxParticipants?: number;
  partyId?: number;
}

interface Party {
  id: string;
  name: string;
  members?: number[];
}

interface Participant {
  userId: string;
  username: string;
  status: 'attending' | 'not-attending' | 'maybe';
}

interface DiscordSettings {
  webhookUrl: string;
  botToken: string; // Consider security implications if this remains client-side
  channelId?: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [newEventEndDate, setNewEventEndDate] = useState("");
  const [newEventDescription, setNewEventDescription] = useState("");
  const [newEventLocation, setNewEventLocation] = useState("");
  const [newEventMaxParticipants, setNewEventMaxParticipants] = useState<number | undefined>(undefined);
  const [selectedPartyId, setSelectedPartyId] = useState<string | undefined>(undefined);
  const [characters, setCharacters] = useState<Member[]>([]);
  const [availableMembers, setAvailableMembers] = useState<Member[]>([]);
  const [eventMembers, setEventMembers] = useState<Member[]>([]);
  const [parties, setParties] = useState<Party[]>([]);
  
  // Discord関連のstate
  const [discordSettings, setDiscordSettings] = useState<DiscordSettings>({
    webhookUrl: process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL || '',
    botToken: process.env.NEXT_PUBLIC_DISCORD_BOT_TOKEN || '', // WARNING: Exposing bot token client-side is risky
    channelId: process.env.NEXT_PUBLIC_DISCORD_CHANNEL_ID || ''
  });
  const [participants, setParticipants] = useState<Map<string, Participant[]>>(new Map());
  // const [showDiscordSettings, setShowDiscordSettings] = useState(false); // Removed
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);

  // バリデーション関数
  const isValidWebhookUrl = (url: string): boolean => {
    const webhookPattern = /^https:\/\/discord\.com\/api\/webhooks\/\d+\/[\w-]+$/;
    return webhookPattern.test(url);
  };

  const initParties = async () => {
    const response = await fetch('/api/partybuilder');
    if (!response.ok) {
      throw new Error('Failed to fetch members data');
    }

    const data = await response.json();

    setParties(data);
  }

  const initMembers = async () => {
    try {
      const response = await fetch('/api/members');
      if (!response.ok) {
        throw new Error('Failed to fetch members data');
      }

      const membersData: Member[] = await response.json();

      setCharacters(membersData);
      setAvailableMembers(membersData);
    } catch (error) {
      console.error('Error fetching members:', error);
      alert('メンバーの取得に失敗しました。');
    }
  }

  useEffect(() => {
    initParties();
    initMembers();
    // loadDiscordSettings(); // Removed: Settings now come from .env
  }, []);

  // Discord設定を読み込み // Removed
  // const loadDiscordSettings = () => { ... };

  // Discord設定を保存 // Removed
  // const saveDiscordSettings = (settings: DiscordSettings) => { ... };

  const resetNewEventForm = () => {
    setNewEventTitle("");
    setNewEventDate("");
    setNewEventEndDate("");
    setNewEventDescription("");
    setNewEventLocation("");
    setNewEventMaxParticipants(undefined);
    setSelectedPartyId(undefined);
    setEventMembers([]); // Reset event members
    setAvailableMembers(characters); // Reset available members
  };

  const handleDateClick = (info: { dateStr: string }) => {
    setNewEventDate(info.dateStr);
    setShowModal(true);
  };

  const handleAddEvent = async () => {
    if (!newEventTitle || !newEventDate) return;

    // Check if essential Discord settings are available from .env
    if (!discordSettings.webhookUrl) {
      alert("Discord Webhook URLが環境変数に設定されていません。通知は送信できません。");
      // Optionally, you might want to prevent event creation or proceed without Discord functionality
    }
    // Add a similar check for botToken if addDiscordReactions is critical and stays client-side
    // if (!discordSettings.botToken) {
    //   alert("Discord Bot Tokenが環境変数に設定されていません。リアクションは追加できません。");
    // }


    setIsCreatingEvent(true);

    try {
      const startDate = new Date(newEventDate);
      const endDate = newEventEndDate ? new Date(newEventEndDate) : new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

      const newEvent: Event = {
        id: Date.now().toString(),
        title: newEventTitle,
        start: newEventDate,
        end: newEventEndDate || undefined,
        description: newEventDescription || undefined,
        location: newEventLocation || undefined,
        maxParticipants: newEventMaxParticipants || undefined,
        partyId: selectedPartyId ? parseInt(selectedPartyId, 10) : undefined,
      };

      setEvents((prev) => [...prev, newEvent]);

      // Discord通知を送信
      const sendDiscordNotification = async (event: Event, startDate: Date, endDate: Date): Promise<string | null> => {
        const embed = {
          title: "📅 " + event.title,
          description: event.description || "新しいイベントが作成されました！",
          color: 0x4285f4,
          fields: [
            {
              name: "🕐 開始時間",
              value: startDate.toLocaleString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                weekday: 'short'
              }),
              inline: true
            },
            {
              name: "🕐 終了時間", 
              value: endDate.toLocaleString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                weekday: 'short'
              }),
              inline: true
            }
          ],
          footer: {
            text: "下のリアクションで参加可否をお知らせください！"
          },
          timestamp: new Date().toISOString()
        };

        if (event.location) {
          embed.fields.push({
            name: "📍 場所",
            value: event.location,
            inline: true
          });
        }

        if (event.maxParticipants) {
          embed.fields.push({
            name: "👥 最大参加者数",
            value: event.maxParticipants + "名",
            inline: true
          });
        }

        // 参加メンバーがいる場合
        if (eventMembers.length > 0) {
          embed.fields.push({
            name: "👨‍👩‍👧‍👦 参加予定メンバー",
            value: eventMembers.map(m => m.fullName).join(", "),
            inline: false
          });
        }

        const payload = {
          content: "🎉 **新しいイベントのお知らせ** 🎉",
          embeds: [embed],
          wait: true
        };

        try {
          const response = await fetch(discordSettings.webhookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
          });

          if (!response.ok) {
            throw new Error(`Discord API Error: ${response.status} ${response.statusText}`);
          }

          const result = await response.json();
          return result.id;
        } catch (error) {
          console.error('Error sending Discord notification:', error);
          throw error;
        }
      };

      const addDiscordReactions = async (messageId: string): Promise<void> => {
        const reactions = ['✅', '❌', '❓'];
        // Use NEXT_PUBLIC_DISCORD_CHANNEL_ID for targetChannelId if available, otherwise try to extract (though extraction is unreliable)
        const targetChannelId = discordSettings.channelId || extractChannelIdFromWebhook(discordSettings.webhookUrl);
        
        if (!discordSettings.botToken) {
          console.warn('Bot Token is not configured. Skipping adding reactions.');
          alert('Bot Tokenが設定されていないため、リアクションは追加されません。');
          return;
        }
        
        if (!targetChannelId) {
          console.warn('Channel ID not available for adding reactions');
          return;
        }

        for (const reaction of reactions) {
          try {
            const response = await fetch(`https://discord.com/api/v10/channels/${targetChannelId}/messages/${messageId}/reactions/${encodeURIComponent(reaction)}/@me`, {
              method: 'PUT',
              headers: {
                'Authorization': `Bot ${discordSettings.botToken}`,
                'Content-Type': 'application/json'
              }
            });

            if (!response.ok) {
              console.error(`Failed to add reaction ${reaction}:`, response.status, response.statusText);
            }
            
            // APIレート制限を避けるため少し待機
            await new Promise(resolve => setTimeout(resolve, 500));
          } catch (error) {
            console.error(`Error adding reaction ${reaction}:`, error);
          }
        }
      };

      // WebhookURLからチャンネルIDを抽出（制限あり）
      const extractChannelIdFromWebhook = (webhookUrl: string): string | null => {
        // Webhook URLから直接チャンネルIDを取得することはできないため、
        // ユーザーにチャンネルIDの入力を促す必要があります
        return null;
      };

      const messageId = await sendDiscordNotification(newEvent, startDate, endDate);
      if (messageId) {
        await addDiscordReactions(messageId);
        // 参加者監視を開始（実際の実装では適切なイベントリスナーを設定）
        console.log(`Discord notification sent for event: ${newEvent.title}`);
      }

      setShowModal(false);

      // Googleカレンダー連携
      const formatGCalDate = (date: Date) =>
        date.toISOString().replace(/[-:.]/g, "").split(".")[0] + "Z";

      const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(newEventTitle)}&dates=${formatGCalDate(startDate)}/${formatGCalDate(endDate)}&details=${encodeURIComponent("参加メンバー：" + eventMembers.map(m => m.fullName).join(", "))}`;

      window.open(gcalUrl, "_blank");
      resetNewEventForm();
    } catch (error) {
      console.error('Error creating event:', error);
      alert('イベントの作成に失敗しました。');
    } finally {
      setIsCreatingEvent(false);
    }
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents((prevEvents) => prevEvents.filter(event => event.id !== eventId));
  };

  const handleDragStart = (e: React.DragEvent, memberId: number) => {
    e.dataTransfer.setData("memberId", memberId.toString());
  };

  const handleDrop = (e: React.DragEvent, target: "available" | "event") => {
    e.preventDefault();
    const memberId = parseInt(e.dataTransfer.getData("memberId"), 10);
    if (isNaN(memberId)) return;

    if (target === "event") {
      const member = availableMembers.find((m) => m.id === memberId);
      if (member) {
        setEventMembers((prev) => [...prev, member]);
        setAvailableMembers((prev) => prev.filter((m) => m.id !== memberId));
      }
    } else if (target === "available") {
      const member = eventMembers.find((m) => m.id === memberId);
      if (member) {
        setAvailableMembers((prev) => [...prev, member]);
        setEventMembers((prev) => prev.filter((m) => m.id !== memberId));
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handlePartySelect = (partyIdStr: string) => {
    setSelectedPartyId(partyIdStr);

    const party = parties.find((p) => p.id === partyIdStr);
    if (party) {
      const membersInParty = characters.filter((c) => party.members?.includes(c.id));
      const remainingAvailable = characters.filter((c) => !party.members?.includes(c.id));
      setEventMembers(membersInParty);
      setAvailableMembers(remainingAvailable);
    } else {
      // If partyIdStr is undefined or party not found, reset members
      setEventMembers([]);
      setAvailableMembers(characters);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Mintell イベント管理</h1>
        {/* Button to open Discord settings dialog removed */}
      </div>
      
      <Card className="p-4">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          dateClick={handleDateClick}
          eventContent={(eventInfo) => (
            <div className="flex items-center justify-between w-full">
              <span className="truncate" title={eventInfo.event.title}>{eventInfo.event.title}</span>
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 p-1 h-auto text-xs text-red-500 hover:bg-red-100"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent eventClick if we were using it
                  handleDeleteEvent(eventInfo.event.id);
                }}
              >
                削除
              </Button>
            </div>
          )}
        />
      </Card>

      <Dialog open={showModal} onOpenChange={(isOpen) => {
        setShowModal(isOpen);
        if (!isOpen) {
          resetNewEventForm(); // Reset form fields when dialog is closed
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>新規イベント作成</DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 左側: イベント基本情報 */}
            <div className="space-y-4">
              <div>
                <Label>タイトル *</Label>
                <Input 
                  value={newEventTitle} 
                  onChange={(e) => setNewEventTitle(e.target.value)} 
                  placeholder="例: チーム定例ミーティング"
                />
              </div>
              
              <div>
                <Label>説明</Label>
                <Textarea 
                  value={newEventDescription} 
                  onChange={(e) => setNewEventDescription(e.target.value)}
                  placeholder="イベントの詳細を入力してください..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>開始日時 *</Label>
                  <Input 
                    type="datetime-local" 
                    value={newEventDate} 
                    onChange={(e) => setNewEventDate(e.target.value)} 
                  />
                </div>
                <div>
                  <Label>終了日時</Label>
                  <Input 
                    type="datetime-local" 
                    value={newEventEndDate} 
                    onChange={(e) => setNewEventEndDate(e.target.value)} 
                  />
                </div>
              </div>

              <div>
                <Label>場所</Label>
                <Input 
                  value={newEventLocation} 
                  onChange={(e) => setNewEventLocation(e.target.value)}
                  placeholder="例: 会議室A, オンライン, etc..."
                />
              </div>

              <div>
                <Label>最大参加者数</Label>
                <Input 
                  type="number" 
                  min="1"
                  value={newEventMaxParticipants || ''} 
                  onChange={(e) => setNewEventMaxParticipants(e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="制限なしの場合は空白"
                />
              </div>

              <div>
                <Label>パーティ選択</Label>
                <Select value={selectedPartyId} onValueChange={handlePartySelect}>
                  <SelectTrigger><SelectValue placeholder="選択してください" /></SelectTrigger>
                  <SelectContent>
                    {parties.map((p) => (
                      <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Discord設定状況 */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium mb-2">Discord通知設定 (環境変数から読込)</div>
                <div className="text-xs text-gray-600">
                  {discordSettings.webhookUrl ? (
                    <span className="text-green-600">✅ Webhook URL: 設定済み</span>
                  ) : (
                    <span className="text-orange-600">⚠️ Webhook URL: 未設定 (NEXT_PUBLIC_DISCORD_WEBHOOK_URL)</span>
                  )}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {discordSettings.botToken ? (
                    <span className="text-green-600">✅ Bot Token: 設定済み (セキュリティ注意)</span>
                  ) : (
                    <span className="text-orange-600">⚠️ Bot Token: 未設定 (NEXT_PUBLIC_DISCORD_BOT_TOKEN)</span>
                  )}
                </div>
                 <div className="text-xs text-gray-600 mt-1">
                  {discordSettings.channelId ? (
                    <span className="text-green-600">✅ Channel ID: 設定済み</span>
                  ) : (
                    <span className="text-gray-500">ℹ️ Channel ID: 未設定 (NEXT_PUBLIC_DISCORD_CHANNEL_ID)</span>
                  )}
                </div>
              </div>
            </div>

            {/* 右側: メンバー選択 */}
            <div>
              <div className="grid grid-cols-2 gap-4 h-full">
                <div
                  onDrop={(e) => handleDrop(e, "available")}
                  onDragOver={handleDragOver}
                  className="border p-2 rounded bg-gray-50 min-h-[200px]"
                >
                  <h3 className="font-semibold mb-2">全メンバー</h3>
                  <div className="max-h-40 overflow-y-auto">
                    {availableMembers.map((m) => (
                      <div
                        key={m.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, m.id)}
                        className="p-1 border rounded my-1 bg-white cursor-move text-sm"
                      >
                        {m.fullName}
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  onDrop={(e) => handleDrop(e, "event")}
                  onDragOver={handleDragOver}
                  className="border p-2 rounded bg-green-50 min-h-[200px]"
                >
                  <h3 className="font-semibold mb-2">イベント参加者</h3>
                  <div className="max-h-40 overflow-y-auto">
                    {eventMembers.map((m) => (
                      <div
                        key={m.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, m.id)}
                        className="p-1 border rounded my-1 bg-green-100 cursor-move text-sm"
                      >
                        {m.fullName}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowModal(false);
              resetNewEventForm();
            }}>
              キャンセル
            </Button>
            <Button 
              onClick={handleAddEvent} 
              disabled={isCreatingEvent}
              className="flex items-center gap-2"
            >
              {isCreatingEvent ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  作成中...
                </>
              ) : (
                'イベント作成 & Discord通知'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Discord設定ダイアログ Removed */}
      {/* <Dialog open={showDiscordSettings} onOpenChange={setShowDiscordSettings}> ... </Dialog> */}
    </div>
  );
}
