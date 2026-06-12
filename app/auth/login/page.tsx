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
      if (res.error === 'TEACHER_NOT_APPROVED') {
        setError('Ваш аккаунт учителя ожидает проверки администратором. Мы уведомим вас по email.')
      } else if (res.error === 'BLOCKED') {
        setError('Ваш аккаунт заблокирован. Обратитесь к администратору.')
      } else {
        setError('Неверный логин или пароль')
      }
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F7F6F2', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', fontFamily: 'Inter,sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '380px' }}>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '24px' }}>
            <div style={{ width: '36px', height: '36px', background: '#2563EB', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px', fontWeight: 900, color: '#fff', fontStyle: 'italic' }}>Q</div>
            <span style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A' }}>Qaz<span style={{ color: '#2563EB' }}>TestPrep</span></span>
          </Link>
          <h1 style={{ fontSize: '22px', fontWeight: 900, color: '#111', letterSpacing: '-.5px', marginBottom: '4px' }}>Добро пожаловать</h1>
          <p style={{ fontSize: '14px', color: '#999', fontWeight: 500 }}>Войди в аккаунт</p>
        </div>

        <div style={{ background: '#fff', border: '1px solid #E2E0D8', borderRadius: '24px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,.04)' }}>
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{ background: '#FEF2F2', border: '1.5px solid #FECACA', borderRadius: '12px', padding: '12px 14px', fontSize: '13px', color: '#DC2626', fontWeight: 600, marginBottom: '16px', lineHeight: 1.5 }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#111', marginBottom: '7px' }}>
                Никнейм или Email
              </label>
              <input type="text" value={login} onChange={e => setLogin(e.target.value)}
                placeholder="username или email@..." required
                style={{ width: '100%', fontFamily: 'Inter,sans-serif', fontSize: '14px', padding: '11px 14px', border: '1.5px solid #E2E0D8', borderRadius: '14px', background: '#F7F6F2', color: '#111', outline: 'none', boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '7px' }}>
                <label style={{ fontSize: '13px', fontWeight: 700, color: '#111' }}>Пароль</label>
                <Link href="/auth/reset-password" style={{ fontSize: '12px', fontWeight: 600, color: '#2563EB', textDecoration: 'none' }}>
                  Забыл пароль?
                </Link>
              </div>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required
                style={{ width: '100%', fontFamily: 'Inter,sans-serif', fontSize: '14px', padding: '11px 14px', border: '1.5px solid #E2E0D8', borderRadius: '14px', background: '#F7F6F2', color: '#111', outline: 'none', boxSizing: 'border-box' }} />
            </div>

            <button type="submit" disabled={loading}
              style={{ width: '100%', fontFamily: 'Inter,sans-serif', fontSize: '14px', fontWeight: 700, padding: '13px', border: 'none', borderRadius: '14px', background: loading ? '#93C5FD' : '#2563EB', color: '#fff', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Входим...' : 'Войти'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: '14px', color: '#999', marginTop: '20px', fontWeight: 500 }}>
          Нет аккаунта?{' '}
          <Link href="/auth/register" style={{ color: '#2563EB', fontWeight: 700, textDecoration: 'none' }}>
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  )
}
