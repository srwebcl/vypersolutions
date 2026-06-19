'use server'

import { getPayload } from 'payload'
import config from '@/payload.config'

export async function submitLead(formData: FormData) {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const data = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
    service_interest: formData.get('service_interest') as any,
    message: formData.get('message') as string,
  }

  try {
    await payload.create({
      collection: 'leads',
      data,
    })
    return { success: true }
  } catch (error) {
    console.error('Error creating lead:', error)
    return { success: false, error: 'Hubo un error al enviar el formulario.' }
  }
}
