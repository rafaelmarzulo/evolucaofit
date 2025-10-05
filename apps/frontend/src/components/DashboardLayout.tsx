'use client'

import { useEffect, useState, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Logo from './Logo'

interface User {
  email: string
  full_name: string
  id: number
}

interface DashboardLayoutProps {
  children: ReactNode
  title: string
}

export default function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token')

      if (!token) {
        router.push('/auth/login')
        return
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Falha na autenticação')
        }

        const data = await response.json()
        setUser(data)
      } catch (error) {
        localStorage.removeItem('token')
        router.push('/auth/login')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/')
  }

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { href: '/measurements', label: 'Medidas', icon: '📊' },
    { href: '/workouts', label: 'Treinos', icon: '🏋️' },
    { href: '/nutrition', label: 'Nutrição', icon: '🥗' },
    { href: '/photos', label: 'Fotos', icon: '📸' },
    { href: '/goals', label: 'Metas', icon: '🎯' },
  ]

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-xl shadow-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Bar */}
          <div className="flex justify-between items-center py-4">
            <Logo size="sm" href="/dashboard" />

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-300 hidden sm:inline">
                Olá, <span className="font-semibold text-white">{user.full_name}</span>
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 text-sm text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
              >
                Sair
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex gap-1 overflow-x-auto pb-px -mb-px scrollbar-hide">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <button
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  className={`
                    flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap
                    border-b-2 transition-colors
                    ${isActive
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600'
                    }
                  `}
                >
                  <span>{item.icon}</span>
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </header>

      {/* Page Title */}
      <div className="bg-gray-900/50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">{title}</h1>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
