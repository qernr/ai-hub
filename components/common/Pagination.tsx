'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PaginationProps {
  totalPages: number
  currentPage: number
}

export function Pagination({ totalPages, currentPage }: PaginationProps) {
  const searchParams = useSearchParams()

  if (totalPages <= 1) return null

  const buildUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(page))
    return `/search?${params.toString()}`
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2
  )

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      <Link href={buildUrl(currentPage - 1)} aria-disabled={currentPage <= 1}>
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9"
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </Link>

      {pages.map((page, idx) => {
        const prev = pages[idx - 1]
        return (
          <span key={page} className="flex items-center gap-1">
            {prev && page - prev > 1 && (
              <span className="px-2 text-gray-400">…</span>
            )}
            <Link href={buildUrl(page)}>
              <Button
                variant={page === currentPage ? 'default' : 'outline'}
                size="icon"
                className={cn(
                  'h-9 w-9',
                  page === currentPage && 'bg-gradient-to-r from-sky-500 to-cyan-500 border-0'
                )}
              >
                {page}
              </Button>
            </Link>
          </span>
        )
      })}

      <Link href={buildUrl(currentPage + 1)} aria-disabled={currentPage >= totalPages}>
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9"
          disabled={currentPage >= totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  )
}
