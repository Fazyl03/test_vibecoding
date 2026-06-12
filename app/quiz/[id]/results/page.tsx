'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'

type Answer = { questionId: string; chosen: string; correct: boolean; correctOption: string }
type Result = { attemptId: string; score: number; total: number; answers: Answer[] }

export default function QuizResultsPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [result, setResult] = useState<Result | null>(null)
  const [questions, setQuestions] = useState<any[]>([])

  useEffect(() => {
    const stored = sessionStorage.getItem(`quiz_result_${id}`)
    if (!stored) { router.push(`/quiz/${id}`); return }
    const parsed = JSON.parse(stored)
    setResult(parsed)

    // Загружаем квиз для отображения текста вопросов
    fetch(`/api/quiz/${id}`)
      .then(r => r.json())
      .then(data => setQuestions(data.questions ?? []))
  }, [id, router])

  if (!result) return (
    <div style={{ minHeight: '100vh', background: '#F7F6F2', fontFamily: 'Onest,sans-serif' }}>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '80px 20px', color: '#999' }}>Загружаем...</div>
    </div>
  )

  const pct = Math.round((result.score / result.total) * 100)
  const scoreColor = pct >= 70 ? '#16A34A' : pct >= 50 ? '#D97706' : '#DC2626'
  const scoreBg    = pct >= 70 ? '#F0FDF4' : pct >= 50 ? '#FFFBEB' : '#FEF2F2'
  const scoreLabel = pct >= 70 ? 'Отличный результат! 🎉' : pct >= 50 ? 'Неплохо, но есть куда расти 📈' : 'Нужно больше практики 💪'

  const qMap = new Map(questions.map(q => [q.id, q]))

  return (
    <div style={{ minHeight: '100vh', background: '#F7F6F2', fontFamily: 'Onest,sans-serif' }}>
      <Navbar />
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '40px 16px' }}>

        {/* Score card */}
        <div style={{ background: '#fff', border: '1px solid #E2E0D8', borderRadius: '24px', padding: '40px', textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ background: scoreBg, borderRadius: '50%', width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: `3px solid ${scoreColor}` }}>
            <div>
              <div style={{ fontSize: '28px', fontWeight: 900, color: scoreColor, lineHeight: 1 }}>{pct}%</div>
            </div>
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 900, color: scoreColor, marginBottom: '8px' }}>
            {result.score} / {result.total}
          </h1>
          <p style={{ fontSize: '16px', color: '#444', marginBottom: '24px' }}>{scoreLabel}</p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href={`/quiz/${id}`}
              style={{ fontFamily: 'Onest,sans-serif', fontSize: '14px', fontWeight: 700, padding: '11px 24px', border: '1.5px solid #E2E0D8', borderRadius: '12px', color: '#444', textDecoration: 'none', display: 'inline-block' }}>
              🔄 Пройти снова
            </Link>
            <Link href="/quizzes"
              style={{ fontFamily: 'Onest,sans-serif', fontSize: '14px', fontWeight: 700, padding: '11px 24px', border: 'none', borderRadius: '12px', background: '#2563EB', color: '#fff', textDecoration: 'none', display: 'inline-block' }}>
              ← Все квизы
            </Link>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '20px' }}>
          {[
            { icon: '✅', val: result.score, label: 'Правильных', color: '#16A34A', bg: '#F0FDF4' },
            { icon: '❌', val: result.total - result.score, label: 'Неправильных', color: '#DC2626', bg: '#FEF2F2' },
            { icon: '📊', val: `${pct}%`, label: 'Результат', color: scoreColor, bg: scoreBg },
          ].map((s, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid #E2E0D8', borderRadius: '16px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '6px' }}>{s.icon}</div>
              <div style={{ fontSize: '22px', fontWeight: 900, color: s.color }}>{s.val}</div>
              <div style={{ fontSize: '12px', color: '#999' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Question breakdown */}
        {questions.length > 0 && (
          <div style={{ background: '#fff', border: '1px solid #E2E0D8', borderRadius: '20px', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9' }}>
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#111' }}>Разбор ответов</span>
            </div>
            {result.answers.map((a, i) => {
              const q = qMap.get(a.questionId)
              if (!q) return null
              const opts = q.options as { id: string; text: string }[]
              const chosenOpt  = opts.find(o => o.id === a.chosen)
              const correctOpt = opts.find(o => o.id === a.correctOption)

              return (
                <div key={a.questionId} style={{ padding: '20px', borderBottom: i < result.answers.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, background: a.correct ? '#F0FDF4' : '#FEF2F2', color: a.correct ? '#16A34A' : '#DC2626' }}>
                      {a.correct ? '✓' : '✕'}
                    </div>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: '#111', lineHeight: 1.4 }}>
                      {i + 1}. {q.text}
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingLeft: '36px' }}>
                    {!a.correct && (
                      <div style={{ fontSize: '13px', padding: '8px 12px', borderRadius: '10px', background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', fontWeight: 600 }}>
                        Ваш ответ: {chosenOpt?.text ?? a.chosen}
                      </div>
                    )}
                    <div style={{ fontSize: '13px', padding: '8px 12px', borderRadius: '10px', background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#16A34A', fontWeight: 600 }}>
                      {a.correct ? '✓ ' : 'Правильно: '}{correctOpt?.text ?? a.correctOption}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
