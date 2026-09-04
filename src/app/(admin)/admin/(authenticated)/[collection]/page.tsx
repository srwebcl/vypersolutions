import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import DataTable from '@/components/admin/DataTable'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const ALLOWED_COLLECTIONS = ['leads', 'projects', 'services', 'products']

function getCollectionConfig(collection: string) {
  switch (collection) {
    case 'leads':
      return {
        title: 'Leads',
        columns: [
          { key: 'name', label: 'Nombre' },
          { key: 'email', label: 'Email' },
          { key: 'service', label: 'Servicio de Interés', render: (val: any) => val || '-' },
          { key: 'createdAt', label: 'Fecha', render: (val: string) => new Date(val).toLocaleDateString('es-CL') }
        ]
      }
    case 'projects':
      return {
        title: 'Proyectos',
        columns: [
          { key: 'title', label: 'Título' },
          { key: 'client', label: 'Cliente', render: (val: any) => val || '-' },
          { key: 'createdAt', label: 'Creado', render: (val: string) => new Date(val).toLocaleDateString('es-CL') }
        ]
      }
    case 'services':
      return {
        title: 'Servicios',
        columns: [
          { key: 'title', label: 'Título' },
          { key: 'shortDescription', label: 'Descripción', render: (val: string) => val ? val.substring(0, 50) + '...' : '-' }
        ]
      }
    case 'products':
      return {
        title: 'Productos',
        columns: [
          { key: 'name', label: 'Nombre' },
          { key: 'price', label: 'Precio', render: (val: number) => val ? `$${val.toLocaleString('es-CL')}` : '-' }
        ]
      }
    default:
      return null
  }
}

export default async function CollectionListPage({ params }: { params: Promise<{ collection: string }> }) {
  const resolvedParams = await params
  if (!ALLOWED_COLLECTIONS.includes(resolvedParams.collection)) {
    notFound()
  }

  const config = getCollectionConfig(resolvedParams.collection)
  if (!config) notFound()

  const payload = await getPayload({ config: configPromise })
  
  // @ts-ignore (dynamic collection type)
  const data = await payload.find({
    collection: resolvedParams.collection as any,
    limit: 50,
    sort: '-createdAt'
  })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100 mb-2">{config.title}</h1>
          <p className="text-zinc-400">Gestiona los registros de la base de datos.</p>
        </div>
        <Link 
          href={`/admin/${resolvedParams.collection}/new`}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] border border-blue-500/50"
        >
          + Nuevo Registro
        </Link>
      </div>

      <DataTable 
        collection={resolvedParams.collection}
        columns={config.columns}
        data={data.docs}
      />
    </div>
  )
}
