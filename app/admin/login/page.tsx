import { Suspense } from 'react'
import { Brain } from 'lucide-react'
import { LoginContent } from './LoginContent'

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white mx-auto mb-3">
            <Brain className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
          <p className="text-gray-500 text-sm mt-1">AI Hub Dashboard</p>
        </div>

        <div className="bg-white border rounded-xl shadow-sm p-6">
          <Suspense fallback={null}>
            <LoginContent />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
