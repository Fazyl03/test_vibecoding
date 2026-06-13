'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Link from 'next/link'

export default function JoinClassPage() {
  const router = useRouter()
  const [boxes, setBoxes]      = useState<string[]>(Array(6).fill(''))
  const [loading, setLoading]  = useState(false)
  const [error, setError]      = useState('')
  const [success, setSuccess]  = useState('')
  const inputs = useRef<(HTMLInputElement | null)[]>([])

  const code = boxes.join('')

  const handleChange = (idx: number, val: string) => {
    const char = val.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(-1)
    const next = [...boxes]
    next[idx] = char
    setBoxes(next)
    if (char && idx < 5) inputs.current[idx + 1]?.focus()
  }

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !boxes[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6)
    const next = Array(6).fill('')
    text.split('').forEach((c, i) => next[i] = c)
    setBoxes(next)
    inputs.current[Math.min(text.length, 5)]?.focus()
  }

  const handleSubmit = async () => {
    if (code.length !== 6) return
    setLoading(true); setError(''); setSuccess('')

    const res = await fetch('/api/student/join-class', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })
    const data = await res.json()

    if (!res.ok) { setError(data.error); setLoading(false); return }

    setSuccess(`Ты уже в классе «${data.className}»!`)
    setLoading(false)
    setTimeout(() => router.push('/dashboard'), 1800)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F7F6F2', fontFamily: 'Onest,sans-serif' }}>
      <style>{`
        @media (max-width: 768px) {
          .code-box { width: 44px !important; height: 52px !important; font-size: 18px !important; }
        }
      `}</style>
      <Navbar />
      <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>

          {/* Back link */}
          <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: '#2563EB', textDecoration: 'none', marginBottom: '28px' }}>
            ← Назад в Dashboard
          </Link>

          {/* Card */}
          <div style={{ background: '#fff', border: '1px solid #E2E0D8', borderRadius: '28px', padding: '36px 32px', boxShadow: '0 4px 32px rgba(0,0,0,.04)' }}>

            <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: '#EEF3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', margin: '0 auto 20px' }}>🏫</div>

            <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#111', textAlign: 'center', letterSpacing: '-.5px', marginBottom: '8px' }}>Войти в класс</h1>
            <p style={{ fontSize: '14px', color: '#999', textAlign: 'center', lineHeight: 1.6, marginBottom: '28px' }}>
              Введи 6-значный код, который дал тебе учитель
            </p>

            {/* Code boxes */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#111', marginBottom: '10px', textAlign: 'center' }}>Код класса</div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }} onPaste={handlePaste}>
                {boxes.map((char, i) => (
                  <input
                    key={i}
                    ref={el => { inputs.current[i] = el }}
                    className="code-box"
                    maxLength={1}
                    value={char}
                    onChange={e => handleChange(i, e.target.value)}
                    onKeyDown={e => handleKeyDown(i, e)}
                    style={{
                      width: '52px', height: '60px', textAlign: 'center', fontFamily: 'Onest,sans-serif',
                      fontSize: '22px', fontWeight: 900, borderRadius: '14px', outline: 'none',
                      border: `2px solid ${char ? '#2563EB' : '#E2E0D8'}`,
                      background: char ? '#EEF3FF' : '#F7F6F2',
                      color: char ? '#2563EB' : '#111',
                    }}
                  />
                ))}
              </div>
              <div style={{ textAlign: 'center', fontSize: '12px', color: '#999', marginTop: '10px', fontWeight: 500 }}>
                Код выглядит так: KZ7F2A
              </div>
            </div>

            {error && (
              <div style={{ background: '#FEF2F2', border: '1.5px solid #FECACA', borderRadius: '12px', padding: '12px 14px', fontSize: '13px', color: '#DC2626', fontWeight: 700, textAlign: 'center', marginBottom: '16px' }}>
                ⚠ {error}
              </div>
            )}
            {success && (
              <div style={{ background: '#F0FDF4', border: '1.5px solid #BBF7D0', borderRadius: '16px', padding: '16px 20px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0, color: '#fff' }}>✓</div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#16A34A' }}>{success}</div>
                  <div style={{ fontSize: '12px', color: '#16A34A', opacity: .8, marginTop: '2px' }}>Класс добавлен в твой Dashboard</div>
                </div>
              </div>
            )}

            <button onClick={handleSubmit} disabled={code.length !== 6 || loading}
              style={{
                width: '100%', fontFamily: 'Onest,sans-serif', fontSize: '15px', fontWeight: 800, padding: '15px',
                border: 'none', borderRadius: '14px', cursor: code.length === 6 && !loading ? 'pointer' : 'not-allowed',
                background: code.length === 6 && !loading ? '#2563EB' : '#E2E0D8',
                color: code.length === 6 && !loading ? '#fff' : '#999',
                boxShadow: code.length === 6 && !loading ? '0 4px 16px rgba(37,99,235,.25)' : 'none',
                transition: 'background .2s',
              }}>
              {loading ? 'Входим...' : 'Войти в класс →'}
            </button>

            <p style={{ textAlign: 'center', fontSize: '12px', color: '#999', marginTop: '14px', lineHeight: 1.5 }}>
              Попроси своего учителя поделиться кодом класса
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
