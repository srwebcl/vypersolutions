'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  // Prevenir scroll cuando el menú móvil está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const navLinks = [
    { name: 'Inicio', href: '/' },
    { name: 'Servicios', href: '/#servicios' },
    { name: 'Catálogo', href: '/#productos' },
    { name: 'Contacto', href: '/#contacto' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-zinc-950/90 backdrop-blur-md border-b border-zinc-900 neon-glow-vyper transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        
        {/* Columna 1: Logo */}
        <a href="/" className="flex items-center z-[60] shrink-0 h-full py-2" onClick={() => setIsOpen(false)}>
          <div className="relative h-12 w-36 md:h-14 md:w-44">
            <Image 
              src="/logo-vyper-original.webp" 
              alt="Vyper Solutions Logo" 
              fill
              className="object-contain object-left"
              priority
            />
          </div>
        </a>

        {/* Columna 2: Navegación de Escritorio */}
        <nav className="hidden md:flex items-center justify-center space-x-8 flex-1">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-sm font-medium text-zinc-300 hover:text-blue-500 transition-colors"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Columna 3: CTA de Escritorio */}
        <div className="hidden md:flex items-center justify-end shrink-0">
          <a 
            href="#contacto" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-all shadow-lg hover:neon-border-vyper"
          >
            Cotizar ahora
          </a>
        </div>

        {/* Botón Hamburguesa Móvil */}
        <button 
          className="md:hidden flex items-center justify-center z-[60] text-zinc-300 hover:text-white transition-colors focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {isOpen ? <X size={32} /> : <Menu size={32} />}
        </button>

      </div>

      {/* Menú Móvil a Pantalla Completa */}
      {isOpen && (
        <div className="fixed inset-0 bg-zinc-950 z-50 flex flex-col justify-center items-center space-y-8 animate-in fade-in duration-300 md:hidden">
          {/* El botón de cerrar ya está en el Header nativo gracias a z-[60], pero podemos agregar una X adicional absoluta si lo prefieres.
              En este diseño, el botón X que reemplaza a la hamburguesa hace el trabajo de cierre y se mantiene siempre visible y fijo. */}
          
          <div className="flex flex-col items-center justify-center w-full space-y-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-3xl font-bold tracking-wider text-zinc-300 hover:text-blue-500 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <a 
              href="#contacto" 
              className="mt-8 px-10 py-4 bg-blue-600 text-white font-semibold rounded-xl text-2xl transition-all shadow-lg shadow-blue-600/20"
              onClick={() => setIsOpen(false)}
            >
              Cotizar ahora
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
