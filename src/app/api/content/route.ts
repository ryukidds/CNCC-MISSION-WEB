import { NextResponse } from 'next/server';
import { getDbData, saveDbData } from '@/lib/db';

export async function GET() {
  const data = await getDbData();
  if (!data) {
    return NextResponse.json({ error: 'Failed to read database' }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const currentData = await getDbData();

    if (!currentData) {
      return NextResponse.json({ error: 'Failed to read database' }, { status: 500 });
    }

    const updatedData = {
      ...currentData,
      ...body,
    };

    const success = await saveDbData(updatedData);
    if (!success) {
      return NextResponse.json({ error: 'Failed to save database' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: updatedData });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 });
  }
}
