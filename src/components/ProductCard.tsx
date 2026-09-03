'use client'

import React, { useState } from 'react'
import { submitLead } from '@/actions/submitLead'

export default function ProductCard({ product }: { product: any }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false)
  const [isSubmittingLead, setIsSubmittingLead] = useState(false)

  // Determinar el color del badge según el status
  let statusClasses = 'bg-blue-950/50 text-blue-400 border-blue-900/50'
  const statusObj = typeof product.status === 'object' ? product.status : null
  
  if (statusObj?.color === 'negative' || product.status === 'Agotado') statusClasses = 'bg-red-950/50 text-red-400 border-red-900/50'
  if (statusObj?.color === 'warning' || product.status === 'A Pedido') statusClasses = 'bg-amber-950/50 text-amber-400 border-amber-900/50'

  // Obtener imagen principal
  const mainImage = product.gallery?.[0]?.image?.url

  // Formatear precio
  const formatPrice = (priceStr: string) => {
    if (!priceStr) return 'Valor a Cotizar'
    const num = parseInt(priceStr.replace(/[^0-9]/g, ''), 10)
    if (isNaN(num)) return 'Valor a Cotizar'
    return '$ ' + new Intl.NumberFormat('es-CL').format(num)
  }

  // Enviar a WhatsApp
  const handleWhatsAppSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmittingLead(true)
    
    const formData = new FormData(e.currentTarget)
    // Forzar el producto como servicio de interés o mensaje
    formData.append('service_interest', 'Catálogo Automotriz')
    formData.append('message', `[Cotización Rápida WhatsApp] Producto: ${product.title}`)
    
    await submitLead(formData)
    
    setIsSubmittingLead(false)
    setIsWhatsAppModalOpen(false)
    
    const phoneNumber = '56983464601' // Teléfono principal
    const text = encodeURIComponent(`Hola, me interesa cotizar o consultar disponibilidad sobre el siguiente producto:\n\n- ${product.title}`)
    window.open(`https://wa.me/${phoneNumber}?text=${text}`, '_blank')
  }

  return (
    <>
      <div className="group rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-xl transition-all hover:border-zinc-600 hover:-translate-y-1 duration-300 flex flex-col h-full cursor-pointer" onClick={() => setIsModalOpen(true)}>
        
        {/* Imagen del Producto */}
        <div className="relative aspect-video bg-zinc-950 flex items-center justify-center border-b border-zinc-800 overflow-hidden">
          {mainImage ? (
            <img src={mainImage} alt={product.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          ) : (
            <svg className="w-12 h-12 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          )}
          <div className="absolute top-2 right-2 md:top-4 md:right-4">
             <span className={`px-2 py-0.5 md:px-3 md:py-1 text-[8px] md:text-[10px] font-bold uppercase tracking-wider rounded-full border ${statusClasses}`}>
              {typeof product.status === 'object' ? product.status.title : product.status}
            </span>
          </div>
        </div>

        <div className="p-3 md:p-6 flex flex-col flex-grow">
          <h3 className="text-lg md:text-2xl font-bold text-white mb-1 md:mb-2 line-clamp-2">{product.title}</h3>
          
          <p className="text-base md:text-xl text-blue-400 font-semibold mb-3 md:mb-4">
            {product.price ? formatPrice(product.price) : 'Valor a Cotizar'}
          </p>

          <button onClick={(e) => { e.stopPropagation(); setIsModalOpen(true); }} className="mt-auto w-full block text-center py-2 md:py-3 px-2 md:px-4 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-lg transition-colors text-sm md:text-base">
            Ver Detalles
          </button>
        </div>
      </div>

      {/* Modal / Pop-up de Detalles del Producto */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" onClick={() => setIsModalOpen(false)}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
          
          <div 
            className="relative bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col md:flex-row animate-in fade-in zoom-in duration-200"
            onClick={e => e.stopPropagation()}
          >
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-black rounded-full text-zinc-400 hover:text-white transition-colors">
              ✕
            </button>

            {/* Modal Gallery */}
            <div className="w-full md:w-1/2 bg-zinc-900 border-r border-zinc-800 p-6 flex flex-col gap-4">
              {mainImage ? (
                <div className="aspect-square rounded-xl overflow-hidden bg-black">
                  <img src={mainImage} className="w-full h-full object-cover" alt={product.title} />
                </div>
              ) : (
                <div className="aspect-square rounded-xl bg-zinc-800 flex items-center justify-center">
                  <span className="text-zinc-600">Sin imagen</span>
                </div>
              )}

              {/* Thumbnails */}
              {product.gallery && product.gallery.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                  {product.gallery.map((item: any, idx: number) => item.image?.url && (
                    <img key={idx} src={item.image.url} className="w-20 h-20 rounded-lg object-cover border border-zinc-700 hover:border-blue-500 cursor-pointer" alt="thumbnail" />
                  ))}
                </div>
              )}
            </div>

            {/* Modal Info */}
            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto custom-scrollbar">
              <span className={`inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border w-max mb-4 ${statusClasses}`}>
                {typeof product.status === 'object' ? product.status.title : product.status}
              </span>
              
              <h2 className="text-3xl font-bold text-white mb-2 break-words">{product.title}</h2>
              <p className="text-2xl text-blue-400 font-bold mb-8">
                {product.price ? formatPrice(product.price) : 'Valor a Cotizar'}
              </p>

              {/* RichText Description Rendering (HTML) */}
              {product.description && (
                <div className="prose prose-invert prose-blue max-w-full mb-8 break-words prose-img:max-w-full prose-img:h-auto prose-pre:max-w-full prose-pre:overflow-x-auto overflow-hidden">
                  <div dangerouslySetInnerHTML={{ __html: product.description }} className="max-w-full overflow-x-hidden" />
                </div>
              )}



              <div className="mt-auto pt-6 border-t border-zinc-800">
                <button 
                  onClick={() => setIsWhatsAppModalOpen(true)}
                  className="w-full block text-center py-4 px-6 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  Cotizar por WhatsApp
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Gateway de Captura para WhatsApp */}
      {isWhatsAppModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6" onClick={() => setIsWhatsAppModalOpen(false)}>
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md"></div>
          
          <div className="relative bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
            <button onClick={() => setIsWhatsAppModalOpen(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-white">✕</button>
            
            <h3 className="text-2xl font-bold text-white mb-2">Cotización Rápida</h3>
            <p className="text-zinc-400 mb-6 text-sm">Déjanos tus datos básicos antes de enviarte a nuestro WhatsApp corporativo.</p>

            <form onSubmit={handleWhatsAppSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Nombre</label>
                <input type="text" name="name" required className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500" placeholder="Tu nombre" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Teléfono o Email</label>
                <input type="text" name="email" required className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500" placeholder="Ej: +569... o correo@..." />
              </div>
              <button 
                type="submit" 
                disabled={isSubmittingLead}
                className="w-full mt-4 py-3 px-6 bg-green-600 hover:bg-green-500 disabled:bg-green-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                {isSubmittingLead ? 'Conectando...' : 'Ir a WhatsApp'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
