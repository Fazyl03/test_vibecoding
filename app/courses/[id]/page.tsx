'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'

type Quiz  = { id: string; title: string; subject: string; duration: number }
type Video = { id: string; title: string; subject: string; duration: string | null; youtubeUrl: string }
type CourseData = {
  id: string; title: string; description: string | null; price: number; type: string
  teacher: { name: string }
  quizzes: Quiz[]
  videos: Video[]
  hasAccess: boolean
}

const TYPE_LABEL: Record<string, string> = { ENT: 'ЕНТ', PBB: 'ПББ', COMBO: 'Комбо' }
const COVER_GRADIENT: Record<string, string> = {
  ENT: 'linear-gradient(135deg,#1E3A8A,#2563EB)',
  PBB: 'linear-gradient(135deg,#78350f,#D97706)',
  COMBO: 'linear-gradient(135deg,#4c1d95,#7C3AED)',
}
const COVER_EMOJI: Record<string, string> = { ENT: '📐', PBB: '🏛️', COMBO: '⭐' }

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [course, setCourse] = useState<CourseData | null>(null)
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/courses/${id}`)
      .then(r => r.json())
      .then(data => { setCourse(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  const handlePurchase = async () => {
    setPurchasing(true); setError('')
    const res = await fetch('/api/student/purchase', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId: id }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error); setPurchasing(false); return }
    setCourse(c => c ? { ...c, hasAccess: true } : c)
    setPurchasing(false)
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#F7F6F2', fontFamily: 'Onest,sans-serif' }}>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '80px 20px', color: '#999' }}>Загружаем...</div>
    </div>
  )

  if (!course) return (
    <div style={{ minHeight: '100vh', background: '#F7F6F2', fontFamily: 'Onest,sans-serif' }}>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</div>
        <p style={{ color: '#999', fontSize: '14px' }}>Курс не найден</p>
        <Link href="/courses" style={{ color: '#2563EB', fontWeight: 700, textDecoration: 'none', fontSize: '14px', marginTop: '12px', display: 'inline-block' }}>← К каталогу курсов</Link>
      </div>
    </div>
  )

  const gradient = COVER_GRADIENT[course.type] ?? COVER_GRADIENT.ENT
  const emoji = COVER_EMOJI[course.type] ?? '📚'

  return (
    <div style={{ minHeight: '100vh', background: '#F7F6F2', fontFamily: 'Onest,sans-serif' }}>
      <style>{`
        .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        @media (max-width: 768px) { .grid2 { grid-template-columns: 1fr; } .hero-emoji { display: none !important; } }
      `}</style>
      <Navbar />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 16px' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#999', marginBottom: '24px' }}>
          <Link href="/courses" style={{ color: '#2563EB', fontWeight: 600, textDecoration: 'none' }}>Курсы</Link>
          <span>›</span>
          <span style={{ fontWeight: 600, color: '#111' }}>{course.title}</span>
        </div>

        {/* Hero */}
        <div style={{ background: gradient, borderRadius: '24px', padding: '40px 32px', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
          <div className="hero-emoji" style={{ position: 'absolute', inset: 0, opacity: .5, fontSize: '160px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '40px', pointerEvents: 'none' }}>{emoji}</div>
          <div style={{ position: 'relative', maxWidth: '600px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: '11px', fontWeight: 700, padding: '3px 9px', borderRadius: '7px', textTransform: 'uppercase', letterSpacing: '.3px', background: 'rgba(255,255,255,.2)', color: '#fff' }}>
                {TYPE_LABEL[course.type] ?? course.type}
              </span>
              {course.hasAccess && (
                <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: '11px', fontWeight: 700, padding: '3px 9px', borderRadius: '7px', textTransform: 'uppercase', letterSpacing: '.3px', background: '#16A34A', color: '#fff' }}>
                  ✓ КУПЛЕНО
                </span>
              )}
            </div>
            <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#fff', letterSpacing: '-.5px', lineHeight: 1.2, marginBottom: '12px' }}>{course.title}</h1>
            {course.description && (
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,.85)', lineHeight: 1.6, marginBottom: '16px' }}>{course.description}</p>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 800, color: '#fff' }}>
                {initials(course.teacher.name)}
              </div>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>{course.teacher.name}</span>
            </div>
          </div>
        </div>

        <div className="grid2">
          {/* Left content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {course.hasAccess && (
              <div style={{ background: '#fff', border: '1px solid #E2E0D8', borderRadius: '20px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>🎯</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#111', marginBottom: '4px' }}>Твой прогресс по курсу</div>
                  <div style={{ fontSize: '12px', color: '#999' }}>{course.quizzes.length} квизов · {course.videos.length} видео доступно</div>
                </div>
              </div>
            )}

            {/* Quizzes */}
            <div style={{ background: '#fff', border: '1px solid #E2E0D8', borderRadius: '20px', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '15px', fontWeight: 800, color: '#111' }}>📝 Квизы курса ({course.quizzes.length})</span>
                {course.hasAccess ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 700, color: '#2563EB', background: '#EEF3FF', padding: '5px 11px', borderRadius: '8px' }}>🔓 Доступно</span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 700, color: '#999', background: '#F7F6F2', border: '1px solid #E2E0D8', padding: '5px 11px', borderRadius: '8px' }}>🔒 Заблокировано</span>
                )}
              </div>
              <div style={{ padding: '20px' }}>
                {course.quizzes.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#999', fontSize: '13px', padding: '12px 0' }}>Квизы пока не добавлены</div>
                ) : course.quizzes.map((q, i) => (
                  <div key={q.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: i < course.quizzes.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '11px', background: '#EEF3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>📐</div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#111' }}>{q.title}</div>
                        <div style={{ fontSize: '12px', color: '#999', marginTop: '1px' }}>{q.subject} · {q.duration} мин</div>
                      </div>
                    </div>
                    {course.hasAccess ? (
                      <Link href={`/quiz/${q.id}`} style={{ fontFamily: 'Onest,sans-serif', fontSize: '12px', fontWeight: 700, padding: '7px 15px', border: 'none', borderRadius: '9px', background: '#2563EB', color: '#fff', textDecoration: 'none' }}>
                        Начать
                      </Link>
                    ) : (
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#999', background: '#F7F6F2', border: '1px solid #E2E0D8', padding: '5px 11px', borderRadius: '8px' }}>🔒</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Videos */}
            <div style={{ background: '#fff', border: '1px solid #E2E0D8', borderRadius: '20px', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '15px', fontWeight: 800, color: '#111' }}>🎬 Видеоуроки курса ({course.videos.length})</span>
                {course.hasAccess ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 700, color: '#2563EB', background: '#EEF3FF', padding: '5px 11px', borderRadius: '8px' }}>🔓 Доступно</span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 700, color: '#999', background: '#F7F6F2', border: '1px solid #E2E0D8', padding: '5px 11px', borderRadius: '8px' }}>🔒 Заблокировано</span>
                )}
              </div>
              <div style={{ padding: '20px' }}>
                {course.videos.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#999', fontSize: '13px', padding: '12px 0' }}>Видео пока не добавлены</div>
                ) : course.videos.map((v, i) => (
                  <div key={v.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: i < course.videos.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '11px', background: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>▶️</div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#111' }}>{v.title}</div>
                        <div style={{ fontSize: '12px', color: '#999', marginTop: '1px' }}>{v.duration ?? v.subject}</div>
                      </div>
                    </div>
                    {course.hasAccess ? (
                      <a href={v.youtubeUrl} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'Onest,sans-serif', fontSize: '12px', fontWeight: 700, padding: '7px 15px', border: 'none', borderRadius: '9px', background: '#2563EB', color: '#fff', textDecoration: 'none' }}>
                        Смотреть
                      </a>
                    ) : (
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#999', background: '#F7F6F2', border: '1px solid #E2E0D8', padding: '5px 11px', borderRadius: '8px' }}>🔒</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: purchase / status panel */}
          <div>
            {course.hasAccess ? (
              <div style={{ background: '#fff', border: '1px solid #E2E0D8', borderRadius: '20px', padding: '20px', textAlign: 'center', position: 'sticky', top: '84px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#F0FDF4', border: '3px solid #BBF7D0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', margin: '0 auto 16px' }}>✓</div>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#111', marginBottom: '6px' }}>Курс куплен!</div>
                <div style={{ fontSize: '13px', color: '#999', lineHeight: 1.6, marginBottom: '20px' }}>У тебя есть полный доступ ко всем материалам курса навсегда.</div>
                <Link href="/courses" style={{ fontFamily: 'Onest,sans-serif', fontSize: '14px', fontWeight: 700, padding: '11px 22px', border: '1.5px solid #E2E0D8', borderRadius: '12px', color: '#444', textDecoration: 'none', width: '100%', boxSizing: 'border-box', display: 'block', textAlign: 'center' }}>
                  ← К каталогу курсов
                </Link>
              </div>
            ) : (
              <div style={{ background: '#fff', border: '1px solid #E2E0D8', borderRadius: '20px', padding: '20px', position: 'sticky', top: '84px' }}>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Стоимость курса</div>
                  <div style={{ fontSize: '40px', fontWeight: 900, color: '#111', fontFamily: 'Instrument Serif,serif' }}>
                    {course.price > 0 ? `${course.price.toLocaleString()} тг` : 'Бесплатно'}
                  </div>
                  <div style={{ fontSize: '13px', color: '#999', marginTop: '4px' }}>Доступ навсегда, без подписки</div>
                </div>

                {error && (
                  <div style={{ background: '#FEF2F2', border: '1.5px solid #FECACA', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', color: '#DC2626', fontWeight: 600, marginBottom: '12px' }}>
                    ⚠ {error}
                  </div>
                )}

                <button onClick={handlePurchase} disabled={purchasing}
                  style={{ width: '100%', fontFamily: 'Onest,sans-serif', fontSize: '15px', fontWeight: 700, padding: '14px', border: 'none', borderRadius: '12px', background: purchasing ? '#93C5FD' : '#2563EB', color: '#fff', cursor: purchasing ? 'not-allowed' : 'pointer', marginBottom: '12px' }}>
                  {purchasing ? 'Покупаем...' : `💳 Купить за ${course.price.toLocaleString()} тг`}
                </button>

                <div style={{ height: '1px', background: '#F1F5F9', margin: '16px 0' }} />

                <div style={{ fontSize: '13px', fontWeight: 700, color: '#111', marginBottom: '10px' }}>Что входит:</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
                  {[
                    `${course.quizzes.length} квизов с разбором ответов`,
                    `${course.videos.length} видеоуроков от преподавателя`,
                    'Доступ навсегда',
                    'Отслеживание прогресса',
                  ].map((t, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '9px', fontSize: '13px', color: '#444' }}>
                      <span style={{ color: '#16A34A', fontWeight: 800 }}>✓</span> {t}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
