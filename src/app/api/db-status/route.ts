import { NextResponse } from 'next/server';
import { checkDbConnection } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const status = await checkDbConnection();
  return NextResponse.json(status);
}
