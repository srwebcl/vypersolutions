import React from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { ArrowLeft } from 'lucide-react'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  
  const services = await payload.find({
    collection: 'services',
    limit: 100,
  })

  return services.docs.map((doc) => ({
    slug: doc.slug,
  }))
}

export default async function ServicePage(props: PageProps) {
  const params = await props.params;
  const { slug } = params

  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const result = await payload.find({
    collection: 'services',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })

  const service = result.docs[0]

  if (!service) {
    notFound()
  }

  // Extraemos la URL de la imagen si existe
  const imageUrl = service.image && typeof service.image === 'object' && service.image.url 
    ? service.image.url 
    : null

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Hero Section Cinemático */}
      <section className="relative w-full h-[60vh] min-h-[500px] flex flex-col justify-end pb-16 px-4 md:px-12 xl:px-24 border-b border-zinc-800">
        {/* Imagen de Fondo */}
        <div className="absolute inset-0 bg-zinc-900 overflow-hidden">
          {imageUrl && (
            <Image 
              src={imageUrl} 
              alt={service.title} 
              fill
              sizes="100vw"
              className="object-cover opacity-40 transition-transform duration-1000 hover:scale-105"
              priority
            />
          )}
          {/* Overlay Oscuro para Legibilidad */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent"></div>
        </div>

        {/* Contenido del Hero */}
        <div className="relative z-10 max-w-5xl mx-auto w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
          <span className={`inline-flex items-center px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-full border backdrop-blur-md mb-6 shadow-lg ${
            service.division === 'Motorsport' 
              ? 'bg-red-950/40 text-red-400 border-red-900/30'
              : 'bg-blue-950/40 text-blue-400 border-blue-900/30'
          }`}>
            {service.division}
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-white drop-shadow-2xl">
            {service.title}
          </h1>
          <p className="text-xl md:text-2xl text-zinc-300 max-w-3xl font-light leading-relaxed">
            {service.short_description}
          </p>
        </div>
      </section>

      {/* Contenido Principal (Lexical Rich Text) */}
      <section className="px-4 md:px-12 xl:px-24 py-20 bg-zinc-950">
        <div className="max-w-4xl mx-auto">
          {service.content ? (
            <div className="prose prose-invert prose-lg prose-zinc max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-blue-500 hover:prose-a:text-blue-400 prose-img:rounded-xl">
              <RichText data={service.content} />
            </div>
          ) : (
            <div className="text-zinc-500 italic text-center py-20 border border-zinc-800 border-dashed rounded-2xl bg-zinc-900/30">
              <p className="text-lg">El contenido detallado para este servicio está en desarrollo.</p>
              <p className="text-sm mt-2">Próximamente publicaremos especificaciones técnicas y beneficios.</p>
            </div>
          )}

          {/* Navegación y CTAs */}
          <div className="mt-24 pt-12 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-8">
            <a 
              href="/#servicios" 
              className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors font-medium px-4 py-2 rounded-lg hover:bg-zinc-900"
            >
              <ArrowLeft size={20} />
              Volver al Catálogo
            </a>
            
            <a 
              href="/#contacto" 
              className="btn-vyper-primary w-full sm:w-auto text-center"
            >
              Cotizar este Servicio
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
