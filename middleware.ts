import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Middleware temporairement désactivé
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
} 