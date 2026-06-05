import { createHash } from 'crypto'
import { cookies } from 'next/headers'

const SESSION_COOKIE = 'admin_session'
const SESSION_DURATION = 60 * 60 * 24 * 7 // 7 days in seconds

function buildSessionToken(password: string): string {
  const secret = process.env.SESSION_SECRET ?? 'fallback-secret-change-in-prod'
  return createHash('sha256').update(`${password}:${secret}`).digest('hex')
}

export function getExpectedToken(): string {
  const password = process.env.ADMIN_PASSWORD ?? 'admin123'
  return buildSessionToken(password)
}

export async function createSession(password: string): Promise<boolean> {
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'admin123'
  if (password !== adminPassword) return false

  const token = buildSessionToken(password)
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION,
    path: '/',
  })
  return true
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return false
  return token === getExpectedToken()
}

export function isAuthenticatedFromHeader(cookieHeader: string | null): boolean {
  if (!cookieHeader) return false
  const match = cookieHeader.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`))
  if (!match) return false
  return match[1] === getExpectedToken()
}
