import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data, error } = await (await supabase)
    .from('blog_comments')
    .select('*')
    .eq('post_id', params.id)
    .order('created_at', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { content, commenter_name } = await req.json();
  const supabase = createClient();

  const { data, error } = await (await supabase)
    .from('blog_comments')
    .insert([{ post_id: params.id, content, commenter_name }])
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data[0]);
}
