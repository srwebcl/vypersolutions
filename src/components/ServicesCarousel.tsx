'use client'

import React, { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Define a minimal interface matching the Payload service shape
interface Service {
  id: string
  title: string
  slug: string
  division: string
  short_description: string
  image?: { url?: string } | null | string
}

export default function ServicesCarousel({ services }: { services: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -350, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 350, behavior: 'smooth' })
    }
  }

  if (!services || services.length === 0) {
    return (
      <div className="text-center p-12 border border-zinc-800 rounded-2xl bg-zinc-900/50 max-w-7xl mx-auto px-4">
        <p className="text-xl text-zinc-400">Catálogo de servicios en actualización...</p>
      </div>
    )
  }

  return (
    <div className="relative w-full px-4 md:px-12 xl:px-24">
      
      {/* Botón Izquierdo */}
      <button 
        onClick={scrollLeft}
        className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black text-white p-3 rounded-full backdrop-blur transition-all focus:outline-none"
        aria-label="Anterior"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Contenedor del Carrusel */}
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-6 px-4 md:px-12 py-10 carousel-mask"
      >
        {services.map((service: Service) => {
          // Extraemos la URL de la imagen de forma segura
          const imageUrl = service.image && typeof service.image === 'object' && service.image.url 
            ? service.image.url 
            : null

          return (
            <div 
              key={service.id} 
              className="group relative rounded-2xl bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 shadow-2xl transition-all duration-500 overflow-hidden snap-center shrink-0 w-[85vw] md:w-[400px] h-[450px] md:h-[500px] hover:-translate-y-2 hover:neon-border-vyper"
            >
              {/* Imagen Inmersiva (Fondo Completo) */}
              <div className="absolute inset-0 bg-zinc-800">
                {imageUrl ? (
                  <img src={imageUrl} alt={service.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-800">
                    <svg className="w-20 h-20 text-zinc-700 mb-4 transition-transform duration-700 group-hover:rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Degradado Tenebroso Inferior (Estilo Tesla) */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>

              {/* Badge Superior */}
              <div className="absolute top-4 left-4 z-10">
                <span className={`inline-flex items-center px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border backdrop-blur-md ${
                  service.division === 'Motorsport' 
                    ? 'bg-red-950/40 text-red-400 border-red-900/30'
                    : 'bg-blue-950/40 text-blue-400 border-blue-900/30'
                }`}>
                  {service.division}
                </span>
              </div>

              {/* Contenido Inferior (Títulos y CTA) */}
              <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col items-center text-center z-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-3xl font-bold mb-3 text-white tracking-tight">{service.title}</h3>
                <p className="text-sm text-zinc-300 font-light leading-relaxed mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 line-clamp-2">
                  {service.short_description}
                </p>
                
                {/* Botón CTA Minimalista */}
                <a 
                  href={`/servicios/${service.slug}`} 
                  className="px-8 py-2.5 border border-white/50 hover:border-white bg-transparent hover:bg-white hover:text-black text-white text-sm font-semibold tracking-widest rounded-full transition-all duration-300 backdrop-blur-sm"
                >
                  EXPLORAR
                </a>
              </div>
            </div>
          )
        })}
      </div>

      {/* Botón Derecho */}
      <button 
        onClick={scrollRight}
        className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black text-white p-3 rounded-full backdrop-blur transition-all focus:outline-none"
        aria-label="Siguiente"
      >
        <ChevronRight size={24} />
      </button>

    </div>
  )
}
