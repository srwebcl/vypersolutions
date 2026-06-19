'use client'

import React from 'react'
import { Users, Wrench, Package } from 'lucide-react'

// Payload v3 pasa configuraciones completas como props, no tipamos explícitamente para simplificar el Client Component
export default function VyperDashboard() {
  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto font-sans">
      <div className="mb-12 border-b border-zinc-800 pb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 text-white">
          Bienvenido a <span className="text-blue-500">Vyper OS</span>
        </h1>
        <p className="text-xl text-zinc-400">
          Panel de control centralizado para gestión de catálogo y leads.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Tarjeta 1: Productos */}
        <a 
          href="/admin/collections/products/create" 
          className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl hover:border-blue-500 hover:-translate-y-1 hover:bg-zinc-800/80 transition-all duration-300 group shadow-lg"
        >
          <div className="w-14 h-14 bg-blue-600/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-blue-500/20">
            <Package className="text-blue-500" size={28} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Añadir Carro de Arrastre</h2>
          <p className="text-zinc-400 leading-relaxed">
            Publica un nuevo producto en tu catálogo público con galería de imágenes y especificaciones técnicas.
          </p>
        </a>

        {/* Tarjeta 2: Leads */}
        <a 
          href="/admin/collections/leads" 
          className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl hover:border-amber-500 hover:-translate-y-1 hover:bg-zinc-800/80 transition-all duration-300 group shadow-lg"
        >
          <div className="w-14 h-14 bg-amber-600/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-amber-500/20">
            <Users className="text-amber-500" size={28} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Ver Leads Recientes</h2>
          <p className="text-zinc-400 leading-relaxed">
            Revisa los clientes potenciales capturados en el formulario y sus requerimientos específicos.
          </p>
        </a>

        {/* Tarjeta 3: Servicios */}
        <a 
          href="/admin/collections/services" 
          className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl hover:border-zinc-500 hover:-translate-y-1 hover:bg-zinc-800/80 transition-all duration-300 group shadow-lg"
        >
          <div className="w-14 h-14 bg-zinc-700/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-zinc-600/50">
            <Wrench className="text-zinc-300" size={28} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Gestionar Servicios</h2>
          <p className="text-zinc-400 leading-relaxed">
            Actualiza, edita o elimina tu oferta de servicios industriales y motorsport.
          </p>
        </a>

      </div>
    </div>
  )
}
