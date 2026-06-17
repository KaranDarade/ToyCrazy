import { NextRequest, NextResponse } from 'next/server';

const ADMIN_PASSWORD = 'Karan@123';
const COOKIE_NAME = 'toycraze_admin';

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });

  response.cookies.set(COOKIE_NAME, 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8,
    path: '/admin',
  });

  return response;
}

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get(COOKIE_NAME);

  if (cookie?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/admin',
  });
  return response;
}
