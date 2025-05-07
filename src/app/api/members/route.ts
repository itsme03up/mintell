import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { members } = await request.json();
    
    // Get the path to the characters.json file
    const filePath = path.join(process.cwd(), 'src/data/characters.json');
    
    // Write the updated members data to the file
    await fs.writeFile(filePath, JSON.stringify(members, null, 2), 'utf8');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving member data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save member data' },
      { status: 500 }
    );
  }
}
