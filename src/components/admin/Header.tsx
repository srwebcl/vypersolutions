'use client'

import React from 'react'

export default function Header({ user }: { user: any }) {
  return (
    <header className="h-16 flex items-center justify-between px-6 bg-zinc-900/20 backdrop-blur-sm border-b border-zinc-800/50 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        {/* Mobile menu button could go here */}
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-zinc-200">{user?.email}</p>
          <p className="text-xs text-zinc-500">Administrador</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 p-[2px]">
          <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center text-sm font-bold text-zinc-300">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  )
}
