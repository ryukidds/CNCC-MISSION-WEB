import { NextResponse } from 'next/server';
import { getDbData, saveDbData } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { currentPassword, newPassword } = await request.json();

    if (!newPassword || typeof newPassword !== 'string' || newPassword.trim().length < 4) {
      return NextResponse.json(
        { success: false, message: '새 비밀번호는 최소 4자리 이상이어야 합니다.' },
        { status: 400 }
      );
    }

    const data = await getDbData();
    const existingPassword = data?.adminPassword || process.env.ADMIN_PASSWORD || 'cncc1234';

    if (currentPassword !== existingPassword) {
      return NextResponse.json(
        { success: false, message: '현재 비밀번호가 일치하지 않습니다.' },
        { status: 401 }
      );
    }

    const updatedData = {
      ...(data || {}),
      adminPassword: newPassword.trim(),
    };

    const saved = await saveDbData(updatedData);
    if (!saved) {
      return NextResponse.json(
        { success: false, message: '데이터베이스 저장에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '비밀번호가 성공적으로 변경되었습니다.',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: '비밀번호 변경 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
