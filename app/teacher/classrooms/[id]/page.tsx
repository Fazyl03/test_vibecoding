'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Link from 'next/link'

type Member = { id: string; student: { id: string; name: string; username: string; email: string }; joinedAt: string }
type ClassroomData = {
  id: string; name: string; code: string; createdAt: string
  members: Member[]
  _count: { members: number }
}

const AVATAR_COLORS = [
  { bg: '#EEF3FF', color: '#2563EB' }, { bg: '#F0FDF4', color: '#16A34A' },
  { bg: '#F5F3FF', color: '#7C3AED' }, { bg: '#FFFBEB', color: '#D97706' },
  { bg: '#FFF0F0', color: '#DC2626' },
]

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

export default function ClassroomDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [classroom, setClassroom] = useState<ClassroomData | null>(null)
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('')
  const [adding, setAdding] = useState(false)
  const [addError, setAddError] = useState('')
  const [addSuccess, setAddSuccess] = useState('')
  const [search, setSearch] = useState('')
  const [copied, setCopied] = useState(false)

  const load = async () => {
    setLoading(true)
    const res = await fetch(`/api/teacher/classrooms/${id}`)
    if (res.ok) setClassroom(await res.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [id])

  const handleAddMember = async () => {
    if (!username.trim()) return
    setAdding(true); setAddError(''); setAddSuccess('')
    const res = await fetch(`/api/teacher/classrooms/${id}/members`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    })
    const data = await res.json()
    if (!res.ok) { setAddError(data.error); setAdding(false); return }
    setUsername(''); setAdding(false)
    setAddSuccess(`✓ ${data.student.name} добавлен в класс`)
    load()
  }

  const handleRemoveMember = async (studentId: string) => {
    if (!confirm('Удалить ученика из класса?')) return
    await fetch(`/api/teacher/classrooms/${id}/members`, {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId }),
    })
    load()
  }

  const copyCode = () => {
    if (!classroom) return
    navigator.clipboard.writeText(classroom.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })

  const filtered = classroom?.members.filter(m =>
    m.student.name.toLowerCase().includes(search.toLowerCase()) ||
    m.student.username.toLowerCase().includes(search.toLowerCase())
  ) ?? []

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#F7F6F2', fontFamily: 'Onest,sans-serif' }}>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '80px 20px', color: '#999', fontSize: '14px' }}>Загружаем...</div>
    </div>
  )

  if (!classroom) return (
    <div style={{ minHeight: '100vh', background: '#F7F6F2', fontFamily: 'Onest,sans-serif' }}>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</div>
        <p style={{ fontSize: '14px', color: '#999' }}>Класс не найден</p>
        <Link href="/teacher/classrooms" style={{ color: '#2563EB', fontWeight: 700, textDecoration: 'none', fontSize: '14px', marginTop: '12px', display: 'inline-block' }}>← Вернуться к классам</Link>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#F7F6F2', fontFamily: 'Onest,sans-serif' }}>
      <style>{`@media(max-width:768px){.detail-grid{grid-template-columns:1fr!important}}`}</style>
      <Navbar />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 16px' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#999', marginBottom: '24px' }}>
          <Link href="/teacher/classrooms" style={{ color: '#2563EB', fontWeight: 600, textDecoration: 'none' }}>Мои классы</Link>
          <span>›</span>
          <span style={{ fontWeight: 600, color: '#111' }}>{classroom.name}</span>
        </div>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#111', letterSpacing: '-.5px', marginBottom: '6px' }}>{classroom.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#999' }}>
              <span>👥 {classroom._count.members} учеников</span>
              <span>·</span>
              <span>Создан {formatDate(classroom.createdAt)}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => { if (confirm('Удалить класс? Это действие нельзя отменить.')) {} }}
              style={{ fontFamily: 'Onest,sans-serif', fontSize: '12px', fontWeight: 700, padding: '8px 14px', border: '1.5px solid #FECACA', borderRadius: '10px', background: '#FEF2F2', color: '#DC2626', cursor: 'pointer' }}>
              Удалить класс
            </button>
          </div>
        </div>

        <div className="detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Left */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Code card */}
            <div style={{ background: 'linear-gradient(135deg,#2563EB,#1A44C2)', borderRadius: '20px', padding: '28px', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,.65)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Код для вступления</div>
              <div style={{ fontSize: '44px', fontWeight: 900, color: '#fff', letterSpacing: '8px', fontFamily: 'Instrument Serif,serif', marginBottom: '10px' }}>{classroom.code}</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,.6)', marginBottom: '16px' }}>
                Поделись этим кодом с учениками — они вводят его на странице входа в класс
              </div>
              <button onClick={copyCode}
                style={{ fontFamily: 'Onest,sans-serif', fontSize: '13px', fontWeight: 700, padding: '8px 20px', border: '1.5px solid rgba(255,255,255,.3)', borderRadius: '10px', background: 'rgba(255,255,255,.15)', color: '#fff', cursor: 'pointer' }}>
                {copied ? '✓ Скопировано!' : '📋 Скопировать код'}
              </button>
            </div>

            {/* Mini stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ background: '#fff', border: '1px solid #E2E0D8', borderRadius: '16px', padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontWeight: 900, color: '#2563EB' }}>{classroom._count.members}</div>
                <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>Учеников</div>
              </div>
              <div style={{ background: '#fff', border: '1px solid #E2E0D8', borderRadius: '16px', padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontWeight: 900, color: '#16A34A' }}>—</div>
                <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>Ср. активность</div>
              </div>
            </div>

            {/* Add student */}
            <div style={{ background: '#fff', border: '1px solid #E2E0D8', borderRadius: '20px', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ fontSize: '15px', fontWeight: 700 }}>➕ Добавить ученика</span>
              </div>
              <div style={{ padding: '20px' }}>
                {addError && (
                  <div style={{ background: '#FEF2F2', border: '1.5px solid #FECACA', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', color: '#DC2626', fontWeight: 600, marginBottom: '12px' }}>
                    ⚠ {addError}
                  </div>
                )}
                {addSuccess && (
                  <div style={{ background: '#F0FDF4', border: '1.5px solid #BBF7D0', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', color: '#16A34A', fontWeight: 600, marginBottom: '12px' }}>
                    {addSuccess}
                  </div>
                )}
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#111', marginBottom: '7px' }}>
                  Username ученика <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input value={username} onChange={e => setUsername(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddMember()}
                    placeholder="Например: aigerim_s"
                    style={{ flex: 1, fontFamily: 'Onest,sans-serif', fontSize: '14px', padding: '11px 14px', border: '1.5px solid #E2E0D8', borderRadius: '12px', background: '#F7F6F2', color: '#111', outline: 'none' }} />
                  <button onClick={handleAddMember} disabled={adding || !username.trim()}
                    style={{ fontFamily: 'Onest,sans-serif', fontSize: '14px', fontWeight: 700, padding: '11px 18px', border: 'none', borderRadius: '12px', background: username.trim() ? '#2563EB' : '#E2E0D8', color: username.trim() ? '#fff' : '#999', cursor: username.trim() ? 'pointer' : 'not-allowed', whiteSpace: 'nowrap' }}>
                    {adding ? '...' : 'Добавить'}
                  </button>
                </div>
                <div style={{ fontSize: '12px', color: '#999', marginTop: '6px' }}>Ученик должен быть зарегистрирован на платформе</div>
              </div>
            </div>
          </div>

          {/* Right: students list */}
          <div style={{ background: '#fff', border: '1px solid #E2E0D8', borderRadius: '20px', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '15px', fontWeight: 700 }}>👥 Ученики ({classroom._count.members})</span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск..."
                style={{ fontFamily: 'Onest,sans-serif', fontSize: '13px', padding: '6px 12px', border: '1.5px solid #E2E0D8', borderRadius: '9px', background: '#F7F6F2', outline: 'none', width: '140px' }} />
            </div>
            <div style={{ padding: '0 20px' }}>
              {filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 0', color: '#999', fontSize: '14px' }}>
                  {search ? 'Ничего не найдено' : 'В классе пока нет учеников'}
                </div>
              ) : (
                filtered.map((m, i) => {
                  const ac = AVATAR_COLORS[i % AVATAR_COLORS.length]
                  return (
                    <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < filtered.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: ac.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, color: ac.color, flexShrink: 0 }}>
                          {initials(m.student.name)}
                        </div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 700, color: '#111' }}>{m.student.name}</div>
                          <div style={{ fontSize: '12px', color: '#999', marginTop: '1px' }}>@{m.student.username}</div>
                        </div>
                      </div>
                      <button onClick={() => handleRemoveMember(m.student.id)}
                        style={{ fontFamily: 'Onest,sans-serif', fontSize: '12px', fontWeight: 700, padding: '6px 13px', border: '1.5px solid #FECACA', borderRadius: '9px', background: '#FEF2F2', color: '#DC2626', cursor: 'pointer' }}>
                        Удалить
                      </button>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
