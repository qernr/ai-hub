import type { Category, Tool, ToolCategory, PricingType } from '@prisma/client'

export type { PricingType }

export type ToolWithCategories = Tool & {
  categories: (ToolCategory & { category: Category })[]
}

export type CategoryWithCount = Category & {
  _count: { tools: number }
}

export type SearchParams = {
  q?: string
  category?: string
  pricing?: string
  page?: string
}

export type PaginatedResult<T> = {
  items: T[]
  total: number
  page: number
  perPage: number
  totalPages: number
}

export type AdminToolFormData = {
  name: string
  slug: string
  logo: string
  websiteUrl: string
  description: string
  pricingType: PricingType
  pros: string[]
  cons: string[]
  alternatives: string[]
  usageInstructions: string
  featured: boolean
  categoryIds: string[]
}

export type AdminCategoryFormData = {
  name: string
  slug: string
  description: string
  icon: string
}
