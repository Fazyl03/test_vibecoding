'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Link from 'next/link'

export default function JoinClassPage() {
  const router = useRouter()
  const [code, setCode]       = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError(''); setSuccess('')

    const res = await fetch('/api/student/join-class', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: code.toUpperCase() }),
    })
    const data = await res.json()

    if (!res.ok) { setError(data.error); setLoading(false); return }

    setSuccess(`Вы вступили в класс «${data.className}»!`)
    setTimeout(() => router.push('/dashboard'), 2000)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F7F6F2', fontFamily: 'Onest,sans-serif' }}>
      <Navbar />
      <div style={{ maxWidth: '440px', margin: '60px auto', padding: '0 16px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🏫</div>
          <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#111', marginBottom: '6px' }}>Войти в класс</h1>
          <p style={{ fontSize: '14px', color: '#999' }}>Введи 6-значный код от учителя</p>
        </div>

        <div style={{ background: '#fff', border: '1px solid #E2E0D8', borderRadius: '24px', padding: '28px' }}>
          {error && (
            <div style={{ background: '#FEF2F2', border: '1.5px solid #FECACA', borderRadius: '12px', padding: '12px 14px', fontSize: '13px', color: '#DC2626', fontWeight: 600, marginBottom: '16px' }}>
              ⚠ {error}
            </div>
          )}
          {success && (
            <div style={{ background: '#F0FDF4', border: '1.5px solid #BBF7D0', borderRadius: '12px', padding: '12px 14px', fontSize: '13px', color: '#16A34A', fontWeight: 600, marginBottom: '16px' }}>
              ✓ {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#111', marginBottom: '7px' }}>
                Код класса
              </label>
              <input
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))}
                placeholder="KZ7F2A"
                maxLength={6}
                required
                style={{ width: '100%', fontFamily: 'monospace', fontSize: '24px', fontWeight: 900, padding: '14px', border: '1.5px solid #E2E0D8', borderRadius: '14px', background: '#F7F6F2', color: '#111', outline: 'none', textAlign: 'center', letterSpacing: '6px', boxSizing: 'border-box' }}
              />
              <div style={{ fontSize: '12px', color: '#999', marginTop: '6px', textAlign: 'center' }}>
                {code.length}/6 символов
              </div>
            </div>

            <button type="submit" disabled={loading || code.length < 6}
              style={{ width: '100%', fontFamily: 'Onest,sans-serif', fontSize: '15px', fontWeight: 700, padding: '13px', border: 'none', borderRadius: '14px', background: code.length === 6 && !loading ? '#2563EB' : '#E2E0D8', color: code.length === 6 && !loading ? '#fff' : '#999', cursor: code.length === 6 && !loading ? 'pointer' : 'not-allowed' }}>
              {loading ? 'Входим...' : 'Войти в класс →'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: '13px', color: '#999', marginTop: '16px' }}>
          <Link href="/dashboard" style={{ color: '#2563EB', fontWeight: 600, textDecoration: 'none' }}>← Вернуться в кабинет</Link>
        </p>
      </div>
    </div>
  )
}
