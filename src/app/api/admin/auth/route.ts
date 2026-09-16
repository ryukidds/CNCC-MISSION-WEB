import { NextResponse } from 'next/server';
import { getDbData } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const data = await getDbData();
    const currentPassword = data?.adminPassword || process.env.ADMIN_PASSWORD || 'cncc1234';

    if (password === currentPassword) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, message: '비밀번호가 일치하지 않습니다.' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: '인증 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
