'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Что-то пошло не так')
      setLoading(false)
    } else {
      router.push('/auth/login?registered=true')
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 12L8 4L13 12H3Z" fill="white" />
              </svg>
            </div>
            <span className="font-bold text-[15px]">
              Qaz<span className="text-[#2563EB]">TestPrep</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">Создай аккаунт</h1>
          <p className="text-sm text-[#9A9A9A] mt-1">Бесплатно и быстро</p>
        </div>

        {/* Form */}
        <div className="bg-white border border-[#E8E8E4] rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                Имя
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Алибек"
                required
                className="w-full border border-[#E8E8E4] rounded-xl px-4 py-3 text-sm text-[#1A1A1A] placeholder:text-[#9A9A9A] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#EEF3FF] transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full border border-[#E8E8E4] rounded-xl px-4 py-3 text-sm text-[#1A1A1A] placeholder:text-[#9A9A9A] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#EEF3FF] transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                Пароль
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Минимум 8 символов"
                minLength={8}
                required
                className="w-full border border-[#E8E8E4] rounded-xl px-4 py-3 text-sm text-[#1A1A1A] placeholder:text-[#9A9A9A] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#EEF3FF] transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2563EB] text-white font-semibold py-3 rounded-xl text-sm hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Создаём аккаунт...' : 'Зарегистрироваться'}
            </button>

            <p className="text-xs text-[#9A9A9A] text-center">
              Регистрируясь, ты соглашаешься с{' '}
              <Link href="/terms" className="text-[#2563EB] hover:underline">условиями использования</Link>
            </p>
          </form>
        </div>

        <p className="text-center text-sm text-[#9A9A9A] mt-4">
          Уже есть аккаунт?{' '}
          <Link href="/auth/login" className="text-[#2563EB] font-medium hover:underline">
            Войти
          </Link>
        </p>
      </div>
    </div>
  )
}
