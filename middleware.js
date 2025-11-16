import { NextResponse } from 'next/server';

export function middleware(req) {
  const url = req.nextUrl.clone();
  const visited = req.cookies.get('visited');

  console.log('🟦 Middleware Triggered');
  console.log('🟩 Requested URL:', url.pathname);
  console.log('🟨 Cookie visited:', visited);

  // ログ表示用ヘッダー
  const res = NextResponse.next();
  res.headers.set('x-debug-path', url.pathname);
  res.headers.set('x-debug-visited', visited ? 'true' : 'false');

  // 初回アクセス時は geography へ
  if (!visited && url.pathname === '/') {
    console.log('🔴 Redirecting to /geography (first visit)');
    const redirectRes = NextResponse.redirect(new URL('/geography', req.url));
    redirectRes.cookies.set('visited', 'true', { path: '/', maxAge: 86400 });
    return redirectRes;
  }

  return res;
}

export const config = {
  matcher: '/',
};
