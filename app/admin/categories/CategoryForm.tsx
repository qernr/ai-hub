'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { slugify } from '@/lib/utils'
import type { Category } from '@prisma/client'

interface CategoryFormProps {
  category?: Category
}

export function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const isEdit = !!category

  const [loading, setLoading] = useState(false)
  const [name, setName] = useState(category?.name ?? '')
  const [slug, setSlug] = useState(category?.slug ?? '')
  const [description, setDescription] = useState(category?.description ?? '')
  const [icon, setIcon] = useState(category?.icon ?? '')

  const handleNameChange = (val: string) => {
    setName(val)
    if (!isEdit) setSlug(slugify(val))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const body = { name, slug, description, icon }

    const res = await fetch(
      isEdit ? `/api/categories/${category.id}` : '/api/categories',
      {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    )

    setLoading(false)

    if (res.ok) {
      toast({ title: `Category ${isEdit ? 'updated' : 'created'} successfully` })
      router.push('/admin/categories')
      router.refresh()
    } else {
      const err = await res.json().catch(() => ({}))
      toast({ title: err.error ?? 'Something went wrong', variant: 'destructive' })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
      <div className="space-y-1.5">
        <Label htmlFor="name">Category Name *</Label>
        <Input id="name" value={name} onChange={(e) => handleNameChange(e.target.value)} required placeholder="e.g., Image Generation" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="slug">Slug *</Label>
        <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required placeholder="e.g., image-generation" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="icon">Icon (emoji)</Label>
        <Input id="icon" value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="e.g., 🎨" maxLength={4} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Describe this category..." />
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600"
        >
          {loading ? 'Saving...' : isEdit ? 'Update Category' : 'Create Category'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
