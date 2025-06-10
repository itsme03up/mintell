import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'src/data/characters.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const jsonData = JSON.parse(fileContents);

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

    const supabase = await createClient();

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
