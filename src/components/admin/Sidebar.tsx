'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const navItems = [
  { name: 'Dashboard', path: '/admin', icon: '📊' },
  { name: 'Leads', path: '/admin/leads', icon: '🎯' },
  { name: 'Proyectos', path: '/admin/projects', icon: '🚀' },
  { name: 'Servicios', path: '/admin/services', icon: '🛠' },
  { name: 'Productos', path: '/admin/products', icon: '📦' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-zinc-900/40 backdrop-blur-md border-r border-zinc-800/80 hidden md:flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-zinc-800/80">
        <Image src="/logo-vyper-blanco.webp" alt="Vyper Solutions" width={120} height={40} />
      </div>
      
      <nav className="flex-1 py-6 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.path || (item.path !== '/admin' && pathname.startsWith(item.path))
          return (
            <Link 
              key={item.path} 
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(37,99,235,0.1)]' 
                  : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          )
        })}
      </nav>
      
      <div className="p-4">
      </div>
    </aside>
  )
}
