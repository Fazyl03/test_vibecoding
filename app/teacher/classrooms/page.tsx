'use client'
import { useEffect, useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Link from 'next/link'

type Classroom = {
  id: string
  name: string
  code: string
  createdAt: string
  _count: { members: number }
}

export default function ClassroomsPage() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    const res = await fetch('/api/teacher/classrooms')
    if (res.ok) setClassrooms(await res.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleCreate = async () => {
    if (!name.trim()) return
    setCreating(true); setError('')
    const res = await fetch('/api/teacher/classrooms', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error); setCreating(false); return }
    setName(''); setShowForm(false); setCreating(false)
    load()
  }

  const totalStudents = classrooms.reduce((s, c) => s + c._count.members, 0)

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div style={{ minHeight: '100vh', background: '#F7F6F2', fontFamily: 'Onest,sans-serif' }}>
      <style>{`@media(max-width:768px){.stats-row{grid-template-columns:1fr!important}}`}</style>
      <Navbar />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 16px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#111', letterSpacing: '-.5px', marginBottom: '4px' }}>Мои классы</h1>
            <p style={{ fontSize: '14px', color: '#999' }}>Управляй классами и учениками</p>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            style={{ fontFamily: 'Onest,sans-serif', fontSize: '14px', fontWeight: 700, padding: '11px 22px', border: 'none', borderRadius: '12px', background: '#2563EB', color: '#fff', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '7px' }}>
            + Создать класс
          </button>
        </div>

        {/* Create form */}
        {showForm && (
          <div style={{ background: '#fff', border: '1.5px solid #BFCFFF', borderRadius: '20px', padding: '20px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px' }}>Новый класс</h3>
            {error && <div style={{ background: '#FEF2F2', border: '1.5px solid #FECACA', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', color: '#DC2626', fontWeight: 600, marginBottom: '12px' }}>⚠ {error}</div>}
            <div style={{ display: 'flex', gap: '10px' }}>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Например: 11 «А» — Математика"
                style={{ flex: 1, fontFamily: 'Onest,sans-serif', fontSize: '14px', padding: '11px 14px', border: '1.5px solid #E2E0D8', borderRadius: '12px', background: '#F7F6F2', color: '#111', outline: 'none' }} />
              <button onClick={handleCreate} disabled={creating || !name.trim()}
                style={{ fontFamily: 'Onest,sans-serif', fontSize: '14px', fontWeight: 700, padding: '11px 22px', border: 'none', borderRadius: '12px', background: name.trim() ? '#2563EB' : '#E2E0D8', color: name.trim() ? '#fff' : '#999', cursor: name.trim() ? 'pointer' : 'not-allowed', whiteSpace: 'nowrap' }}>
                {creating ? 'Создаём...' : 'Создать'}
              </button>
              <button onClick={() => setShowForm(false)}
                style={{ fontFamily: 'Onest,sans-serif', fontSize: '14px', fontWeight: 600, padding: '11px 16px', border: '1.5px solid #E2E0D8', borderRadius: '12px', background: 'transparent', color: '#444', cursor: 'pointer' }}>
                Отмена
              </button>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="stats-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginBottom: '28px' }}>
          {[
            { icon: '🏫', bg: '#EEF3FF', val: classrooms.length, label: 'Всего классов' },
            { icon: '👨‍🎓', bg: '#F0FDF4', val: totalStudents, label: 'Учеников всего' },
            { icon: '📝', bg: '#FFFBEB', val: 0, label: 'Квизов в классах' },
          ].map((s, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid #E2E0D8', borderRadius: '20px', padding: '20px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', marginBottom: '12px' }}>{s.icon}</div>
              <div style={{ fontSize: '28px', fontWeight: 900, color: '#111', marginBottom: '2px' }}>{s.val}</div>
              <div style={{ fontSize: '13px', color: '#999' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999', fontSize: '14px' }}>Загружаем...</div>
        ) : classrooms.length === 0 ? (
          <div style={{ background: '#fff', border: '1px solid #E2E0D8', borderRadius: '20px', padding: '48px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🏫</div>
            <p style={{ fontSize: '14px', color: '#999', marginBottom: '16px' }}>У вас пока нет классов</p>
            <button onClick={() => setShowForm(true)}
              style={{ fontFamily: 'Onest,sans-serif', fontSize: '13px', fontWeight: 700, padding: '10px 22px', border: 'none', borderRadius: '10px', background: '#2563EB', color: '#fff', cursor: 'pointer' }}>
              + Создать первый класс
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {classrooms.map(c => (
              <Link key={c.id} href={`/teacher/classrooms/${c.id}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: '#fff', border: '1px solid #E2E0D8', borderRadius: '20px', padding: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', transition: 'all .2s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#EEF3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>🏫</div>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: 800, color: '#111', marginBottom: '4px' }}>{c.name}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#999' }}>
                        <span>👥 {c._count.members} учеников</span>
                        <span>·</span>
                        <span style={{ background: '#F7F6F2', border: '1px solid #E2E0D8', borderRadius: '8px', padding: '2px 9px', fontSize: '12px', fontWeight: 700, color: '#444', letterSpacing: '1px' }}>{c.code}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '12px', color: '#999' }}>Создан</div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#111' }}>{formatDate(c.createdAt)}</div>
                    </div>
                    <span style={{ color: '#999', fontSize: '18px' }}>›</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
