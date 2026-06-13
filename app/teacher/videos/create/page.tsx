'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Link from 'next/link'

const SUBJECTS = ['Математика','История Казахстана','Физика','Химия','Биология','География','Информатика','Казахский язык','Русский язык']

type Course = { id: string; title: string }

export default function CreateVideoPage() {
  const router = useRouter()
  const [title, setTitle]           = useState('')
  const [subject, setSubject]       = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [duration, setDuration]     = useState('')
  const [courseId, setCourseId]     = useState('')
  const [courses, setCourses]       = useState<Course[]>([])
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState('')
  const [success, setSuccess]       = useState('')

  useEffect(() => {
    fetch('/api/teacher/courses')
      .then(r => r.json())
      .then(setCourses)
      .catch(() => {})
  }, [])

  const fi: React.CSSProperties = {
    width: '100%', fontFamily: 'Onest,sans-serif', fontSize: '14px', padding: '11px 14px',
    border: '1.5px solid #E2E0D8', borderRadius: '14px', background: '#F7F6F2', color: '#111',
    outline: 'none', boxSizing: 'border-box',
  }

  const valid = title.length >= 3 && subject && /^https?:\/\//.test(youtubeUrl)

  const handleSubmit = async () => {
    if (!valid) return
    setLoading(true); setError(''); setSuccess('')

    const res = await fetch('/api/teacher/videos', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title, subject, youtubeUrl,
        duration: duration || undefined,
        courseId: courseId || undefined,
      }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error); setLoading(false); return }

    // Сразу публикуем
    await fetch(`/api/teacher/videos/${data.id}/publish`, { method: 'PUT' })

    setSuccess('Видеоурок опубликован!')
    setLoading(false)
    setTimeout(() => router.push('/dashboard'), 1200)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F7F6F2', fontFamily: 'Onest,sans-serif' }}>
      <Navbar />
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 16px' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#999', marginBottom: '24px' }}>
          <Link href="/dashboard" style={{ color: '#2563EB', fontWeight: 600, textDecoration: 'none' }}>Кабинет</Link>
          <span>›</span>
          <span style={{ fontWeight: 600, color: '#111' }}>Новый видеоурок</span>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#111', letterSpacing: '-.5px', marginBottom: '4px' }}>Новый видеоурок</h1>
          <p style={{ fontSize: '14px', color: '#999' }}>Добавь видео с YouTube — ссылка должна быть публичной</p>
        </div>

        <div style={{ background: '#fff', border: '1px solid #E2E0D8', borderRadius: '24px', padding: '24px' }}>
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

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#111', marginBottom: '7px' }}>
              Название <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <input value={title} onChange={e => setTitle(e.target.value)}
              placeholder="Например: Квадратные уравнения — полный разбор" style={fi} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#111', marginBottom: '7px' }}>
                Предмет <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <select value={subject} onChange={e => setSubject(e.target.value)} style={{ ...fi, cursor: 'pointer' }}>
                <option value="">— Выберите —</option>
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#111', marginBottom: '7px' }}>
                Длительность
              </label>
              <input value={duration} onChange={e => setDuration(e.target.value)} placeholder="18:42" style={fi} />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#111', marginBottom: '7px' }}>
              Ссылка на YouTube <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <input value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..." style={fi} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#111', marginBottom: '7px' }}>
              Курс (необязательно)
            </label>
            <select value={courseId} onChange={e => setCourseId(e.target.value)} style={{ ...fi, cursor: 'pointer' }}>
              <option value="">— Без курса —</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
            <div style={{ fontSize: '12px', color: '#999', marginTop: '6px' }}>Прикрепи видео к курсу, если нужно</div>
          </div>

          <button onClick={handleSubmit} disabled={!valid || loading}
            style={{ width: '100%', fontFamily: 'Onest,sans-serif', fontSize: '15px', fontWeight: 700, padding: '13px', border: 'none', borderRadius: '14px', background: valid && !loading ? '#2563EB' : '#E2E0D8', color: valid && !loading ? '#fff' : '#999', cursor: valid && !loading ? 'pointer' : 'not-allowed' }}>
            {loading ? 'Публикуем...' : 'Опубликовать видеоурок →'}
          </button>
        </div>
      </div>
    </div>
  )
}
