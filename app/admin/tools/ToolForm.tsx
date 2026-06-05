'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PlusCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { slugify } from '@/lib/utils'
import type { Category } from '@prisma/client'
import type { ToolWithCategories } from '@/types'

interface ToolFormProps {
  tool?: ToolWithCategories
  categories: Category[]
}

export function ToolForm({ tool, categories }: ToolFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const isEdit = !!tool

  const [loading, setLoading] = useState(false)
  const [name, setName] = useState(tool?.name ?? '')
  const [slug, setSlug] = useState(tool?.slug ?? '')
  const [logo, setLogo] = useState(tool?.logo ?? '')
  const [websiteUrl, setWebsiteUrl] = useState(tool?.websiteUrl ?? '')
  const [description, setDescription] = useState(tool?.description ?? '')
  const [pricingType, setPricingType] = useState<string>(tool?.pricingType ?? 'FREEMIUM')
  const [featured, setFeatured] = useState(tool?.featured ?? false)
  const [usageInstructions, setUsageInstructions] = useState(tool?.usageInstructions ?? '')
  const [pros, setPros] = useState<string[]>(tool?.pros ?? [''])
  const [cons, setCons] = useState<string[]>(tool?.cons ?? [''])
  const [alternatives, setAlternatives] = useState<string[]>(tool?.alternatives ?? [''])
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    tool?.categories.map((c) => c.categoryId) ?? []
  )

  const handleNameChange = (val: string) => {
    setName(val)
    if (!isEdit) setSlug(slugify(val))
  }

  const updateArrayItem = (
    arr: string[],
    setter: (v: string[]) => void,
    idx: number,
    val: string
  ) => {
    const updated = [...arr]
    updated[idx] = val
    setter(updated)
  }

  const addArrayItem = (arr: string[], setter: (v: string[]) => void) =>
    setter([...arr, ''])

  const removeArrayItem = (arr: string[], setter: (v: string[]) => void, idx: number) =>
    setter(arr.filter((_, i) => i !== idx))

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const body = {
      name,
      slug,
      logo,
      websiteUrl,
      description,
      pricingType,
      featured,
      usageInstructions,
      pros: pros.filter(Boolean),
      cons: cons.filter(Boolean),
      alternatives: alternatives.filter(Boolean),
      categoryIds: selectedCategories,
    }

    const res = await fetch(isEdit ? `/api/tools/${tool.id}` : '/api/tools', {
      method: isEdit ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    setLoading(false)

    if (res.ok) {
      toast({ title: `Tool ${isEdit ? 'updated' : 'created'} successfully` })
      router.push('/admin/tools')
      router.refresh()
    } else {
      const err = await res.json().catch(() => ({}))
      toast({ title: err.error ?? 'Something went wrong', variant: 'destructive' })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Tool Name *</Label>
          <Input id="name" value={name} onChange={(e) => handleNameChange(e.target.value)} required placeholder="e.g., ChatGPT" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="slug">Slug *</Label>
          <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required placeholder="e.g., chatgpt" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="websiteUrl">Website URL *</Label>
          <Input id="websiteUrl" type="url" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} required placeholder="https://..." />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="logo">Logo URL</Label>
          <Input id="logo" type="url" value={logo} onChange={(e) => setLogo(e.target.value)} placeholder="https://logo.clearbit.com/example.com" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description *</Label>
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={3} placeholder="Describe the tool..." />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Pricing Type</Label>
          <Select value={pricingType} onValueChange={setPricingType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FREE">Free</SelectItem>
              <SelectItem value="FREEMIUM">Freemium</SelectItem>
              <SelectItem value="PAID">Paid</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5 flex flex-col">
          <Label>Featured</Label>
          <label className="flex items-center gap-2 cursor-pointer mt-2">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 accent-sky-500"
            />
            <span className="text-sm text-gray-700">Mark as featured tool</span>
          </label>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-1.5">
        <Label>Categories</Label>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => toggleCategory(cat.id)}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                selectedCategories.includes(cat.id)
                  ? 'bg-sky-500 text-white border-sky-500'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-sky-400'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Pros */}
      <div className="space-y-1.5">
        <Label>Pros</Label>
        <div className="space-y-2">
          {pros.map((pro, i) => (
            <div key={i} className="flex gap-2">
              <Input value={pro} onChange={(e) => updateArrayItem(pros, setPros, i, e.target.value)} placeholder="A benefit..." />
              <Button type="button" variant="ghost" size="icon" onClick={() => removeArrayItem(pros, setPros, i)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => addArrayItem(pros, setPros)}>
            <PlusCircle className="h-4 w-4" /> Add Pro
          </Button>
        </div>
      </div>

      {/* Cons */}
      <div className="space-y-1.5">
        <Label>Cons</Label>
        <div className="space-y-2">
          {cons.map((con, i) => (
            <div key={i} className="flex gap-2">
              <Input value={con} onChange={(e) => updateArrayItem(cons, setCons, i, e.target.value)} placeholder="A drawback..." />
              <Button type="button" variant="ghost" size="icon" onClick={() => removeArrayItem(cons, setCons, i)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => addArrayItem(cons, setCons)}>
            <PlusCircle className="h-4 w-4" /> Add Con
          </Button>
        </div>
      </div>

      {/* Alternatives */}
      <div className="space-y-1.5">
        <Label>Alternative Tool Slugs</Label>
        <div className="space-y-2">
          {alternatives.map((alt, i) => (
            <div key={i} className="flex gap-2">
              <Input value={alt} onChange={(e) => updateArrayItem(alternatives, setAlternatives, i, e.target.value)} placeholder="tool-slug" />
              <Button type="button" variant="ghost" size="icon" onClick={() => removeArrayItem(alternatives, setAlternatives, i)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => addArrayItem(alternatives, setAlternatives)}>
            <PlusCircle className="h-4 w-4" /> Add Alternative
          </Button>
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="space-y-1.5">
        <Label htmlFor="usage">Usage Instructions</Label>
        <Textarea id="usage" value={usageInstructions} onChange={(e) => setUsageInstructions(e.target.value)} rows={3} placeholder="How to get started with this tool..." />
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600"
        >
          {loading ? 'Saving...' : isEdit ? 'Update Tool' : 'Create Tool'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
