import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Middleware temporairement désactivé pour résoudre les problèmes de navigation
export function middleware() {
  // Pas d'intervention pour le moment
  return
}

export const config = {
  matcher: [],
} 