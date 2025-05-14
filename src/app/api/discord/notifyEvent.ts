import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL!;

export async function POST(request: Request) {
  const { event_id } = await request.json();

  if (!event_id) {
    return NextResponse.json({ message: 'event_id is required' }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', event_id)
    .single();

  if (error || !event) {
    return NextResponse.json({ message: 'Event not found', error: error?.message }, { status: 404 });
  }

  const message = {
    content: `📅 **新しいイベントが作成されました！**\n` +
             `**${event.title}**\n` +
             `🕒 ${new Date(event.start_time).toLocaleString('ja-JP')}\n` +
             `参加するか選んでね！`,
  };

  const res = await fetch(DISCORD_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message),
  });

  if (!res.ok) {
    const error = await res.text();
    console.error('Discord webhook failed:', error);
    return NextResponse.json({ message: 'Failed to notify Discord', error }, { status: 500 });
  }

  return NextResponse.json({ message: 'Discord notified' });
}

