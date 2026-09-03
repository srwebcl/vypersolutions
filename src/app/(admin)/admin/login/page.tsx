import LoginForm from '@/components/admin/LoginForm'
import Image from 'next/image'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export default async function LoginPage() {
  // Verificar si ya está autenticado para redirigir al dashboard
  const payload = await getPayload({ config: configPromise })
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value
  
  if (token) {
    const { user } = await payload.auth({
      headers: new Headers({ Authorization: `JWT ${token}` })
    })
    
    if (user) {
      redirect('/admin')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-zinc-950">
      {/* Elementos decorativos */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-[120px]" />

      <div className="relative z-10 w-full max-w-md p-8 md:p-12 bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/80 rounded-3xl shadow-2xl">
        <div className="text-center mb-10 flex flex-col items-center">
          <Image src="/logo-vyper-blanco.webp" alt="Vyper Solutions" width={180} height={60} className="mb-4" />
        </div>

        <LoginForm />
      </div>
    </div>
  )
}
