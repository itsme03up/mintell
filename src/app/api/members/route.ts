import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// GET /api/members — 現在のメンバー一覧をJSONで返す
export async function GET() {
  const filePath = path.join(process.cwd(), 'src/data/characters.json');
  try {
    const json = await fs.readFile(filePath, 'utf8');
    const members = JSON.parse(json);
    return NextResponse.json(members);
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
    const filePath = path.join(process.cwd(), 'src/data/characters.json');
    await fs.writeFile(filePath, JSON.stringify(members, null, 2), 'utf8');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving member data:', error);
    return NextResponse.json(
      { success: false, error: 'メンバー情報の保存に失敗しました' },
      { status: 500 }
    );
  }
}
