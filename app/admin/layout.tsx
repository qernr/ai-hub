'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Brain, LayoutDashboard, Wrench, Tag, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

const adminNavLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/tools', label: 'Tools', icon: Wrench },
  { href: '/admin/categories', label: 'Categories', icon: Tag },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 border-r bg-white flex flex-col">
        <div className="flex items-center gap-2 font-bold text-lg px-6 py-5 border-b">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-violet-600 to-indigo-600 text-white">
            <Brain className="h-4 w-4" />
          </div>
          <span className="text-gray-900">Admin</span>
        </div>
        <nav className="flex flex-col gap-1 p-3 flex-1">
          {adminNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href))
                  ? 'bg-violet-50 text-violet-700'
                  : 'text-gray-600 hover:bg-violet-50 hover:text-violet-700'
              }`}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t">
          <form action="/api/auth/logout" method="POST">
            <Button
              variant="ghost"
              size="sm"
              className="w-full gap-2 justify-start text-gray-600"
              type="submit"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <main className="p-8">{children}</main>
      </div>
    </div>
  )
}
