import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Define the path to the calender.json file
const dataFilePath = path.join(process.cwd(), 'src', 'data', 'calender.json');

interface Event {
  title: string;
  start: Date | string;
  allDay: boolean;
  id: number;
  color?: string;
  isBirthday?: boolean;
  memberId?: number;
  partyMembers?: number[];
  time?: string;
}

async function readEvents(): Promise<Event[]> {
  try {
    const jsonData = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(jsonData) as Event[];
  } catch (error) {
    // If the file doesn't exist or is invalid JSON, return an empty array
    console.error('Error reading events file:', error);
    return [];
  }
}

async function writeEvents(events: Event[]): Promise<void> {
  try {
    const jsonData = JSON.stringify(events, null, 2);
    await fs.writeFile(dataFilePath, jsonData, 'utf-8');
  } catch (error) {
    console.error('Error writing events file:', error);
    throw error; // Re-throw to indicate failure
  }
}

export async function GET() {
  const events = await readEvents();
  return NextResponse.json(events);
}

export async function POST(request: Request) {
  try {
    const events: Event[] = await request.json();
    await writeEvents(events);
    return NextResponse.json({ message: 'Events saved successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error saving events', error: (error as Error).message }, { status: 500 });
  }
}
