'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Step = 'phone' | 'code'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [step, setStep]             = useState<Step>('phone')
  const [phone, setPhone]           = useState('')
  const [code, setCode]             = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [error, setError]           = useState('')
  const [loading, setLoading]       = useState(false)

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    const res = await fetch('/api/auth/reset-password/send', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error); setLoading(false); return }
    setStep('code'); setLoading(false)
  }

  const confirmReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    const res = await fetch('/api/auth/reset-password/confirm', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, code, newPassword }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error); setLoading(false); return }
    router.push('/auth/login?reset=true')
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
          <h1 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">Сброс пароля</h1>
          <p className="text-sm text-[#9A9A9A] mt-1">
            {step === 'phone' ? 'Введи номер телефона' : `Код отправлен на ${phone}`}
          </p>
        </div>

        <div className="bg-white border border-[#E8E8E4] rounded-2xl p-6">
          {error && <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}

          {step === 'phone' ? (
            <form onSubmit={sendOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Номер телефона</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+77XXXXXXXXX" required
                  className="w-full border border-[#E8E8E4] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#EEF3FF] transition"/>
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-[#2563EB] text-white font-semibold py-3 rounded-xl text-sm hover:bg-blue-700 transition disabled:opacity-60">
                {loading ? 'Отправляем...' : 'Получить код'}
              </button>
            </form>
          ) : (
            <form onSubmit={confirmReset} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Код из SMS</label>
                <input type="text" value={code} onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0,6))}
                  placeholder="000000" maxLength={6} required
                  className="w-full border border-[#E8E8E4] rounded-xl px-4 py-3 text-sm text-center tracking-[0.4em] text-lg font-bold focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#EEF3FF] transition"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Новый пароль</label>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Минимум 8 символов" minLength={8} required
                  className="w-full border border-[#E8E8E4] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#EEF3FF] transition"/>
              </div>
              <button type="submit" disabled={loading || code.length < 6}
                className="w-full bg-[#2563EB] text-white font-semibold py-3 rounded-xl text-sm hover:bg-blue-700 transition disabled:opacity-60">
                {loading ? 'Меняем пароль...' : 'Сменить пароль'}
              </button>
            </form>
          )}
        </div>
        <p className="text-center text-sm text-[#9A9A9A] mt-4">
          <Link href="/auth/login" className="text-[#2563EB] font-medium hover:underline">← Вернуться ко входу</Link>
        </p>
      </div>
    </div>
  )
}
