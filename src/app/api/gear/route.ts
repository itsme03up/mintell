import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = await createClient();

    const { data } = await supabase
      .storage
      .from('mintell')
      .download('gearStatus.json');

    if (!data) {
      throw new Error('No data received');
    }

    const text = await data.text();
    const jsonData = JSON.parse(text);

    return NextResponse.json(jsonData);
  } catch (error) {
    console.error('Error reading gear status data:', error);
    return NextResponse.json(
      { error: 'ギアー情報の読み込みに失敗しました' },
      { status: 500 }
    );
  }
}

// POST /api/members — 変更されたギアー一覧をJSONファイルに書き込む
export async function POST(request: Request) {
  try {
    const { gearStatus } = await request.json();

    const supabase = await createClient();

    const jsonData = JSON.stringify(gearStatus, null, 2);
    const { error } = await supabase
      .storage
      .from('mintell')
      .update('gearStatus.json', jsonData, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      throw new Error('Error on supabase upload');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving gear status data:', error);
    return NextResponse.json(
      { success: false, error: 'ギアー情報の保存に失敗しました' },
      { status: 500 }
    );
  }
}
