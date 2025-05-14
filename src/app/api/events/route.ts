import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

interface Event {
  title: string;
  start: Date | string;
  allDay: boolean;
  id: number; // Should be primary key in Supabase, consider bigint if using Date.now()
  color?: string;
  isBirthday?: boolean;
  memberId?: number;
  partyMembers?: number[]; // In Supabase, this could be an array type (e.g., integer[]) or jsonb
  partyId?: number;
  time?: string;
}

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('events')
    .select('*');

  if (error) {
    console.error('Error fetching events from Supabase:', error);
    return NextResponse.json({ message: 'Error fetching events', error: error.message }, { status: 500 });
  }

  return NextResponse.json(data as Event[]);
}

export async function POST(request: Request) {
  try {
    const events: Event[] = await request.json();
    
    // Ensure `id` is the conflict target for upsert
    // This assumes your 'events' table has 'id' as its primary key or a unique constraint
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('events')
      .upsert(events, { onConflict: 'id' });

    if (error) {
      console.error('Error upserting events to Supabase:', error);
      // Check for specific errors, e.g., related to partyMembers array format if not handled correctly
      return NextResponse.json({ message: 'Error saving events', error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Events saved successfully', data }, { status: 200 });
  } catch (error) {
    console.error('Error processing POST request:', error);
    return NextResponse.json({ message: 'Error saving events', error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Event ID is required' }, { status: 400 });
    }

    const eventId = parseInt(id, 10);
    if (isNaN(eventId)) {
      return NextResponse.json({ message: 'Invalid Event ID format' }, { status: 400 });
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);

    if (error) {
      console.error('Error deleting event from Supabase:', error);
      return NextResponse.json({ message: 'Error deleting event', error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Event deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error processing DELETE request:', error);
    return NextResponse.json({ message: 'Error deleting event', error: (error as Error).message }, { status: 500 });
  }
}
