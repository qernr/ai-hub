# CLAUDE.md

## Project Overview

Project Name: AI Hub

AI Hub is a modern directory and search platform for artificial intelligence tools and neural networks.

The goal is to help users quickly find the most suitable AI solution for a specific task through categories, filters, and intelligent search.

Examples:

* Find an AI for programming
* Find an AI for image generation
* Find an AI for document translation
* Find an AI for creating presentations
* Find a free alternative to ChatGPT

The website should be fast, SEO-friendly, mobile-friendly, and easy to maintain.

---

# Technology Stack

## Frontend

* Next.js 15 App Router
* React 19
* TypeScript
* Tailwind CSS
* shadcn/ui

## Backend

* Next.js Route Handlers
* Server Actions

## Database

* PostgreSQL
* Prisma ORM

## Deployment

* Vercel

---

# Architecture Rules

Always follow these rules:

### 1. Type Safety

* Enable strict TypeScript mode.
* Never use `any`.
* Prefer explicit typing.

### 2. Component Design

Create small reusable components.

Bad:

One component with 500+ lines.

Good:

* ToolCard
* CategoryCard
* SearchBar
* Header
* Footer
* Pagination
* ToolFilters

Each component should have a single responsibility.

### 3. Server Components First

Prefer Server Components whenever possible.

Use Client Components only when required for:

* State management
* User interactions
* Browser APIs

### 4. Database Access

All database access must go through Prisma.

Never write raw SQL unless absolutely necessary.

### 5. Error Handling

Every API route and Server Action must include:

* Validation
* Error handling
* Proper status responses

Never expose internal errors to users.

---

# Folder Structure

Use the following structure:

app/
├─ page.tsx
├─ tools/
├─ category/
├─ admin/
├─ api/

components/
├─ ui/
├─ layout/
├─ tools/
├─ categories/
├─ search/

lib/
├─ prisma.ts
├─ search.ts
├─ metadata.ts

actions/

hooks/

types/

prisma/
├─ schema.prisma
├─ seed.ts

public/
├─ logos/
├─ images/

---

# Database Rules

Use Prisma.

Main entities:

## Tool

* id
* name
* slug
* logo
* websiteUrl
* description
* pricingType
* pros
* cons
* usageInstructions
* createdAt
* updatedAt

## Category

* id
* name
* slug
* description

Many-to-many relation between Tool and Category.

---

# Search System

Search must support:

* Tool names
* Descriptions
* Categories

Search results should be ranked by relevance.

Implement:

* Text search
* Category filters
* Free/Paid filters

Search should remain fast even with thousands of tools.

---

# SEO Requirements

Every page must include:

* Metadata
* Open Graph tags
* Twitter cards
* Canonical URL

Generate:

* sitemap.xml
* robots.txt

Use SEO-friendly URLs.

Examples:

/tools/chatgpt

/tools/claude

/category/image-generation

/category/programming

---

# UI/UX Rules

Design goals:

* Modern SaaS appearance
* Fast loading
* Minimalistic
* Responsive
* Accessible

Support:

* Mobile
* Tablet
* Desktop

Use skeleton loaders where appropriate.

Provide empty states for:

* No search results
* Empty categories

---

# Admin Dashboard

Create a protected admin area.

Features:

* Add tool
* Edit tool
* Delete tool
* Add category
* Edit category
* Delete category

Authentication:

* Environment variable based admin password
* Middleware protection

No public user registration.

---

# Performance Rules

Always optimize for performance.

Requirements:

* Server-side rendering
* Static generation where possible
* Image optimization
* Lazy loading
* Metadata generation on server

Avoid unnecessary client-side JavaScript.

---

# Code Quality Rules

Always:

* Follow ESLint rules
* Use meaningful variable names
* Write readable code
* Avoid duplication
* Create reusable utilities
* Keep files focused

Prefer maintainability over clever solutions.

---

# Seed Data

Generate at least 30 AI tools.

Include:

* ChatGPT
* Claude
* Gemini
* Perplexity
* Midjourney
* DALL-E
* Flux
* Stable Diffusion
* Runway
* Suno
* ElevenLabs
* DeepL
* Cursor
* GitHub Copilot

and other popular AI products.

---

# Donation Page

Create a Support page.

Features:

* DonationAlerts button
* Project information
* Why donations help maintain the project

No intrusive monetization.

---

# Final Goal

Build a production-ready AI tool discovery platform that is:

* Fast
* SEO optimized
* Easy to maintain
* Scalable
* Modern
* User friendly

All code must be written as if it will be deployed to production.
