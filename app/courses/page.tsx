'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'

type Course = {
  id: string; title: string; price: number; type: string
  teacher: { name: string }
  _count: { quizzes: number; videos: number }
}

const TYPE_LABEL: Record<string, string> = { ENT: 'ЕНТ', PBB: 'ПББ', COMBO: 'Комбо' }
const TYPE_BG: Record<string, string[]> = {
  ENT:   ['linear-gradient(135deg,#1E3A8A,#2563EB)', 'linear-gradient(135deg,#064e3b,#16A34A)', 'linear-gradient(135deg,#7f1d1d,#DC2626)'],
  PBB:   ['linear-gradient(135deg,#78350f,#D97706)', 'linear-gradient(135deg,#1a2e05,#059669)'],
  COMBO: ['linear-gradient(135deg,#4c1d95,#7C3AED)'],
}
const TYPE_TEXT_COLOR: Record<string, string> = { ENT: '#2563EB', PBB: '#D97706', COMBO: '#7C3AED' }
const EMOJI_BY_SUBJECT_HASH = ['📐','🏛️','⭐','📖','🌍','⚗️','🧬','📊','🔬']

function pickGradient(course: Course, idx: number) {
  const arr = TYPE_BG[course.type] ?? TYPE_BG.ENT
  return arr[idx % arr.length]
}

const TABS = [
  { label: 'Все курсы', value: '' },
  { label: 'ЕНТ', value: 'ENT' },
  { label: 'ПББ', value: 'PBB' },
  { label: 'Комбо', value: 'COMBO' },
]

export default function CoursesCatalogPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('')

  useEffect(() => {
    fetch('/api/courses')
      .then(r => r.json())
      .then(data => { setCourses(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = tab ? courses.filter(c => c.type === tab) : courses

  return (
    <div style={{ minHeight: '100vh', background: '#F7F6F2', fontFamily: 'Onest,sans-serif' }}>
      <style>{`
        .courses-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
        @media (max-width: 900px) { .courses-grid { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 768px) { .courses-grid { grid-template-columns: 1fr; } .tabs-scroll { overflow-x: auto; } }
        .course-card:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(37,99,235,.10); border-color: #BFCFFF; }
      `}</style>
      <Navbar />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 16px' }}>

        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#111', letterSpacing: '-.5px', marginBottom: '4px' }}>Курсы</h1>
          <p style={{ fontSize: '14px', color: '#999' }}>Комплексные программы подготовки от лучших учителей</p>
        </div>

        {/* Type tabs */}
        <div className="tabs-scroll" style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', gap: '6px', background: '#fff', border: '1px solid #E2E0D8', padding: '4px', borderRadius: '14px', width: 'fit-content', minWidth: 'max-content' }}>
            {TABS.map(t => (
              <button key={t.value} onClick={() => setTab(t.value)}
                style={{ fontFamily: 'Onest,sans-serif', fontSize: '14px', fontWeight: 600, padding: '9px 22px', borderRadius: '11px', border: 'none', cursor: 'pointer', background: tab === t.value ? '#2563EB' : 'transparent', color: tab === t.value ? '#fff' : '#444', transition: 'all .2s', whiteSpace: 'nowrap' }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999', fontSize: '14px' }}>Загружаем...</div>
        ) : filtered.length === 0 ? (
          <div style={{ background: '#fff', border: '1px solid #E2E0D8', borderRadius: '20px', padding: '48px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📭</div>
            <p style={{ fontSize: '14px', color: '#999' }}>Курсы скоро появятся</p>
          </div>
        ) : (
          <div className="courses-grid">
            {filtered.map((c, i) => (
              <Link key={c.id} href={`/courses/${c.id}`} style={{ textDecoration: 'none' }}>
                <div className="course-card" style={{ background: '#fff', border: '1px solid #E2E0D8', borderRadius: '20px', overflow: 'hidden', transition: 'all .2s', cursor: 'pointer', display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div style={{ aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', position: 'relative', overflow: 'hidden', background: pickGradient(c, i) }}>
                    {EMOJI_BY_SUBJECT_HASH[i % EMOJI_BY_SUBJECT_HASH.length]}
                    <span style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(255,255,255,.95)', fontSize: '11px', fontWeight: 800, padding: '4px 10px', borderRadius: '7px', textTransform: 'uppercase', letterSpacing: '.5px', color: TYPE_TEXT_COLOR[c.type] }}>
                      {TYPE_LABEL[c.type] ?? c.type}
                    </span>
                  </div>
                  <div style={{ padding: '18px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: '12px', color: '#999', fontWeight: 600, marginBottom: '6px' }}>👩‍🏫 {c.teacher.name}</div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#111', marginBottom: '10px', lineHeight: 1.35 }}>{c.title}</div>
                    <div style={{ display: 'flex', gap: '10px', fontSize: '12px', color: '#999', fontWeight: 600, marginBottom: '14px' }}>
                      <span>📝 {c._count.quizzes} квизов</span>
                      <span>🎬 {c._count.videos} видео</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid #F1F5F9', marginTop: 'auto' }}>
                      <div style={{ fontSize: '20px', fontWeight: 900, color: '#111' }}>
                        {c.price > 0 ? <>{c.price.toLocaleString()} <span style={{ fontSize: '12px', fontWeight: 600, color: '#999' }}>тг</span></> : 'Бесплатно'}
                      </div>
                      <span style={{ fontFamily: 'Onest,sans-serif', fontSize: '12px', fontWeight: 700, padding: '7px 15px', borderRadius: '9px', border: 'none', background: '#2563EB', color: '#fff' }}>
                        Подробнее
                      </span>
                    </div>
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
