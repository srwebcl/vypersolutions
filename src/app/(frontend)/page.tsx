import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import ContactForm from '@/components/ContactForm'
import ServicesCarousel from '@/components/ServicesCarousel'
import ProductCard from '@/components/ProductCard'

export default async function HomePage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  // Query triple: Servicios, Proyectos y Productos
  const [servicesResult, projectsResult, productsResult] = await Promise.all([
    payload.find({
      collection: 'services',
      limit: 10,
    }),
    payload.find({
      collection: 'projects',
      limit: 6,
    }),
    payload.find({
      collection: 'products',
      where: {
        isFeatured: {
          equals: true,
        },
      },
      limit: 6, // Hasta 6 destacados
    })
  ])

  const services = servicesResult.docs
  const projects = projectsResult.docs
  const products = productsResult.docs

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950">
      
      {/* Hero Section Premium */}
      <section className="relative flex flex-col items-center justify-center min-h-[80vh] px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-zinc-950 to-zinc-950 pointer-events-none"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-white leading-tight">
            Soluciones Industriales y Automotrices de <span className="text-gradient-vyper">Alta Precisión</span>
          </h1>
          <p className="text-xl md:text-2xl text-zinc-300 mb-10 max-w-2xl font-light">
            Corte Plasma CNC, Estructuras Metálicas y Preparación Motorsport en Coquimbo.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
            <a
              href="#contacto"
              className="btn-vyper-primary"
            >
              Cotizar Proyecto
            </a>
            <a
              href="#servicios"
              className="btn-vyper-secondary"
            >
              Ver Servicios
            </a>
          </div>
        </div>
      </section>

      {/* Services Section (Carrusel Premium) */}
      <section id="servicios" className="py-24 w-full overflow-hidden">
        <div className="text-center mb-16 px-4 max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Nuestros Servicios
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>
        
        <ServicesCarousel services={services} />
      </section>

      {/* Catálogo de Productos (Nueva Sección) */}
      <section id="productos" className="py-24 px-4 max-w-7xl mx-auto w-full border-t border-zinc-900/50">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Catálogo de Fabricación
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full mb-8"></div>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Descubre nuestra línea de carros de arrastre fabricados con ingeniería de precisión y los más altos estándares de seguridad.
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center p-12 border border-zinc-800 rounded-2xl bg-zinc-900/50">
            <p className="text-xl text-zinc-400">
              Nuestro catálogo de productos está en construcción. Vuelve pronto para ver nuestras novedades...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Portfolio Section (Proyectos Destacados) */}
      <section id="portafolio" className="py-24 px-4 max-w-7xl mx-auto w-full border-t border-zinc-900/50">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Proyectos Destacados
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        {projects.length === 0 ? (
          <div className="text-center p-12 border border-zinc-800 rounded-2xl bg-zinc-900/50">
            <p className="text-xl text-zinc-400">
              Pronto publicaremos nuestros mejores trabajos...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="group relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 aspect-video flex flex-col justify-end">
                
                <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                  <svg className="w-12 h-12 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>

                <div className="relative z-10 p-6 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent pt-12 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-xl font-bold text-white mb-1">{project.title}</h3>
                  <p className="text-sm text-zinc-400 line-clamp-2">Explora los detalles y galería de este proyecto destacado.</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-24 bg-zinc-950 px-4 mt-auto border-t border-zinc-900">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          <div className="flex flex-col justify-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
              Conversemos sobre tu <span className="text-blue-500">próximo proyecto</span>
            </h2>
            <p className="text-xl text-zinc-400 mb-10 font-light leading-relaxed">
              Déjanos tus datos y nos pondremos en contacto contigo a la brevedad para ofrecerte la mejor solución integral.
            </p>
            <div className="flex flex-col space-y-6 text-lg text-zinc-300">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-zinc-900 rounded-lg text-blue-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                </div>
                <div>
                  <strong className="block text-white mb-1">Dirección</strong>
                  <span className="text-zinc-400">Av. La Cantera 1916, Coquimbo</span>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-3 bg-zinc-900 rounded-lg text-blue-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                </div>
                <div>
                  <strong className="block text-white mb-1">Email</strong>
                  <a href="mailto:contacto@vypersolutions.cl" className="text-zinc-400 hover:text-blue-500 transition-colors">
                    contacto@vypersolutions.cl
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-zinc-900 rounded-lg text-blue-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                </div>
                <div>
                  <strong className="block text-white mb-1">Teléfono</strong>
                  <a href="tel:+56983464601" className="text-zinc-400 hover:text-blue-500 transition-colors">
                    +569 8346 4601
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-zinc-900/40 p-8 md:p-10 rounded-2xl border border-zinc-800 shadow-2xl">
            <ContactForm />
          </div>

        </div>
      </section>
    </div>
  )
}
