'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { cookies } from 'next/headers'

export async function adminLogin(prevState: any, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email y contraseña son obligatorios.' }
  }

  try {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.login({
      collection: 'users',
      data: { email, password },
      req: {
        // @ts-ignore
        headers: new Headers(),
      }
    })

    if (result.token) {
      // Guardar el token en las cookies tal como Payload lo espera
      const cookieStore = await cookies()
      cookieStore.set('payload-token', result.token, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 1 semana
      })
      
      return { success: true }
    }
  } catch (error: any) {
    console.error('Login error:', error)
    return { error: 'Credenciales inválidas.' }
  }

  return { error: 'Ha ocurrido un error inesperado.' }
}
