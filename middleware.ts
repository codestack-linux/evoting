// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 1. Ambil token/session dari cookies
  const session = request.cookies.get("admin_session")?.value;

  const { pathname } = request.nextUrl;

  // 2. Proteksi rute Admin
  // Jika mencoba akses dashboard tapi belum login
  if (pathname.startsWith("/dashboard") && !session) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }
  if (pathname.startsWith("/candidates") && !session) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }
  if (pathname.startsWith("/ringkasan") && !session) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Proteksi Halaman Login
  // Jika sudah login tapi iseng buka halaman login lagi
  if (pathname === "/login" && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// 4. Tentukan rute mana saja yang diproses oleh middleware ini
export const config = {
  matcher: [
    /*
     * Match semua request path kecuali:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
