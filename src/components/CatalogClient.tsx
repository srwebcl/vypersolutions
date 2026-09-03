'use client'

import React, { useState, useMemo } from 'react'
import ProductCard from '@/components/ProductCard'

export default function CatalogClient({ initialProducts }: { initialProducts: any[] }) {
  const [activeCategory, setActiveCategory] = useState<string>('Todos')
  const [activeStatus, setActiveStatus] = useState<string>('Todos')

  const getCategoryTitle = (cat: any) => typeof cat === 'object' ? cat?.title : cat
  const getStatusTitle = (stat: any) => typeof stat === 'object' ? stat?.title : stat

  // Extraer categorías únicas disponibles
  const categories = ['Todos', ...Array.from(new Set(initialProducts.map(p => getCategoryTitle(p.category)).filter(Boolean)))]
  
  // Extraer estados únicos disponibles
  const statuses = ['Todos', ...Array.from(new Set(initialProducts.map(p => getStatusTitle(p.status)).filter(Boolean)))]

  // Filtrar productos
  const filteredProducts = useMemo(() => {
    return initialProducts.filter(product => {
      const matchCategory = activeCategory === 'Todos' || getCategoryTitle(product.category) === activeCategory
      const matchStatus = activeStatus === 'Todos' || getStatusTitle(product.status) === activeStatus
      return matchCategory && matchStatus
    })
  }, [initialProducts, activeCategory, activeStatus])

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      
      {/* Sidebar de Filtros */}
      <aside className="w-full lg:w-1/4 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl sticky top-24">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
          Filtros
        </h3>

        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-semibold text-zinc-400 mb-3 uppercase tracking-wider">Categoría</h4>
            <div className="space-y-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat as string)}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all flex justify-between items-center ${activeCategory === cat ? 'bg-blue-600/20 text-blue-400 font-medium border border-blue-500/30' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white border border-transparent'}`}
                >
                  {cat}
                  {cat !== 'Todos' && (
                    <span className="text-xs bg-zinc-800 px-2 py-0.5 rounded-full text-zinc-500">
                      {initialProducts.filter(p => getCategoryTitle(p.category) === cat).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-zinc-400 mb-3 uppercase tracking-wider">Disponibilidad</h4>
            <div className="flex flex-wrap gap-2">
              {statuses.map(stat => (
                <button
                  key={stat}
                  onClick={() => setActiveStatus(stat as string)}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-all border ${activeStatus === stat ? 'bg-zinc-100 text-zinc-900 font-bold border-zinc-100' : 'bg-zinc-900 text-zinc-400 border-zinc-700 hover:border-zinc-500'}`}
                >
                  {stat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Cuadrícula de Resultados */}
      <div className="w-full lg:w-3/4">
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Resultados</h2>
            <p className="text-zinc-400 text-sm">Mostrando {filteredProducts.length} productos</p>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center">
            <svg className="w-16 h-16 text-zinc-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
            <h3 className="text-xl font-bold text-white mb-2">No se encontraron productos</h3>
            <p className="text-zinc-400">Prueba cambiando los filtros seleccionados.</p>
            <button onClick={() => { setActiveCategory('Todos'); setActiveStatus('Todos'); }} className="mt-6 text-blue-400 hover:text-blue-300 underline underline-offset-4">
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
