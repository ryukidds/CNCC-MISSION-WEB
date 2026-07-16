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

export async function GET() {
  const data = getDbData();
  if (!data) {
    return NextResponse.json({ error: 'Failed to read database' }, { status: 500 });
  }
  return NextResponse.json(data);
}
