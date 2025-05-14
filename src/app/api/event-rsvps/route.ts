import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

interface RSVP {
  id?: string;
  event_id: string;
  member_id: number;
  status: 'going' | 'maybe' | 'declined';
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get('event_id');

  if (!eventId) {
    return NextResponse.json({ message: 'event_id is required' }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('event_rsvps')
    .select('*')
    .eq('event_id', eventId);

  if (error) {
    console.error('Error fetching RSVPs:', error);
    return NextResponse.json({ message: 'Error fetching RSVPs', error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const rsvp: RSVP = await request.json();

    if (!rsvp.event_id || !rsvp.member_id || !rsvp.status) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('event_rsvps')
      .upsert([rsvp], { onConflict: 'event_id, member_id' });

    if (error) {
      console.error('Error saving RSVP:', error);
      return NextResponse.json({ message: 'Error saving RSVP', error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'RSVP saved', data }, { status: 200 });
  } catch (error) {
    console.error('Error processing POST:', error);
    return NextResponse.json({ message: 'Error saving RSVP', error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('event_id');
    const memberId = searchParams.get('member_id');

    if (!eventId || !memberId) {
      return NextResponse.json({ message: 'event_id and member_id are required' }, { status: 400 });
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from('event_rsvps')
      .delete()
      .eq('event_id', eventId)
      .eq('member_id', parseInt(memberId, 10));

    if (error) {
      console.error('Error deleting RSVP:', error);
      return NextResponse.json({ message: 'Error deleting RSVP', error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'RSVP deleted' }, { status: 200 });
  } catch (error) {
    console.error('Error processing DELETE:', error);
    return NextResponse.json({ message: 'Error deleting RSVP', error: (error as Error).message }, { status: 500 });
  }
}
