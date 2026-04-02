import { NextRequest, NextResponse } from 'next/server';

const PASSWORD = 'auleon2026';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  if (token === PASSWORD) return NextResponse.next();

  const { pathname } = request.nextUrl;
  if (pathname === '/login') return NextResponse.next();

  return NextResponse.redirect(new URL('/login', request.url));
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|geo|api).*)'],
};
