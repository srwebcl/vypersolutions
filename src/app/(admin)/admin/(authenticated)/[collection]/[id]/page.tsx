import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import DynamicForm from '@/components/admin/DynamicForm'
import { Leads } from '@/collections/Leads'
import { Projects } from '@/collections/Projects'
import { Services } from '@/collections/Services'
import { Products } from '@/collections/Products'

function getFieldsForCollection(collection: string) {
  let fields: any[] = []
  switch (collection) {
    case 'leads': fields = Leads.fields; break;
    case 'projects': fields = Projects.fields; break;
    case 'services': fields = Services.fields; break;
    case 'products': fields = Products.fields; break;
    default: fields = [];
  }

  const mapField = (f: any): any => ({
    name: f.name || '',
    type: f.type || 'text',
    label: typeof f.label === 'string' ? f.label : f.name,
    required: !!f.required,
    options: f.options || null,
    relationTo: f.relationTo || null,
    fields: f.fields ? f.fields.map(mapField) : null,
  })

  // Next.js no puede serializar funciones (hooks, validate, etc.) para Client Components.
  // Mapeamos solo las propiedades que el formulario necesita.
  return fields.map(mapField)
}

export default async function CollectionEditPage({ params }: { params: Promise<{ collection: string, id: string }> }) {
  const resolvedParams = await params
  const isNew = resolvedParams.id === 'new'
  const payload = await getPayload({ config: configPromise })
  
  let doc = null
  if (!isNew) {
    try {
      // @ts-ignore
      doc = await payload.findByID({
        collection: resolvedParams.collection,
        id: resolvedParams.id
      })
    } catch (e) {
      notFound()
    }
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link 
          href={`/admin/${resolvedParams.collection}`}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors"
        >
          ←
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-zinc-100 mb-1">
            {isNew ? 'Nuevo Registro' : 'Editar Registro'}
          </h1>
          <p className="text-zinc-400 font-mono text-sm">
            {resolvedParams.collection} {doc ? `/ ${doc.id}` : ''}
          </p>
        </div>
      </div>

      <div className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/80 rounded-2xl p-8">
        <DynamicForm 
          collection={resolvedParams.collection} 
          fields={getFieldsForCollection(resolvedParams.collection)} 
          initialData={doc || {}} 
          id={resolvedParams.id} 
        />
      </div>
    </div>
  )
}
