'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Link from 'next/link'

type Member = { id: string; joinedAt: string; student: { id: string; name: string; username: string; email: string } }
type Classroom = { id: string; name: string; code: string; createdAt: string; members: Member[]; _count: { members: number } }

export default function ClassroomPage() {
  const { id } = useParams<{ id: string }>()
  const [classroom, setClassroom] = useState<Classroom | null>(null)
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('')
  const [adding, setAdding] = useState(false)
  const [addError, setAddError] = useState('')
  const [addSuccess, setAddSuccess] = useState('')

  const load = async () => {
    setLoading(true)
    const res = await fetch(`/api/teacher/classrooms/${id}`)
    if (res.ok) setClassroom(await res.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [id])

  const handleAdd = async () => {
    if (!username.trim()) return
    setAdding(true); setAddError(''); setAddSuccess('')
    const res = await fetch(`/api/teacher/classrooms/${id}/members`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    })
    const data = await res.json()
    if (!res.ok) { setAddError(data.error); setAdding(false); return }
    setAddSuccess(`${data.studentName} добавлен в класс`)
    setUsername('')
    setAdding(false)
    load()
  }

  const handleRemove = async (studentId: string) => {
    await fetch(`/api/teacher/classrooms/${id}/members`, {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId }),
    })
    load()
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#F7F6F2', fontFamily: 'Onest,sans-serif' }}>
      <Navbar />
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 16px', textAlign: 'center', color: '#999' }}>Загружаем...</div>
    </div>
  )

  if (!classroom) return (
    <div style={{ minHeight: '100vh', background: '#F7F6F2', fontFamily: 'Onest,sans-serif' }}>
      <Navbar />
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 16px', textAlign: 'center' }}>
        <p style={{ color: '#999' }}>Класс не найден</p>
        <Link href="/teacher/classrooms" style={{ color: '#2563EB', fontWeight: 700 }}>← Назад</Link>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#F7F6F2', fontFamily: 'Onest,sans-serif' }}>
      <Navbar />
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 16px' }}>

        <div style={{ fontSize: '13px', color: '#999', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Link href="/dashboard" style={{ color: '#2563EB', fontWeight: 600, textDecoration: 'none' }}>Кабинет</Link>
          <span>›</span>
          <Link href="/teacher/classrooms" style={{ color: '#2563EB', fontWeight: 600, textDecoration: 'none' }}>Классы</Link>
          <span>›</span>
          <span style={{ color: '#111', fontWeight: 600 }}>{classroom.name}</span>
        </div>

        <div style={{ background: '#fff', border: '1px solid #E2E0D8', borderRadius: '24px', padding: '28px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#111', marginBottom: '6px' }}>{classroom.name}</h1>
              <p style={{ fontSize: '14px', color: '#999' }}>👥 {classroom._count.members} учеников</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#999', marginBottom: '6px' }}>Код класса</div>
              <div style={{ fontSize: '28px', fontWeight: 900, letterSpacing: '6px', color: '#2563EB', background: '#EEF3FF', padding: '10px 20px', borderRadius: '14px', fontFamily: 'monospace' }}>
                {classroom.code}
              </div>
              <div style={{ fontSize: '11px', color: '#999', marginTop: '6px' }}>Поделитесь кодом с учениками</div>
            </div>
          </div>
        </div>

        <div style={{ background: '#fff', border: '1px solid #E2E0D8', borderRadius: '20px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111', marginBottom: '14px' }}>Добавить ученика</h3>
          {addError && <div style={{ background: '#FEF2F2', border: '1.5px solid #FECACA', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', color: '#DC2626', fontWeight: 600, marginBottom: '10px' }}>⚠ {addError}</div>}
          {addSuccess && <div style={{ background: '#F0FDF4', border: '1.5px solid #BBF7D0', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', color: '#16A34A', fontWeight: 600, marginBottom: '10px' }}>✓ {addSuccess}</div>}
          <div style={{ display: 'flex', gap: '10px' }}>
            <input value={username} onChange={e => setUsername(e.target.value)}
              placeholder="Введите username ученика"
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              style={{ flex: 1, fontFamily: 'Onest,sans-serif', fontSize: '14px', padding: '11px 14px', border: '1.5px solid #E2E0D8', borderRadius: '12px', background: '#F7F6F2', color: '#111', outline: 'none' }} />
            <button onClick={handleAdd} disabled={adding || !username.trim()}
              style={{ fontFamily: 'Onest,sans-serif', fontSize: '14px', fontWeight: 700, padding: '11px 22px', border: 'none', borderRadius: '12px', background: username.trim() ? '#2563EB' : '#E2E0D8', color: username.trim() ? '#fff' : '#999', cursor: username.trim() ? 'pointer' : 'not-allowed', whiteSpace: 'nowrap' }}>
              {adding ? 'Добавляем...' : 'Добавить'}
            </button>
          </div>
        </div>

        <div style={{ background: '#fff', border: '1px solid #E2E0D8', borderRadius: '20px', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#111' }}>Список учеников</span>
            <span style={{ fontSize: '13px', color: '#999' }}>{classroom._count.members} чел.</span>
          </div>
          {classroom.members.length === 0 ? (
            <div style={{ padding: '48px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: '36px', marginBottom: '10px' }}>👨‍🎓</div>
              <p style={{ fontSize: '14px', color: '#999' }}>В классе пока нет учеников</p>
            </div>
          ) : (
            classroom.members.map((m, i) => (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: i < classroom.members.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#EEF3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, color: '#2563EB', flexShrink: 0 }}>
                    {m.student.name[0].toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#111' }}>{m.student.name}</div>
                    <div style={{ fontSize: '12px', color: '#999' }}>@{m.student.username}</div>
                  </div>
                </div>
                <button onClick={() => handleRemove(m.student.id)}
                  style={{ fontFamily: 'Onest,sans-serif', fontSize: '12px', fontWeight: 700, padding: '6px 14px', border: '1.5px solid #FECACA', borderRadius: '9px', background: '#FEF2F2', color: '#DC2626', cursor: 'pointer' }}>
                  Удалить
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
