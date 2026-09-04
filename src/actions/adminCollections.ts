'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function checkAuth(payload: any) {
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value
  
  if (!token) return null

  const { user } = await payload.auth({
    headers: new Headers({ Authorization: `JWT ${token}` })
  })

  return user
}

export async function saveRecord(collection: string, id: string | null, data: any) {
  try {
    const payload = await getPayload({ config: configPromise })
    
    // Autenticación segura
    const user = await checkAuth(payload)
    if (!user) {
      return { error: 'No autorizado' }
    }

    // @ts-ignore
    let result
    if (id && id !== 'new') {
      result = await payload.update({
        collection: collection as any,
        id,
        data,
        user,
        overrideAccess: false,
      })
    } else {
      result = await payload.create({
        collection: collection as any,
        data,
        user,
        overrideAccess: false,
      })
    }

    revalidatePath(`/admin/${collection}`)
    revalidatePath(`/admin/${collection}/${result.id}`)
    
    return { success: true, doc: result }
  } catch (error: any) {
    console.error('Error saving record:', error)
    return { error: error.message || 'Error al guardar el registro' }
  }
}

export async function uploadMedia(formData: FormData) {
  try {
    const payload = await getPayload({ config: configPromise })
    const user = await checkAuth(payload)
    
    if (!user) {
      return { error: 'No autorizado' }
    }

    const file = formData.get('file') as File
    if (!file) return { error: 'No se proporcionó ningún archivo' }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const alt = (formData.get('alt') as string) || file.name || 'Imagen subida'

    const result = await payload.create({
      collection: 'media',
      data: {
        alt,
      },
      file: {
        data: buffer,
        name: file.name,
        mimetype: file.type,
        size: file.size,
      },
      user,
      overrideAccess: false,
    })

    return { success: true, doc: result }
  } catch (error: any) {
    console.error('Error uploading media:', error)
    return { error: error.message || 'Error al subir la imagen' }
  }
}
