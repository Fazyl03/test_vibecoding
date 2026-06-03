import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'QazTestPrep — Подготовка к ЕНТ',
  description: 'Платформа для подготовки к ЕНТ. Тестовые задания, видеоуроки и разборы.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}
