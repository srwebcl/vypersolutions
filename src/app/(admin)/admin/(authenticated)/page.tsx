import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import StatWidget from '@/components/admin/StatWidget'
import Link from 'next/link'

export default async function DashboardHomePage() {
  const payload = await getPayload({ config: configPromise })

  // Fetch some metrics using Local API
  const leadsReq = await payload.find({ collection: 'leads', limit: 1 })
  const projectsReq = await payload.find({ collection: 'projects', limit: 1 })
  const servicesReq = await payload.find({ collection: 'services', limit: 1 })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-zinc-100 mb-2">Visión General</h1>
        <p className="text-zinc-400">Resumen del rendimiento y actividad de tu negocio.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatWidget 
          title="Total Leads" 
          value={leadsReq.totalDocs} 
          icon="🎯" 
          trend={{ value: 12, isPositive: true }} 
        />
        <StatWidget 
          title="Proyectos Activos" 
          value={projectsReq.totalDocs} 
          icon="🚀" 
          trend={{ value: 4, isPositive: true }} 
        />
        <StatWidget 
          title="Servicios Ofertados" 
          value={servicesReq.totalDocs} 
          icon="🛠" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/80 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-zinc-100">Leads Recientes</h3>
            <Link href="/admin/leads" className="text-sm text-blue-400 hover:text-blue-300">
              Ver Todos →
            </Link>
          </div>
          <div className="text-center py-10 text-zinc-500">
            Los últimos leads aparecerán aquí.
          </div>
        </div>

        <div className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/80 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-zinc-100">Actividad Reciente</h3>
          </div>
          <div className="text-center py-10 text-zinc-500">
            No hay actividad reciente.
          </div>
        </div>
      </div>
    </div>
  )
}
