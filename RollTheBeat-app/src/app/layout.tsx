import type { Metadata } from 'next'
import '@/styles/globals.css'
import '@/styles/catalog.css'
import '@/styles/collapsible.css'
export const metadata: Metadata = {
  title: 'Roll The Beat',
  description: 'Le jeu musical en temps réel',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
