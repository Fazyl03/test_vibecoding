'use client'
import { useEffect, useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Link from 'next/link'

type Course = {
  id: string; title: string; price: number; type: string; isPublished: boolean
  _count: { quizzes: number; videos: number }
}

const TYPE_LABEL: Record<string, string> = { ENT: 'ЕНТ', PBB: 'ПББ', COMBO: 'Комбо' }
const TYPE_COLOR: Record<string, string> = { ENT: '#2563EB', PBB: '#D97706', COMBO: '#7C3AED' }
const TYPE_BG: Record<string, string>    = { ENT: '#EEF3FF', PBB: '#FFFBEB', COMBO: '#F5F3FF' }

export default function TeacherCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/teacher/courses')
      .then(r => r.json())
      .then(data => { setCourses(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#F7F6F2', fontFamily: 'Onest,sans-serif' }}>
      <style>{`@media(max-width:768px){.course-grid{grid-template-columns:1fr!important}}`}</style>
      <Navbar />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 16px' }}>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#111', letterSpacing: '-.5px', marginBottom: '4px' }}>Мои курсы</h1>
            <p style={{ fontSize: '14px', color: '#999' }}>Объединяй квизы и видео в курсы для продажи</p>
          </div>
          <Link href="/teacher/courses/create"
            style={{ fontFamily: 'Onest,sans-serif', fontSize: '14px', fontWeight: 700, padding: '11px 22px', border: 'none', borderRadius: '12px', background: '#2563EB', color: '#fff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '7px' }}>
            + Создать курс
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999', fontSize: '14px' }}>Загружаем...</div>
        ) : courses.length === 0 ? (
          <div style={{ background: '#fff', border: '1px solid #E2E0D8', borderRadius: '20px', padding: '48px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📦</div>
            <p style={{ fontSize: '14px', color: '#999', marginBottom: '16px' }}>У вас пока нет курсов</p>
            <Link href="/teacher/courses/create"
              style={{ fontFamily: 'Onest,sans-serif', fontSize: '13px', fontWeight: 700, padding: '10px 22px', border: 'none', borderRadius: '10px', background: '#2563EB', color: '#fff', textDecoration: 'none' }}>
              + Создать первый курс
            </Link>
          </div>
        ) : (
          <div className="course-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
            {courses.map(c => (
              <div key={c.id} style={{ background: '#fff', border: '1px solid #E2E0D8', borderRadius: '20px', padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: TYPE_COLOR[c.type], background: TYPE_BG[c.type], padding: '4px 10px', borderRadius: '7px', textTransform: 'uppercase', letterSpacing: '.5px' }}>
                    {TYPE_LABEL[c.type] ?? c.type}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 9px', borderRadius: '7px', background: c.isPublished ? '#F0FDF4' : '#F7F6F2', color: c.isPublished ? '#16A34A' : '#999', border: c.isPublished ? 'none' : '1px solid #E2E0D8' }}>
                    {c.isPublished ? '● Опубликован' : '○ Черновик'}
                  </span>
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#111', marginBottom: '8px', lineHeight: 1.35 }}>{c.title}</h3>
                <div style={{ fontSize: '13px', color: '#999', marginBottom: '14px' }}>
                  📝 {c._count.quizzes} квизов · 🎬 {c._count.videos} видео
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '18px', fontWeight: 900, color: '#111' }}>
                    {c.price > 0 ? `${c.price.toLocaleString()} тг` : 'Бесплатно'}
                  </span>
                  <Link href={`/teacher/courses/${c.id}`}
                    style={{ fontFamily: 'Onest,sans-serif', fontSize: '13px', fontWeight: 700, padding: '8px 16px', border: '1.5px solid #E2E0D8', borderRadius: '9px', color: '#444', textDecoration: 'none' }}>
                    Управлять
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
