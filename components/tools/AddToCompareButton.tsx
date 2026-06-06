'use client'

import { GitCompare, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCompare, type CompareItem, MAX_COMPARE } from '@/hooks/useCompare'
import { useTranslations } from 'next-intl'

interface Props {
  tool: CompareItem
}

export function AddToCompareButton({ tool }: Props) {
  const t = useTranslations('tool')
  const { addTool, removeTool, isAdded, items } = useCompare()
  const added = isAdded(tool.slug)
  const full = !added && items.length >= MAX_COMPARE

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={full}
      className={
        added
          ? 'gap-2 border-sky-400 text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/30 hover:bg-sky-100 dark:hover:bg-sky-950/50'
          : 'gap-2'
      }
      onClick={() => (added ? removeTool(tool.slug) : addTool(tool))}
    >
      {added ? <Check className="h-4 w-4" /> : <GitCompare className="h-4 w-4" />}
      {added ? t('removeFromCompare') : t('addToCompare')}
    </Button>
  )
}
