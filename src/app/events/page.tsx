"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Calendar, Users, MapPin, Clock, AlertTriangle } from "lucide-react";
import { Member } from "@/lib/types";
import { useEvents, useMembers, useParties } from "@/lib/hooks/useSupabaseData";

// 型定義の改善
interface EventFormData {
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  location: string;
  max_participants: string;
  party_id: string;
}

interface DiscordSettings {
  webhookUrl: string;
  botToken: string;
  channelId: string;
}

interface ValidationError {
  field: string;
  message: string;
}

// 初期値の定数化
const INITIAL_FORM_DATA: EventFormData = {
  title: "",
  description: "",
  start_time: "",
  end_time: "",
  location: "",
  max_participants: "",
  party_id: "",
};

export default function EventsPage() {
  // Supabase hooks
  const { 
    events, 
    loading: eventsLoading, 
    error: eventsError, 
    createEvent, 
    deleteEvent: deleteEventFromDB 
  } = useEvents();
  
  const { 
    members: hookMembers, 
    loading: membersLoading, 
    error: membersError 
  } = useMembers();
  
  const { 
    parties: hookParties, 
    loading: partiesLoading, 
    error: partiesError 
  } = useParties();

  // UI State
  const [showModal, setShowModal] = useState(false);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  
  // Form State
  const [formData, setFormData] = useState<EventFormData>(INITIAL_FORM_DATA);
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);

  // Discord settings (from environment variables)
  const discordSettings: DiscordSettings = useMemo(() => ({
    webhookUrl: process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL || '',
    botToken: process.env.NEXT_PUBLIC_DISCORD_BOT_TOKEN || '',
    channelId: process.env.NEXT_PUBLIC_DISCORD_CHANNEL_ID || ''
  }), []);

  // Available members calculation (memoized)
  const availableMembers = useMemo(() => {
    return hookMembers.filter(member => 
      !selectedMembers.some(selected => selected.id === member.id)
    );
  }, [hookMembers, selectedMembers]);

  // Loading state
  const isLoading = eventsLoading || membersLoading || partiesLoading;

  // Error state
  const hasError = eventsError || membersError || partiesError;

  // Form validation
  const validateForm = useCallback((): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (!formData.title.trim()) {
      errors.push({ field: 'title', message: 'タイトルは必須です' });
    }

    if (!formData.start_time) {
      errors.push({ field: 'start_time', message: '開始日時は必須です' });
    }

    if (formData.end_time && formData.start_time) {
      const startDate = new Date(formData.start_time);
      const endDate = new Date(formData.end_time);
      if (endDate <= startDate) {
        errors.push({ field: 'end_time', message: '終了日時は開始日時より後に設定してください' });
      }
    }

    if (formData.max_participants && parseInt(formData.max_participants) < 1) {
      errors.push({ field: 'max_participants', message: '最大参加者数は1以上で入力してください' });
    }

    return errors;
  }, [formData]);

  // Form handlers
  const updateFormField = useCallback((field: keyof EventFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation errors for this field
    setValidationErrors(prev => prev.filter(error => error.field !== field));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setSelectedMembers([]);
    setValidationErrors([]);
  }, []);

  // Member selection handlers
  const toggleMemberSelection = useCallback((member: Member) => {
    setSelectedMembers(prev => {
      const isSelected = prev.some(m => m.id === member.id);
      if (isSelected) {
        return prev.filter(m => m.id !== member.id);
      } else {
        return [...prev, member];
      }
    });
  }, []);

  const selectParty = useCallback((partyIdStr: string) => {
    updateFormField('party_id', partyIdStr);
    
    if (partyIdStr) {
      const partyId = parseInt(partyIdStr, 10);
      const party = hookParties.find(p => p.id === partyId);
      
      if (party?.party_members) {
        const partyMembersList = party.party_members
          .map((pm: { members: any; }) => pm.members)
          .filter(Boolean) as Member[];
        setSelectedMembers(partyMembersList);
      }
    } else {
      setSelectedMembers([]);
    }
  }, [hookParties, updateFormField]);

  // Event handlers
  const handleDateClick = useCallback((info: { dateStr: string }) => {
    updateFormField('start_time', info.dateStr);
    setShowModal(true);
  }, [updateFormField]);

  const handleCreateEvent = useCallback(async () => {
    const errors = validateForm();
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsCreatingEvent(true);
    
    try {
      // Create event via Supabase hook
      await createEvent(formData, selectedMembers);
      
      // Open Google Calendar
      const startDate = new Date(formData.start_time);
      const endDate = formData.end_time 
        ? new Date(formData.end_time) 
        : new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
      
      const formatGCalDate = (date: Date) => 
        date.toISOString().replace(/[-:.]/g, "").split(".")[0] + "Z";
      
      const gcalUrl = new URL("https://calendar.google.com/calendar/render");
      gcalUrl.searchParams.set("action", "TEMPLATE");
      gcalUrl.searchParams.set("text", formData.title);
      gcalUrl.searchParams.set("dates", `${formatGCalDate(startDate)}/${formatGCalDate(endDate)}`);
      gcalUrl.searchParams.set("details", `参加メンバー：${selectedMembers.map(m => m.fullName).join(", ")}`);
      
      window.open(gcalUrl.toString(), "_blank");
      
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error creating event:', error);
      setValidationErrors([{
        field: 'general',
        message: 'イベントの作成に失敗しました。もう一度お試しください。'
      }]);
    } finally {
      setIsCreatingEvent(false);
    }
  }, [formData, selectedMembers, validateForm, createEvent, resetForm]);

  const handleDeleteEvent = useCallback(async (eventId: string) => {
    if (!confirm('このイベントを削除しますか？')) return;
    
    try {
      await deleteEventFromDB(eventId);
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('イベントの削除に失敗しました');
    }
  }, [deleteEventFromDB]);

  const handleModalClose = useCallback((isOpen: boolean) => {
    setShowModal(isOpen);
    if (!isOpen) {
      resetForm();
    }
  }, [resetForm]);

  // FullCalendar events data (memoized)
  const calendarEvents = useMemo(() => {
    return events.map(event => ({
      id: event.id,
      title: event.title,
      start: event.start_time,
      end: event.end_time,
      backgroundColor: event.party_id ? '#10b981' : '#3b82f6',
      borderColor: event.party_id ? '#059669' : '#2563eb',
    }));
  }, [events]);

  // Error display component
  const ErrorAlert = ({ error }: { error: string }) => (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );

  // Loading component
  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-4 text-lg">データを読み込み中...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-semibold text-gray-800">
          Mintell イベント管理
        </h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            イベント数: {events.length}件
          </span>
          <Button 
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Calendar className="h-4 w-4 mr-2" />
            新規イベント作成
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {hasError && (
        <ErrorAlert error="データの読み込みに失敗しました。ページを再読み込みしてください。" />
      )}

      {/* Calendar */}
      <Card className="p-6 bg-white shadow-lg rounded-lg">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={calendarEvents}
          dateClick={handleDateClick}
          eventContent={(eventInfo) => (
            <div className="flex items-center justify-between w-full bg-white hover:bg-gray-100 rounded p-2 transition-colors">
              <span 
                className="truncate font-medium text-gray-700" 
                title={eventInfo.event.title}
              >
                {eventInfo.event.title}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 p-1 h-auto text-red-500 hover:bg-red-100 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteEvent(eventInfo.event.id);
                }}
              >
                削除
              </Button>
            </div>
          )}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek'
          }}
          locale="ja"
          height="auto"
        />
      </Card>

      {/* Event Creation Modal */}
      <Dialog open={showModal} onOpenChange={handleModalClose}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <h2 className="text-2xl font-bold">新規イベント作成</h2>
          </DialogHeader>
          
          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error.message}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side: Event Information */}
            <div className="space-y-6">
              <div>
                <Label htmlFor="title">タイトル *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => updateFormField('title', e.target.value)}
                  placeholder="例: チーム定例ミーティング"
                  className={validationErrors.some(e => e.field === 'title') ? 'border-red-500' : ''}
                />
              </div>

              <div>
                <Label htmlFor="description">説明</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => updateFormField('description', e.target.value)}
                  placeholder="イベントの詳細を入力してください..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_time">
                    <Clock className="h-4 w-4 inline mr-1" />
                    開始日時 *
                  </Label>
                  <Input
                    id="start_time"
                    type="datetime-local"
                    value={formData.start_time}
                    onChange={(e) => updateFormField('start_time', e.target.value)}
                    className={validationErrors.some(e => e.field === 'start_time') ? 'border-red-500' : ''}
                  />
                </div>
                <div>
                  <Label htmlFor="end_time">
                    <Clock className="h-4 w-4 inline mr-1" />
                    終了日時
                  </Label>
                  <Input
                    id="end_time"
                    type="datetime-local"
                    value={formData.end_time}
                    onChange={(e) => updateFormField('end_time', e.target.value)}
                    className={validationErrors.some(e => e.field === 'end_time') ? 'border-red-500' : ''}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  場所
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => updateFormField('location', e.target.value)}
                  placeholder="例: 会議室A, オンライン, etc..."
                />
              </div>

              <div>
                <Label htmlFor="max_participants">
                  <Users className="h-4 w-4 inline mr-1" />
                  最大参加者数
                </Label>
                <Input
                  id="max_participants"
                  type="number"
                  min="1"
                  value={formData.max_participants}
                  onChange={(e) => updateFormField('max_participants', e.target.value)}
                  placeholder="制限なしの場合は空白"
                  className={validationErrors.some(e => e.field === 'max_participants') ? 'border-red-500' : ''}
                />
              </div>

              <div>
                <Label>パーティ選択</Label>
                <Select value={formData.party_id} onValueChange={selectParty}>
                  <SelectTrigger>
                    <SelectValue placeholder="選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">なし</SelectItem>
                    {hookParties.map((party) => (
                      <SelectItem key={party.id} value={party.id.toString()}>
                        {party.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Discord Settings Status */}
              <Card className="p-4 bg-gray-50">
                <h4 className="font-medium mb-3">Discord通知設定</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${discordSettings.webhookUrl ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span>Webhook URL: {discordSettings.webhookUrl ? '設定済み' : '未設定'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${discordSettings.botToken ? 'bg-green-500' : 'bg-yellow-500'}`} />
                    <span>Bot Token: {discordSettings.botToken ? '設定済み' : '未設定'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${discordSettings.channelId ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <span>Channel ID: {discordSettings.channelId ? '設定済み' : '未設定'}</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Side: Member Selection */}
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold mb-4">参加メンバー選択</h4>
                
                {/* Available Members */}
                <div className="mb-6">
                  <Label className="text-sm font-medium mb-2 block">利用可能メンバー</Label>
                  <div className="max-h-48 overflow-y-auto border rounded-lg p-3 bg-gray-50">
                    {availableMembers.length === 0 ? (
                      <p className="text-gray-500 text-sm">利用可能なメンバーがいません</p>
                    ) : (
                      <div className="space-y-2">
                        {availableMembers.map((member) => (
                          <button
                            key={member.id}
                            onClick={() => toggleMemberSelection(member)}
                            className="w-full text-left p-2 border rounded hover:bg-blue-50 hover:border-blue-300 transition-colors"
                          >
                            <span className="text-sm font-medium">{member.fullName}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Selected Members */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    選択中のメンバー ({selectedMembers.length}名)
                  </Label>
                  <div className="max-h-48 overflow-y-auto border rounded-lg p-3 bg-green-50">
                    {selectedMembers.length === 0 ? (
                      <p className="text-gray-500 text-sm">メンバーが選択されていません</p>
                    ) : (
                      <div className="space-y-2">
                        {selectedMembers.map((member) => (
                          <button
                            key={member.id}
                            onClick={() => toggleMemberSelection(member)}
                            className="w-full text-left p-2 border rounded bg-green-100 hover:bg-green-200 border-green-300 transition-colors"
                          >
                            <span className="text-sm font-medium">{member.fullName}</span>
                            <span className="text-xs text-green-600 ml-2">✓</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-8">
            <Button
              variant="outline"
              onClick={() => handleModalClose(false)}
              disabled={isCreatingEvent}
            >
              キャンセル
            </Button>
            <Button
              onClick={handleCreateEvent}
              disabled={isCreatingEvent}
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
            >
              {isCreatingEvent ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  作成中...
                </>
              ) : (
                <>
                  <Calendar className="h-4 w-4 mr-2" />
                  イベント作成 & Discord通知
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}