import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = await createClient();

    const { data } = await supabase
      .storage
      .from('mintell')
      .download('partybuilder.json');

    if (!data) {
      throw new Error('No data received');
    }

    const text = await data.text();
    const jsonData = JSON.parse(text);

    return NextResponse.json(jsonData);
  } catch (error) {
    console.error('Error reading party builder data:', error);
    return NextResponse.json(
      { error: 'メンバー情報の読み込みに失敗しました' },
      { status: 500 }
    );
  }
}

// POST /api/members — 変更されたメンバー一覧をJSONファイルに書き込む
export async function POST(request: Request) {
  try {
    const { partybuilder } = await request.json();

    const supabase = await createClient();

    const jsonData = JSON.stringify(partybuilder, null, 2);
    const { error } = await supabase
      .storage
      .from('mintell')
      .update('partybuilder.json', jsonData, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      throw new Error('Error on supabase upload');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving party builder data:', error);
    return NextResponse.json(
      { success: false, error: 'party builder情報の保存に失敗しました' },
      { status: 500 }
    );
  }
}
