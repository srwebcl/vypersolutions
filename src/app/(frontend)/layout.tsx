import React from 'react'
import Image from 'next/image'
import './styles.css'

export const metadata = {
  title: 'Vyper Solutions & Vyper Motorsport',
  description: 'Soluciones integrales Todo en Uno. Precisión tecnológica y alto rendimiento en Coquimbo.',
  icons: {
    icon: '/favicon-vyper.webp',
  },
}

import Header from '@/components/Header'

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'AutoRepair'],
    name: 'Vyper Solutions',
    description: 'Soluciones integrales industriales y automotrices.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Av. La Cantera 1916',
      addressLocality: 'Coquimbo',
      addressRegion: 'Coquimbo',
      addressCountry: 'CL',
    },
    telephone: '+56983464601',
    email: 'contacto@vypersolutions.cl',
  }

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-zinc-950 text-white" suppressHydrationWarning>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  )
}
