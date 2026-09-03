import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/admin/Sidebar'
import Header from '@/components/admin/Header'

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Verificación de Autenticación
  const payload = await getPayload({ config: configPromise })
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value
  
  if (!token) {
    redirect('/admin/login')
  }

  const { user } = await payload.auth({
    headers: new Headers({ Authorization: `JWT ${token}` })
  })

  if (!user) {
    redirect('/admin/login')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950 text-zinc-100">
      <Sidebar />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header user={user} />
        <main className="w-full px-6 py-8 mx-auto sm:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}
