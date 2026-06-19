'use client'

import React, { useState } from 'react'
import { submitLead } from '@/actions/submitLead'

export default function ContactForm() {
  const [isPending, setIsPending] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsPending(true)
    setStatus('idle')

    const formData = new FormData(event.currentTarget)
    
    const result = await submitLead(formData)
    
    if (result.success) {
      setStatus('success')
      event.currentTarget.reset()
    } else {
      setStatus('error')
    }
    
    setIsPending(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-6 w-full">
      {status === 'success' && (
        <div className="p-4 bg-green-900/50 border border-green-800 text-green-300 rounded-lg text-center">
          ¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.
        </div>
      )}
      
      {status === 'error' && (
        <div className="p-4 bg-red-900/50 border border-red-800 text-red-300 rounded-lg text-center">
          Ocurrió un error al enviar el mensaje. Intenta nuevamente.
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-2">Nombre completo</label>
        <input 
          type="text" 
          id="name" 
          name="name" 
          required
          className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="Ej: Juan Pérez"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">Email</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            required
            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="correo@empresa.com"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-zinc-300 mb-2">Teléfono</label>
          <input 
            type="tel" 
            id="phone" 
            name="phone" 
            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="+56 9 1234 5678"
          />
        </div>
      </div>

      <div>
        <label htmlFor="service_interest" className="block text-sm font-medium text-zinc-300 mb-2">Servicio de interés</label>
        <select 
          id="service_interest" 
          name="service_interest"
          className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        >
          <option value="Corte Plasma CNC">Corte Plasma CNC</option>
          <option value="Soldaduras Especiales">Soldaduras Especiales</option>
          <option value="Estructuras Metálicas">Estructuras Metálicas</option>
          <option value="Mecánica Automotriz">Mecánica Automotriz</option>
          <option value="Taller Motorsport">Taller Motorsport</option>
          <option value="Otro">Otro</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-zinc-300 mb-2">Mensaje</label>
        <textarea 
          id="message" 
          name="message" 
          rows={4}
          required
          className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
          placeholder="Cuéntanos sobre tu proyecto..."
        ></textarea>
      </div>

      <button 
        type="submit" 
        disabled={isPending}
        className="w-full px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors text-lg flex items-center justify-center"
      >
        {isPending ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Enviando...
          </span>
        ) : 'Enviar Mensaje'}
      </button>
    </form>
  )
}
