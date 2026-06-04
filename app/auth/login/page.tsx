'use client'
import Link from 'next/link'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [login, setLogin]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    const res = await signIn('credentials', { login, password, redirect: false })
    if (res?.error) {
      setError(res.error === 'Аккаунт заблокирован' ? res.error : 'Неверный логин или пароль')
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F6F2] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-[#2563EB] rounded-xl flex items-center justify-center shadow-md shadow-blue-200">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 12L8 4L13 12H3Z" fill="white"/></svg>
            </div>
            <span className="font-black text-[15px]">Qaz<span className="text-[#2563EB]">TestPrep</span></span>
          </Link>
          <h1 className="text-2xl font-black text-[#111111] tracking-tight">Добро пожаловать</h1>
          <p className="text-sm text-[#999999] mt-1 font-medium">Войди в аккаунт</p>
        </div>

        <div className="bg-white border border-[#E2E0D8] rounded-3xl p-7 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-2xl font-medium">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-bold text-[#111111] mb-2">Никнейм или Email</label>
              <input type="text" value={login} onChange={e => setLogin(e.target.value)}
                placeholder="username или email@..." required
                className="w-full border border-[#E2E0D8] bg-[#F7F6F2] rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#EEF3FF] focus:bg-white transition"/>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-[#111111]">Пароль</label>
                <Link href="/auth/reset-password" className="text-xs font-semibold text-[#2563EB] hover:text-[#1A44C2] transition">
                  Забыл пароль?
                </Link>
              </div>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required
                className="w-full border border-[#E2E0D8] bg-[#F7F6F2] rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#EEF3FF] focus:bg-white transition"/>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-[#2563EB] text-white font-bold py-3.5 rounded-2xl text-sm hover:bg-[#1A44C2] transition-all shadow-md shadow-blue-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2">
              {loading ? 'Входим...' : 'Войти'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-[#999999] mt-5 font-medium">
          Нет аккаунта?{' '}
          <Link href="/auth/register" className="text-[#2563EB] font-bold hover:text-[#1A44C2] transition">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  )
}
