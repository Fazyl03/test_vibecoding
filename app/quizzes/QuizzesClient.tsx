'use client'
import Link from 'next/link'
import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'

const tabs = ['Комбо курстар', 'ҰБТ курстар', 'ПББ курстар']
const tabToType: Record<number, string> = { 0: 'COMBO', 1: 'ENT', 2: 'PBB' }

const diffMap: Record<string, { label: string; color: string; bg: string }> = {
  easy:   { label: 'Лёгкий',  color: '#16A34A', bg: '#F0FDF4' },
  medium: { label: 'Средний', color: '#D97706', bg: '#FFFBEB' },
  hard:   { label: 'Сложный', color: '#DC2626', bg: '#FEF2F2' },
}

function getDiff(duration: number) {
  if (duration <= 20) return diffMap.easy
  if (duration <= 30) return diffMap.medium
  return diffMap.hard
}

type Quiz = {
  id: string
  title: string
  subject: string
  type: string
  duration: number
  teacher: { name: string }
  questions?: { length?: number } | unknown[]
  _count?: { questions: number }
}

export default function QuizzesClient({ quizzes }: { quizzes: Quiz[] }) {
  const [activeTab, setActiveTab] = useState(0)

  const filtered = quizzes.filter(q => q.type === tabToType[activeTab])

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: 'Inter,sans-serif' }}>
      <style>{`
        .quiz-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
        @media (max-width: 768px) { .quiz-grid { grid-template-columns: 1fr; } }
        @media (min-width: 769px) and (max-width: 1024px) { .quiz-grid { grid-template-columns: repeat(2,1fr); } }
        .tabs-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
      `}</style>
      <Navbar />
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 16px' }}>
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '30px', fontWeight: 900, color: '#0F172A', marginBottom: '6px' }}>Квизы</h1>
          <p style={{ fontSize: '15px', color: '#475569' }}>Тренируйся с тестами от лучших учителей Казахстана</p>
        </div>

        <div className="tabs-scroll" style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', gap: '6px', background: '#E2E8F0', padding: '4px', borderRadius: '12px', width: 'fit-content', minWidth: 'max-content' }}>
            {tabs.map((tab, i) => (
              <button key={i} onClick={() => setActiveTab(i)} style={{ fontFamily: 'Inter,sans-serif', fontSize: '14px', fontWeight: 600, padding: '10px 20px', borderRadius: '9px', border: 'none', cursor: 'pointer', background: activeTab === i ? '#fff' : 'transparent', color: activeTab === i ? '#2563EB' : '#475569', boxShadow: activeTab === i ? '0 2px 8px rgba(0,0,0,.06)' : 'none', transition: 'all .2s', whiteSpace: 'nowrap' }}>
                {tab}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', background: '#fff', borderRadius: '20px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>Квизы скоро появятся</h3>
            <p style={{ fontSize: '14px', color: '#94A3B8' }}>Учителя ещё не добавили квизы в этой категории</p>
          </div>
        ) : (
          <div className="quiz-grid">
            {filtered.map(q => {
              const diff = getDiff(q.duration)
              return (
                <div key={q.id} style={{ background: '#fff', borderRadius: '20px', padding: '20px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#2563EB', background: '#EEF3FF', padding: '4px 12px', borderRadius: '20px' }}>{q.subject}</span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: diff.color, background: diff.bg, padding: '4px 12px', borderRadius: '20px' }}>{diff.label}</span>
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', lineHeight: 1.35, marginBottom: '10px' }}>{q.title}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '13px', color: '#64748B', marginBottom: '16px' }}>
                    <span>🕐 {q.duration} мин</span>
                  </div>
                  <div style={{ height: '1px', background: '#F1F5F9', marginBottom: '14px' }} />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', color: '#64748B' }}>👤 {q.teacher.name}</span>
                    <Link href={`/quiz/${q.id}`} style={{ fontFamily: 'Inter,sans-serif', fontSize: '14px', fontWeight: 700, padding: '10px 22px', border: 'none', borderRadius: '10px', background: '#2563EB', color: '#fff', textDecoration: 'none' }}>
                      Начать
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
