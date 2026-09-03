import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import CatalogClient from '@/components/CatalogClient'

export const metadata = {
  title: 'Catálogo de Fabricación | Vyper Solutions',
  description: 'Explora nuestra línea de carros de arrastre, estructuras y accesorios fabricados a medida.',
}

export default async function ProductosPage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  // Query all products
  const productsResult = await payload.find({
    collection: 'products',
    limit: 100, // Reasonable limit for initial load
  })

  const products = productsResult.docs

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 pt-24">
      <div className="max-w-7xl mx-auto px-4 py-12 w-full flex-grow">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Catálogo Automotriz e Industrial
          </h1>
          <div className="w-24 h-1 bg-blue-600 rounded-full mb-6"></div>
          <p className="text-xl text-zinc-400 max-w-3xl font-light">
            Soluciones de fabricación diseñadas con ingeniería de precisión. Filtra por categoría y estado para encontrar el producto o encargo ideal.
          </p>
        </div>

        {/* Client Component for filtering state */}
        <CatalogClient initialProducts={products} />
      </div>
    </div>
  )
}
