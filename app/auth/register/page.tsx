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
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }), signal: controller.signal,
      })
      clearTimeout(timeout)
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Ошибка отправки'); return }
      if (data.devCode) setDevCode(data.devCode)
      setStep('otp')
    } catch (err: any) {
      setError(err?.name === 'AbortError' ? 'Превышено время ожидания.' : 'Ошибка соединения.')
    } finally { setLoading(false) }
  }

  const confirmRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, email, password, role, code }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      router.push('/auth/login?registered=true')
    } catch { setError('Ошибка соединения.') }
    finally { setLoading(false) }
  }

  const inputCls = "w-full border border-[#E2E0D8] bg-[#F7F6F2] rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#EEF3FF] focus:bg-white transition"
  const labelCls = "block text-sm font-bold text-[#111111] mb-2"

  return (
    <div className="min-h-screen bg-[#F7F6F2] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-[#2563EB] rounded-xl flex items-center justify-center shadow-md shadow-blue-200">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 12L8 4L13 12H3Z" fill="white"/></svg>
            </div>
            <span className="font-black text-[15px]">Qaz<span className="text-[#2563EB]">TestPrep</span></span>
          </Link>
          <h1 className="text-2xl font-black text-[#111111] tracking-tight">
            {step === 'form' ? 'Создай аккаунт' : 'Подтверди email'}
          </h1>
          <p className="text-sm text-[#999999] mt-1 font-medium">
            {step === 'form' ? 'Бесплатно и быстро' : `Код отправлен на ${email}`}
          </p>
        </div>

        <div className="bg-white border border-[#E2E0D8] rounded-3xl p-7 shadow-sm">
          {error && <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-2xl font-medium mb-4">{error}</div>}

          {step === 'form' ? (
            <form onSubmit={sendOtp} className="space-y-4">
              {/* Role selector */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-[#F7F6F2] rounded-2xl">
                {(['STUDENT', 'TEACHER'] as const).map(r => (
                  <button type="button" key={r} onClick={() => setRole(r)}
                    className={`py-2.5 rounded-xl text-sm font-bold transition-all ${
                      role === r
                        ? 'bg-white text-[#2563EB] shadow-sm border border-[#E2E0D8]'
                        : 'text-[#999999] hover:text-[#444444]'
                    }`}>
                    {r === 'STUDENT' ? '🎓 Ученик' : '👨‍🏫 Учитель'}
                  </button>
                ))}
              </div>

              <div>
                <label className={labelCls}>Имя</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Алибек" required className={inputCls}/>
              </div>
              <div>
                <label className={labelCls}>Никнейм</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="alibek_03" required className={inputCls}/>
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required className={inputCls}/>
              </div>
              <div>
                <label className={labelCls}>Пароль</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Минимум 8 символов" minLength={8} required className={inputCls}/>
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-[#2563EB] text-white font-bold py-3.5 rounded-2xl text-sm hover:bg-[#1A44C2] transition-all shadow-md shadow-blue-200 disabled:opacity-60 mt-2">
                {loading ? 'Отправляем код...' : 'Получить код на email'}
              </button>
            </form>
          ) : (
            <form onSubmit={confirmRegister} className="space-y-4">
              {devCode && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center">
                  <p className="text-xs font-bold text-amber-700 mb-2">⚠️ Dev режим — письмо не отправлено</p>
                  <p className="text-3xl font-black tracking-[0.3em] text-amber-800">{devCode}</p>
                </div>
              )}
              <div>
                <label className={labelCls}>Код из письма</label>
                <input type="text" value={code}
                  onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000" maxLength={6} required
                  className="w-full border border-[#E2E0D8] bg-[#F7F6F2] rounded-2xl px-4 py-4 text-center tracking-[0.5em] text-2xl font-black focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#EEF3FF] focus:bg-white transition"/>
              </div>
              <button type="submit" disabled={loading || code.length < 6}
                className="w-full bg-[#2563EB] text-white font-bold py-3.5 rounded-2xl text-sm hover:bg-[#1A44C2] transition-all shadow-md shadow-blue-200 disabled:opacity-60">
                {loading ? 'Создаём аккаунт...' : 'Подтвердить'}
              </button>
              <button type="button" onClick={() => { setStep('form'); setCode(''); setError(''); setDevCode('') }}
                className="w-full text-sm font-semibold text-[#999999] hover:text-[#444444] transition py-1">
                ← Изменить данные
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-[#999999] mt-5 font-medium">
          Уже есть аккаунт?{' '}
          <Link href="/auth/login" className="text-[#2563EB] font-bold hover:text-[#1A44C2] transition">Войти</Link>
        </p>
      </div>
    </div>
  )
}
