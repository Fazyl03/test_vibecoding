'use client'
import Link from 'next/link'
import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'

const tabs = ['Комбо курстар', 'ҰБТ курстар', 'ПББ курстар']

const quizzes = [
  { id: 1, title: 'Алгебра — квадратные уравнения', subject: 'Математика', subjectColor: '#2563EB', questions: 25, teacher: 'Айгерим М.', duration: '30 мин', difficulty: 'Средний', diffColor: '#D97706', diffBg: '#FFFBEB' },
  { id: 2, title: 'История KZ — XIX век', subject: 'История Казахстана', subjectColor: '#2563EB', questions: 30, teacher: 'Болат С.', duration: '35 мин', difficulty: 'Лёгкий', diffColor: '#16A34A', diffBg: '#F0FDF4' },
  { id: 3, title: 'Механика — законы Ньютона', subject: 'Физика', subjectColor: '#2563EB', questions: 20, teacher: 'Дина К.', duration: '25 мин', difficulty: 'Сложный', diffColor: '#DC2626', diffBg: '#FEF2F2' },
  { id: 4, title: 'Органическая химия — основы', subject: 'Химия', subjectColor: '#2563EB', questions: 20, teacher: 'Айгерим М.', duration: '25 мин', difficulty: 'Средний', diffColor: '#D97706', diffBg: '#FFFBEB' },
  { id: 5, title: 'Клетка и её строение', subject: 'Биология', subjectColor: '#2563EB', questions: 25, teacher: 'Дина К.', duration: '30 мин', difficulty: 'Лёгкий', diffColor: '#16A34A', diffBg: '#F0FDF4' },
  { id: 6, title: 'Геометрия — теорема Пифагора', subject: 'Математика', subjectColor: '#2563EB', questions: 15, teacher: 'Болат С.', duration: '20 мин', difficulty: 'Лёгкий', diffColor: '#16A34A', diffBg: '#F0FDF4' },
]

export default function QuizzesPage() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: 'Inter,sans-serif' }}>
      <Navbar />
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#0F172A', marginBottom: '6px', letterSpacing: '-.5px' }}>Квизы</h1>
          <p style={{ fontSize: '15px', color: '#475569' }}>Тренируйся с тестами от лучших учителей Казахстана</p>
        </div>

        <div style={{ display: 'flex', gap: '6px', marginBottom: '32px', background: '#E2E8F0', padding: '4px', borderRadius: '12px', width: 'fit-content' }}>
          {tabs.map((tab, i) => (
            <button key={i} onClick={() => setActiveTab(i)} style={{ fontFamily: 'Inter,sans-serif', fontSize: '14px', fontWeight: 600, padding: '10px 24px', borderRadius: '9px', border: 'none', cursor: 'pointer', transition: 'all .2s', background: activeTab === i ? '#fff' : 'transparent', color: activeTab === i ? '#2563EB' : '#475569', boxShadow: activeTab === i ? '0 2px 8px rgba(0,0,0,.06)' : 'none' }}>
              {tab}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
          {quizzes.map(q => (
            <div key={q.id} style={{ background: '#fff', borderRadius: '20px', padding: '24px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: q.subjectColor, background: '#EEF3FF', padding: '4px 12px', borderRadius: '20px' }}>{q.subject}</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: q.diffColor, background: q.diffBg, padding: '4px 12px', borderRadius: '20px' }}>{q.difficulty}</span>
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0F172A', lineHeight: 1.35, marginBottom: '10px' }}>{q.title}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px', color: '#64748B', marginBottom: '20px' }}>
                <span>📋 {q.questions} вопросов</span>
                <span>🕐 {q.duration}</span>
              </div>
              <div style={{ height: '1px', background: '#F1F5F9', marginBottom: '16px' }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', color: '#64748B' }}>👤 {q.teacher}</span>
                <Link href="/auth/register" style={{ fontFamily: 'Inter,sans-serif', fontSize: '14px', fontWeight: 700, padding: '10px 24px', border: 'none', borderRadius: '10px', background: '#2563EB', color: '#fff', cursor: 'pointer', textDecoration: 'none' }}>
                  Начать
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
