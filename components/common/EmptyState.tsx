import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface EmptyStateProps {
  title?: string
  description?: string
  action?: { label: string; href: string }
}

export function EmptyState({
  title = 'No tools found',
  description = 'Try adjusting your search or filters to find what you\'re looking for.',
  action = { label: 'Browse all tools', href: '/search' },
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 mb-4">
        <Search className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-sm">{description}</p>
      {action && (
        <Link href={action.href}>
          <Button variant="outline">{action.label}</Button>
        </Link>
      )}
    </div>
  )
}
