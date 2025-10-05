'use client'

import { useState } from 'react'
import Link from 'next/link'
import Logo from './Logo'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-black/90 backdrop-blur-lg border-b border-gray-800 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="group">
            <Logo size="sm" href="/" className="group-hover:scale-105 transition-transform duration-300" />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/dashboard"
              className="text-gray-300 hover:text-white transition-colors font-medium relative group"
            >
              Dashboard
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/auth/login"
              className="text-gray-300 hover:text-white transition-colors font-medium relative group"
            >
              Entrar
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/auth/register"
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-500 hover:to-cyan-500 transform hover:scale-105 transition-all duration-200 shadow-lg shadow-blue-500/50"
            >
              Cadastrar
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-300 p-2 rounded-lg hover:bg-gray-800 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 animate-slide-down">
            <div className="flex flex-col space-y-3">
              <Link
                href="/dashboard"
                className="text-gray-300 hover:text-white transition-colors font-medium py-2 px-4 hover:bg-gray-800 rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/auth/login"
                className="text-gray-300 hover:text-white transition-colors font-medium py-2 px-4 hover:bg-gray-800 rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                Entrar
              </Link>
              <Link
                href="/auth/register"
                className="text-center px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-500 hover:to-cyan-500 transition-all shadow-lg shadow-blue-500/30"
                onClick={() => setIsOpen(false)}
              >
                Cadastrar
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
