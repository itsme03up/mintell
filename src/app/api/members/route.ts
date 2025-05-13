import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://bdmvozylkioolebbgcor.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkbXZvenlsa2lvb2xlYmJnY29yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMTQ3ODUsImV4cCI6MjA2MjY5MDc4NX0.cDK40708Nl9OwQ7BmaMlW2-x3sS6hAD5o2Kfny_04SM');

// GET /api/members — 現在のメンバー一覧をJSONで返す
export async function GET() {
  try {
    const { data } = await supabase
      .storage
      .from('mintell')
      .download('characters.json');

    if (!data) {
      throw new Error('No data received');
    }

    const text = await data.text();
    const jsonData = JSON.parse(text);

    return NextResponse.json(jsonData);
  } catch (error) {
    console.error('Error reading members data:', error);
    return NextResponse.json(
      { error: 'メンバー情報の読み込みに失敗しました' },
      { status: 500 }
    );
  }
}

// POST /api/members — 変更されたメンバー一覧をJSONファイルに書き込む
export async function POST(request: Request) {
  try {
    const { members } = await request.json();

    const jsonData = JSON.stringify(members, null, 2);

    const { error } = await supabase
      .storage
      .from('mintell')
      .update('characters.json', jsonData, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      throw new Error('Error on supabase upload');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving member data:', error);
    return NextResponse.json(
      { success: false, error: 'メンバー情報の保存に失敗しました' },
      { status: 500 }
    );
  }
}
