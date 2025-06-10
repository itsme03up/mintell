import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { createClient } from '@/lib/supabase';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'src/data/partybuilder.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const jsonData = JSON.parse(fileContents);

    return NextResponse.json(jsonData);
  } catch (error) {
    console.error('Error reading party builder data:', error);
    return NextResponse.json(
      { error: 'パーティビルダー情報の読み込みに失敗しました' },
      { status: 500 }
    );
  }
}

// POST /api/partybuilder — 変更されたパーティ一覧をJSONファイルに書き込む
export async function POST(request: Request) {
  try {
    const { parties } = await request.json();

    const supabase = await createClient();

    const jsonData = JSON.stringify(parties, null, 2);
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
      { success: false, error: 'パーティビルダー情報の保存に失敗しました' },
      { status: 500 }
    );
  }
}
