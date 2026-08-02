import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  // Bỏ qua nếu là đường dẫn tĩnh hoặc api
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const isAdminRoute = request.nextUrl.pathname.startsWith('/dashboard');
  const hasAuthCookie = request.cookies.has('admin_session');

  if (isAdminRoute && !hasAuthCookie) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
