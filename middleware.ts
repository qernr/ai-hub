import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const SESSION_COOKIE = 'admin_session'

async function computeToken(): Promise<string> {
  const password = process.env.ADMIN_PASSWORD ?? 'admin123'
  const secret = process.env.SESSION_SECRET ?? 'fallback-secret-change-in-prod'
  const data = new TextEncoder().encode(`${password}:${secret}`)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

const intlMiddleware = createIntlMiddleware(routing)

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Admin auth — handled before intl
  if (pathname.startsWith('/admin')) {
    if (pathname !== '/admin/login') {
      const token = request.cookies.get(SESSION_COOKIE)?.value
      const expected = await computeToken()
      if (!token || token !== expected) {
        const loginUrl = new URL('/admin/login', request.url)
        loginUrl.searchParams.set('from', pathname)
        return NextResponse.redirect(loginUrl)
      }
    }
    return NextResponse.next()
  }

  // API routes — no intl
  if (pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  // Public routes — locale routing
  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*).*)'],
}
