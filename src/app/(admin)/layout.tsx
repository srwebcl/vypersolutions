import React from 'react'
import '../(frontend)/styles.css' // Reutilizar estilos globales/Tailwind

export const metadata = {
  title: 'Vyper Dashboard',
  description: 'Bespoke Administration Panel',
}

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="dark">
      <body className="bg-[#09090b] text-zinc-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  )
}
