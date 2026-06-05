import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length).trim() + '…'
}

export function pricingLabel(type: string): string {
  const labels: Record<string, string> = {
    FREE: 'Free',
    FREEMIUM: 'Freemium',
    PAID: 'Paid',
  }
  return labels[type] ?? type
}

export function pricingColor(type: string): string {
  const colors: Record<string, string> = {
    FREE: 'bg-emerald-100 text-emerald-700',
    FREEMIUM: 'bg-blue-100 text-blue-700',
    PAID: 'bg-orange-100 text-orange-700',
  }
  return colors[type] ?? 'bg-gray-100 text-gray-700'
}

export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return 'http://localhost:3000'
}
