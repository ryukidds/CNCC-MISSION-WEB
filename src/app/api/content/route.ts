import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'src/data/cncc_db.json');

function getDbData() {
  try {
    const fileContent = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading database file:', error);
    return null;
  }
}

function saveDbData(data: any) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing to database file:', error);
    return false;
  }
}

export async function GET() {
  const data = getDbData();
  if (!data) {
    return NextResponse.json({ error: 'Failed to read database' }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const currentData = getDbData();
    
    if (!currentData) {
      return NextResponse.json({ error: 'Failed to read database' }, { status: 500 });
    }

    // Update keys dynamically (slides, branches, history, events, articles, etc.)
    const updatedData = {
      ...currentData,
      ...body,
    };

    const success = saveDbData(updatedData);
    if (!success) {
      return NextResponse.json({ error: 'Failed to save database' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: updatedData });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 });
  }
}
