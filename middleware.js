import { NextResponse } from 'next/server';

export function middleware(req) {
  const visited = req.cookies.get('visited'); // クッキーを取得

  // ✅ クッキーがなければ初回アクセスとみなす
  if (!visited) {
    const res = NextResponse.redirect(new URL('/geography', req.url));
    // クッキーをセット（以降のアクセスではリダイレクトしない）
    res.cookies.set('visited', 'true', { path: '/', maxAge: 60 * 60 * 24 }); // 1日有効
    return res;
  }

  // 2回目以降のアクセスはそのままページを表示
  return NextResponse.next();
}

// このミドルウェアをどのURLに適用するか指定
export const config = {
  matcher: '/', // ルート（/）だけ
};
