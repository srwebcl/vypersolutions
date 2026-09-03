'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { adminLogin } from '@/actions/adminLogin'

export default function LoginForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    
    // We are calling the Server Action here
    const result = await adminLogin(null, formData)
    
    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    } else if (result?.success) {
      router.push('/admin')
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-900/50 border border-red-500/50 text-red-200 rounded-lg text-sm text-center">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-zinc-400 mb-2">
          Correo Electrónico
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 text-zinc-100 placeholder-zinc-600 transition-all"
          placeholder="admin@vypersolutions.cl"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-zinc-400 mb-2">
          Contraseña
        </label>
        <input
          type="password"
          id="password"
          name="password"
          required
          className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 text-zinc-100 placeholder-zinc-600 transition-all"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full relative group overflow-hidden rounded-xl p-[1px]"
      >
        <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-xl opacity-70 group-hover:opacity-100 transition-opacity duration-300"></span>
        <div className="relative px-6 py-3 bg-zinc-950 rounded-xl flex items-center justify-center">
          <span className="text-zinc-100 font-semibold text-sm group-hover:text-white transition-colors">
            {isLoading ? 'Autenticando...' : 'Ingresar al Sistema'}
          </span>
        </div>
      </button>
    </form>
  )
}
