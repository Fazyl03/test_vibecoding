import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/components/Providers'

export const metadata: Metadata = {
  title: 'QazTestPrep — Подготовка к ЕНТ',
  description: 'Платформа для подготовки к ЕНТ. Квизы, видеоуроки, разборы.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
