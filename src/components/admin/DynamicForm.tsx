'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { saveRecord, uploadMedia } from '@/actions/adminCollections'
import dynamic from 'next/dynamic'
import 'react-quill-new/dist/quill.snow.css'

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })

export default function DynamicForm({ collection, fields, initialData = {}, id = 'new' }: any) {
  const router = useRouter()
  const [formData, setFormData] = useState<any>(initialData)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [relations, setRelations] = useState<any>({})
  const [uploadingFiles, setUploadingFiles] = useState<Record<string, boolean>>({})
  const [openSelect, setOpenSelect] = useState<string | null>(null)

  // Fetch relations if needed
  useEffect(() => {
    const fetchRelations = async () => {
      const relFields = fields.filter((f: any) => f.type === 'relationship')
      for (const field of relFields) {
        try {
          const res = await fetch(`/api/${field.relationTo}?limit=100`)
          const json = await res.json()
          setRelations((prev: any) => ({ ...prev, [field.relationTo]: json.docs }))
        } catch (e) {
          console.error('Error fetching relations', e)
        }
      }
    }
    fetchRelations()
  }, [fields])

  // Auto-generate slug from title or name
  useEffect(() => {
    if (fields.some((f: any) => f.name === 'slug')) {
      const source = formData.title || formData.name
      if (source && typeof source === 'string') {
        const generatedSlug = source
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
        
        setFormData((prev: any) => ({ ...prev, slug: generatedSlug }))
      }
    }
  }, [formData.title, formData.name, fields])

  const handleChange = (e: any) => {
    let { name, value } = e.target
    
    if (name === 'price' && value) {
      const num = parseInt(value.replace(/[^0-9]/g, ''), 10)
      if (!isNaN(num)) {
        value = '$' + new Intl.NumberFormat('es-CL').format(num)
      } else {
        value = ''
      }
    }
    
    setFormData((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleCustomSelect = (name: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleFileUpload = async (name: string, file: File) => {
    if (!file) return

    setUploadingFiles((prev) => ({ ...prev, [name]: true }))
    setError(null)

    const form = new FormData()
    form.append('file', file)
    form.append('alt', file.name || 'Imagen subida')

    try {
      const res = await uploadMedia(form)
      
      if (res.success && res.doc?.id) {
        setFormData((prev: any) => ({ ...prev, [name]: res.doc.id }))
      } else {
        setError(res.error || 'Error al subir la imagen')
      }
    } catch (err: any) {
      setError('Ocurrió un error al intentar subir el archivo')
    } finally {
      setUploadingFiles((prev) => ({ ...prev, [name]: false }))
    }
  }

  const handleArrayFileUpload = async (arrayName: string, index: number, subfieldName: string, file: File) => {
    if (!file) return

    const uploadKey = `${arrayName}-${index}-${subfieldName}`
    setUploadingFiles((prev) => ({ ...prev, [uploadKey]: true }))
    setError(null)

    const form = new FormData()
    form.append('file', file)
    form.append('alt', file.name || 'Imagen subida')

    try {
      const res = await uploadMedia(form)
      
      if (res.success && res.doc?.id) {
        setFormData((prev: any) => {
          const arr = [...(prev[arrayName] || [])]
          if (!arr[index]) arr[index] = {}
          arr[index] = { ...arr[index], [subfieldName]: res.doc } // Store full doc for preview
          return { ...prev, [arrayName]: arr }
        })
      } else {
        setError(res.error || 'Error al subir la imagen')
      }
    } catch (err: any) {
      setError('Ocurrió un error al intentar subir el archivo')
    } finally {
      setUploadingFiles((prev) => ({ ...prev, [uploadKey]: false }))
    }
  }

  const handleMultiUpload = async (arrayName: string, subfieldName: string, files: FileList) => {
    if (!files || files.length === 0) return

    const newFiles = Array.from(files)
    const uploadKey = `${arrayName}-multi`
    setUploadingFiles(prev => ({ ...prev, [uploadKey]: true }))
    setError(null)

    const uploadedDocs: any[] = []

    for (const file of newFiles) {
      const form = new FormData()
      form.append('file', file)
      form.append('alt', file.name || 'Imagen subida')

      try {
        const res = await uploadMedia(form)
        if (res.success && res.doc?.id) {
          uploadedDocs.push(res.doc) // Store full doc for preview
        }
      } catch (err) {
        console.error('Error uploading file in multi-upload', err)
      }
    }

    if (uploadedDocs.length > 0) {
      setFormData((prev: any) => {
        const arr = [...(prev[arrayName] || [])]
        const newItems = uploadedDocs.map(doc => ({ [subfieldName]: doc }))
        return { ...prev, [arrayName]: [...arr, ...newItems] }
      })
    }

    setUploadingFiles(prev => ({ ...prev, [uploadKey]: false }))
  }

  const handleArrayChange = (name: string, index: number, subfieldName: string, value: any) => {
    setFormData((prev: any) => {
      const arr = [...(prev[name] || [])]
      if (!arr[index]) arr[index] = {}
      arr[index] = { ...arr[index], [subfieldName]: value }
      return { ...prev, [name]: arr }
    })
  }

  const moveArrayItem = (name: string, from: number, to: number) => {
    setFormData((prev: any) => {
      const arr = [...(prev[name] || [])]
      if (to < 0 || to >= arr.length) return prev
      const item = arr.splice(from, 1)[0]
      arr.splice(to, 0, item)
      return { ...prev, [name]: arr }
    })
  }

  const addArrayItem = (name: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [name]: [...(prev[name] || []), {}]
    }))
  }

  const removeArrayItem = (name: string, index: number) => {
    setFormData((prev: any) => {
      const arr = [...(prev[name] || [])]
      arr.splice(index, 1)
      return { ...prev, [name]: arr }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    // Process form data to match Payload structure (strip out full populated objects back to IDs for arrays if needed, though Payload usually handles it)
    const submitData = JSON.parse(JSON.stringify(formData)) // Deep clone
    
    // Clean up arrays with full media objects back to IDs to avoid validation errors
    fields.forEach((field: any) => {
      if (field.type === 'array' && submitData[field.name]) {
        submitData[field.name] = submitData[field.name].map((item: any) => {
          const cleanItem = { ...item }
          field.fields?.forEach((subField: any) => {
            if (subField.type === 'upload' && typeof cleanItem[subField.name] === 'object' && cleanItem[subField.name] !== null) {
              cleanItem[subField.name] = cleanItem[subField.name].id
            }
          })
          return cleanItem
        })
      }
    })
    
    const res = await saveRecord(collection, id, submitData)
    
    if (res.error) {
      setError(res.error)
      setIsLoading(false)
    } else {
      router.push(`/admin/${collection}`)
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-900/30 border border-red-500/50 text-red-200 rounded-xl">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {fields.filter((f: any) => f.name !== 'createdAt' && f.name !== 'updatedAt').map((field: any) => {
          // Skip sidebar fields like slug/status for now or render them normally
          if (field.name === 'slug') return null // Auto-generated now

          const labelTranslation: Record<string, string> = {
            'title': 'Título',
            'name': 'Nombre',
            'email': 'Correo Electrónico',
            'phone': 'Teléfono',
            'message': 'Mensaje',
            'short_description': 'Descripción Corta',
            'content': 'Contenido',
            'description': 'Descripción',
            'division': 'División'
          }
          // Prioritize our translation over Payload's auto-generated English labels
          let displayLabel = labelTranslation[field.name] || field.label || field.name
          
          // Capitalize first letter as fallback
          if (displayLabel === field.name) {
            displayLabel = displayLabel.charAt(0).toUpperCase() + displayLabel.slice(1)
          }

          return (
            <div key={field.name} className="space-y-2 relative">
              <label className="block text-sm font-medium text-zinc-300">
                {displayLabel} {field.required && <span className="text-blue-400">*</span>}
              </label>

              {(field.type === 'text' || field.type === 'email' || field.type === 'number') && (
                <input
                  type={field.type === 'email' ? 'email' : 'text'}
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  required={field.required}
                  className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl focus:outline-none focus:border-blue-500/50 text-zinc-100"
                />
              )}

              {(field.type === 'textarea' || field.type === 'richText') && (
                field.name === 'description' || field.type === 'richText' ? (
                  <div className="rounded-xl overflow-hidden border border-zinc-800 bg-white">
                    <ReactQuill 
                      theme="snow"
                      value={typeof formData[field.name] === 'object' ? JSON.stringify(formData[field.name]) : (formData[field.name] || '')}
                      onChange={(content) => setFormData((prev: any) => ({ ...prev, [field.name]: content }))}
                      className="text-black min-h-[300px]"
                    />
                  </div>
                ) : (
                  <textarea
                    name={field.name}
                    value={typeof formData[field.name] === 'object' ? JSON.stringify(formData[field.name]) : (formData[field.name] || '')}
                    onChange={handleChange}
                    required={field.required}
                    rows={4}
                    className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl focus:outline-none focus:border-blue-500/50 text-zinc-100 font-mono text-sm"
                  />
                )
              )}

              {field.type === 'select' && (
                <div className="relative">
                  <div 
                    onClick={() => setOpenSelect(openSelect === field.name ? null : field.name)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl cursor-pointer text-zinc-100 hover:border-zinc-600 transition-colors"
                  >
                    <span>
                      {formData[field.name] 
                        ? field.options?.find((o: any) => o.value === formData[field.name])?.label || formData[field.name]
                        : 'Seleccionar...'}
                    </span>
                    <span className="text-zinc-500 text-xs">▼</span>
                  </div>
                  
                  {openSelect === field.name && (
                    <div className="absolute z-50 w-full mt-2 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl">
                      {field.options?.map((opt: any) => (
                        <div
                          key={opt.value}
                          onClick={() => {
                            handleChange({ target: { name: field.name, value: opt.value } })
                            setOpenSelect(null)
                          }}
                          className="px-4 py-3 hover:bg-blue-600/20 hover:text-blue-400 cursor-pointer text-zinc-300 transition-colors"
                        >
                          {opt.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {field.type === 'relationship' && (
                <div className="relative">
                  <div 
                    onClick={() => setOpenSelect(openSelect === field.name ? null : field.name)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl cursor-pointer text-zinc-100 hover:border-zinc-600 transition-colors"
                  >
                    <span>
                      {formData[field.name] 
                        ? relations[field.relationTo]?.find((r: any) => r.id === (typeof formData[field.name] === 'object' ? formData[field.name]?.id : formData[field.name]))?.title || formData[field.name]
                        : `Seleccionar ${field.relationTo}...`}
                    </span>
                    <span className="text-zinc-500 text-xs">▼</span>
                  </div>
                  
                  {openSelect === field.name && (
                    <div className="absolute z-50 w-full mt-2 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden max-h-64 overflow-y-auto backdrop-blur-xl">
                      {relations[field.relationTo]?.map((rel: any) => (
                        <div
                          key={rel.id}
                          onClick={() => {
                            handleChange({ target: { name: field.name, value: rel.id } })
                            setOpenSelect(null)
                          }}
                          className="px-4 py-3 hover:bg-blue-600/20 hover:text-blue-400 cursor-pointer text-zinc-300 transition-colors"
                        >
                          {rel.title || rel.name || rel.id}
                        </div>
                      ))}
                      {(!relations[field.relationTo] || relations[field.relationTo].length === 0) && (
                        <div className="px-4 py-3 text-zinc-500 italic">No hay resultados</div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {field.type === 'upload' && (
                <div className="p-4 border border-zinc-800 rounded-xl bg-zinc-900/30">
                  <div className="flex flex-col gap-4">
                    {formData[field.name] && (
                      <div className="flex items-center gap-4 p-3 bg-zinc-950 border border-green-500/30 rounded-lg text-green-400">
                        <span>✓ Archivo cargado (ID: {typeof formData[field.name] === 'object' ? formData[field.name]?.id : formData[field.name]})</span>
                        <button type="button" onClick={() => setFormData((prev: any) => ({ ...prev, [field.name]: null }))} className="text-sm underline text-zinc-500 hover:text-zinc-300">
                          Remover
                        </button>
                      </div>
                    )}
                    
                    <div>
                      <p className="text-sm font-medium text-zinc-300 mb-2">Seleccionar nuevo archivo</p>
                      <label className={`cursor-pointer inline-flex items-center justify-center px-6 py-3 bg-zinc-950 border border-zinc-800 hover:border-zinc-600 rounded-xl text-zinc-300 font-medium transition-colors ${uploadingFiles[field.name] ? 'opacity-50 pointer-events-none' : ''}`}>
                        <span>Subir Imagen</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleFileUpload(field.name, e.target.files[0])
                            }
                          }}
                          disabled={uploadingFiles[field.name]}
                        />
                      </label>
                    </div>
                    {uploadingFiles[field.name] && <p className="text-sm text-blue-400 animate-pulse">Subiendo archivo...</p>}
                  </div>
                </div>
              )}

              {field.type === 'array' && (
                <div className="pt-2">
                  {(() => {
                    const isGallery = field.fields?.some((f: any) => f.type === 'upload')
                    const uploadSubfield = field.fields?.find((f: any) => f.type === 'upload')
                    const textSubfields = field.fields?.filter((f: any) => f.type !== 'upload' && f.name !== 'id')

                    if (isGallery) {
                      // Shopify-like Image Gallery UI
                      return (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                          {(formData[field.name] || []).map((item: any, idx: number) => {
                            const imgData = item[uploadSubfield.name]
                            const imgUrl = typeof imgData === 'object' && imgData?.url ? imgData.url : null
                            const imgId = typeof imgData === 'object' ? imgData?.id : imgData

                            return (
                              <div key={idx} className="relative aspect-square bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center overflow-hidden group shadow-sm">
                                {imgUrl ? (
                                  <img src={imgUrl} className="w-full h-full object-cover" alt="Gallery item" />
                                ) : (
                                  <div className="text-zinc-600 flex flex-col items-center p-4 text-center">
                                    <span className="text-2xl mb-2">🖼️</span>
                                    <span className="text-xs truncate w-full px-2" title={imgId}>ID: {imgId || 'N/A'}</span>
                                  </div>
                                )}
                                
                                {idx === 0 && (
                                  <span className="absolute top-2 left-2 bg-blue-600/90 text-white text-[10px] uppercase font-bold px-2 py-1 rounded shadow-md backdrop-blur-sm">
                                    Principal
                                  </span>
                                )}

                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-all duration-200">
                                  <button type="button" onClick={() => moveArrayItem(field.name, idx, idx - 1)} disabled={idx === 0} className="w-8 h-8 flex items-center justify-center bg-zinc-800/80 hover:bg-blue-600 rounded-lg text-white disabled:opacity-30 disabled:hover:bg-zinc-800/80 transition-colors">
                                    ←
                                  </button>
                                  <button type="button" onClick={() => removeArrayItem(field.name, idx)} className="w-8 h-8 flex items-center justify-center bg-red-600/80 hover:bg-red-500 rounded-lg text-white transition-colors">
                                    ✕
                                  </button>
                                  <button type="button" onClick={() => moveArrayItem(field.name, idx, idx + 1)} disabled={idx === (formData[field.name] || []).length - 1} className="w-8 h-8 flex items-center justify-center bg-zinc-800/80 hover:bg-blue-600 rounded-lg text-white disabled:opacity-30 disabled:hover:bg-zinc-800/80 transition-colors">
                                    →
                                  </button>
                                </div>
                              </div>
                            )
                          })}
                          
                          <label className={`relative aspect-square border-2 border-dashed border-zinc-700 hover:border-blue-500 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors bg-zinc-900/30 group ${uploadingFiles[`${field.name}-multi`] ? 'opacity-50 pointer-events-none' : ''}`}>
                            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-blue-500/20 group-hover:text-blue-400 mb-3 transition-colors">
                              <span className="text-xl">+</span>
                            </div>
                            <span className="text-sm font-medium text-zinc-400 text-center px-4 group-hover:text-zinc-300">
                              {uploadingFiles[`${field.name}-multi`] ? 'Subiendo...' : 'Añadir Imágenes'}
                            </span>
                            <input 
                              type="file" 
                              accept="image/*" 
                              multiple
                              className="hidden" 
                              onChange={(e) => { 
                                if(e.target.files) handleMultiUpload(field.name, uploadSubfield.name, e.target.files)
                              }} 
                            />
                          </label>
                        </div>
                      )
                    } else {
                      // Clean List UI for features/specs
                      return (
                        <div className="space-y-2 border border-zinc-800 bg-zinc-900/30 p-4 rounded-xl">
                          {(formData[field.name] || []).map((item: any, idx: number) => (
                            <div key={idx} className="flex gap-3 items-center group bg-zinc-950 p-2 pl-3 rounded-lg border border-transparent hover:border-zinc-800 transition-colors">
                              <div className="flex flex-col gap-1 opacity-20 group-hover:opacity-50 px-1 py-2">
                                <div className="w-1 h-1 bg-white rounded-full"></div>
                                <div className="w-1 h-1 bg-white rounded-full"></div>
                                <div className="w-1 h-1 bg-white rounded-full"></div>
                              </div>
                              
                              <div className="flex-1 flex gap-2">
                                {textSubfields?.map((subField: any) => (
                                  <input 
                                    key={subField.name}
                                    type="text" 
                                    value={item[subField.name] || ''} 
                                    onChange={(e) => handleArrayChange(field.name, idx, subField.name, e.target.value)} 
                                    className="flex-1 bg-transparent border-b border-zinc-800/50 focus:border-blue-500 py-1.5 outline-none text-zinc-200 text-sm transition-colors" 
                                    placeholder={subField.label || subField.name}
                                  />
                                ))}
                              </div>

                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button type="button" onClick={() => moveArrayItem(field.name, idx, idx - 1)} disabled={idx === 0} className="w-7 h-7 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-800 rounded disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-zinc-500">↑</button>
                                <button type="button" onClick={() => moveArrayItem(field.name, idx, idx + 1)} disabled={idx === (formData[field.name] || []).length - 1} className="w-7 h-7 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-800 rounded disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-zinc-500">↓</button>
                                <button type="button" onClick={() => removeArrayItem(field.name, idx)} className="w-7 h-7 flex items-center justify-center text-red-500 hover:text-red-400 hover:bg-red-950/50 rounded ml-1">✕</button>
                              </div>
                            </div>
                          ))}
                          
                          <button 
                            type="button" 
                            onClick={() => addArrayItem(field.name)} 
                            className="mt-2 text-sm text-blue-400 hover:text-blue-300 font-medium px-3 py-2 flex items-center gap-2 rounded-lg hover:bg-blue-900/20 transition-colors"
                          >
                            <span>+</span> Añadir {(labelTranslation[field.name] || field.name).slice(0, -1)}
                          </button>
                        </div>
                      )
                    }
                  })()}
                </div>
              )}

            </div>
          )
        })}
      </div>

      <div className="flex justify-end gap-4 pt-6 border-t border-zinc-800">
        <button 
          type="button"
          onClick={() => router.push(`/admin/${collection}`)}
          className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-medium rounded-xl border border-zinc-700 transition-colors"
        >
          Cancelar
        </button>
        <button 
          type="submit"
          disabled={isLoading}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl border border-blue-500/50 shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all disabled:opacity-50"
        >
          {isLoading ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
    </form>
  )
}
