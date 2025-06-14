import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  if (!request.cookies.get('token')) {
    return NextResponse.redirect(new URL('/login', request.url))
    // return NextResponse.redirect(request.nextUrl);
  }
}
 
export const config = {
  matcher: '/gallery/:path*',
}