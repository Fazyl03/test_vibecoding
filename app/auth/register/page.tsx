'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Step = 'form' | 'otp'

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep]         = useState<Step>('form')
  const [name, setName]         = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole]         = useState<'STUDENT'|'TEACHER'>('STUDENT')
  const [code, setCode]         = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [devCode, setDevCode]   = useState('')

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 15000)
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
        signal: controller.signal,
      })
      clearTimeout(timeout)
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Ошибка отправки'); return }
      if (data.devCode) setDevCode(data.devCode)
      setStep('otp')
    } catch (err: any) {
      setError(err?.name === 'AbortError' ? 'Превышено время ожидания.' : 'Ошибка соединения.')
    } finally {
      setLoading(false)
    }
  }

  const confirmRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, email, password, role, code }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      router.push('/auth/login?registered=true')
    } catch {
      setError('Ошибка соединения.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 12L8 4L13 12H3Z" fill="white"/></svg>
            </div>
            <span className="font-bold text-[15px]">Qaz<span className="text-[#2563EB]">TestPrep</span></span>
          </Link>
          <h1 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">
            {step === 'form' ? 'Создай аккаунт' : 'Подтверди email'}
          </h1>
          <p className="text-sm text-[#9A9A9A] mt-1">
            {step === 'form' ? 'Бесплатно и быстро' : `Код отправлен на ${email}`}
          </p>
        </div>

        <div className="bg-white border border-[#E8E8E4] rounded-2xl p-6">
          {error && <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}

          {step === 'form' ? (
            <form onSubmit={sendOtp} className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {(['STUDENT', 'TEACHER'] as const).map(r => (
                  <button type="button" key={r} onClick={() => setRole(r)}
                    className={`py-2.5 rounded-xl text-sm font-medium border transition ${role === r ? 'bg-[#2563EB] text-white border-[#2563EB]' : 'border-[#E8E8E4] text-[#4A4A4A] hover:border-[#2563EB]'}`}>
                    {r === 'STUDENT' ? '🎓 Ученик' : '👨‍🏫 Учитель'}
                  </button>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Имя</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Алибек" required
                  className="w-full border border-[#E8E8E4] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#EEF3FF] transition"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Никнейм</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="alibek_03" required
                  className="w-full border border-[#E8E8E4] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#EEF3FF] transition"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required
                  className="w-full border border-[#E8E8E4] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#EEF3FF] transition"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Пароль</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Минимум 8 символов" minLength={8} required
                  className="w-full border border-[#E8E8E4] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#EEF3FF] transition"/>
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-[#2563EB] text-white font-semibold py-3 rounded-xl text-sm hover:bg-blue-700 transition disabled:opacity-60">
                {loading ? 'Отправляем код...' : 'Получить код на email'}
              </button>
            </form>
          ) : (
            <form onSubmit={confirmRegister} className="space-y-4">
              {devCode && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-3 rounded-xl text-center">
                  <p className="text-xs font-medium mb-1">⚠️ Dev — письмо не ушло</p>
                  <p className="text-2xl font-bold tracking-widest">{devCode}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Код из письма</label>
                <input type="text" value={code}
                  onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000" maxLength={6} required
                  className="w-full border border-[#E8E8E4] rounded-xl px-4 py-3 text-sm text-center tracking-[0.4em] text-xl font-bold focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#EEF3FF] transition"/>
              </div>
              <button type="submit" disabled={loading || code.length < 6}
                className="w-full bg-[#2563EB] text-white font-semibold py-3 rounded-xl text-sm hover:bg-blue-700 transition disabled:opacity-60">
                {loading ? 'Создаём аккаунт...' : 'Подтвердить'}
              </button>
              <button type="button" onClick={() => { setStep('form'); setCode(''); setError(''); setDevCode('') }}
                className="w-full text-sm text-[#9A9A9A] hover:text-[#1A1A1A] transition py-1">
                ← Изменить данные
              </button>
            </form>
          )}
        </div>
        <p className="text-center text-sm text-[#9A9A9A] mt-4">
          Уже есть аккаунт?{' '}
          <Link href="/auth/login" className="text-[#2563EB] font-medium hover:underline">Войти</Link>
        </p>
      </div>
    </div>
  )
}
