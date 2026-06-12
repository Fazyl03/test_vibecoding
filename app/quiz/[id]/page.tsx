'use client'
import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'

type Option = { id: string; text: string }
type Question = { id: string; text: string; options: Option[]; order: number; imageUrl?: string }
type Quiz = { id: string; title: string; subject: string; duration: number; questions: Question[]; teacher: { name: string } }

export default function QuizPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [quiz, setQuiz]           = useState<Quiz | null>(null)
  const [loading, setLoading]     = useState(true)
  const [current, setCurrent]     = useState(0)
  const [answers, setAnswers]     = useState<Record<string, string>>({})
  const [selected, setSelected]   = useState<string | null>(null)
  const [timeLeft, setTimeLeft]   = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [started, setStarted]     = useState(false)

  useEffect(() => {
    fetch(`/api/quiz/${id}`)
      .then(r => r.json())
      .then(data => { setQuiz(data); setTimeLeft(data.duration * 60); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  const submit = useCallback(async (finalAnswers: Record<string, string>) => {
    if (submitting) return
    setSubmitting(true)
    const answerArr = Object.entries(finalAnswers).map(([questionId, chosen]) => ({ questionId, chosen }))
    const res = await fetch(`/api/quiz/${id}/attempt`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: answerArr }),
    })
    const data = await res.json()
    if (res.ok) {
      sessionStorage.setItem(`quiz_result_${id}`, JSON.stringify(data))
      router.push(`/quiz/${id}/results`)
    }
  }, [id, router, submitting])

  // Таймер
  useEffect(() => {
    if (!started || timeLeft <= 0 || submitting) return
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timer); submit(answers); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [started, timeLeft, submitting, answers, submit])

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const handleSelect = (optId: string) => setSelected(optId)

  const handleNext = () => {
    if (!quiz || !selected) return
    const q = quiz.questions[current]
    const newAnswers = { ...answers, [q.id]: selected }
    setAnswers(newAnswers)
    setSelected(null)

    if (current < quiz.questions.length - 1) {
      setCurrent(current + 1)
    } else {
      submit(newAnswers)
    }
  }

  const pct = quiz ? Math.round((timeLeft / (quiz.duration * 60)) * 100) : 100
  const timerColor = pct > 50 ? '#16A34A' : pct > 20 ? '#D97706' : '#DC2626'

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#F7F6F2', fontFamily: 'Onest,sans-serif' }}>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '80px 20px', color: '#999' }}>Загружаем квиз...</div>
    </div>
  )

  if (!quiz) return (
    <div style={{ minHeight: '100vh', background: '#F7F6F2', fontFamily: 'Onest,sans-serif' }}>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>😕</div>
        <p style={{ color: '#999', fontSize: '14px' }}>Квиз не найден или недоступен</p>
      </div>
    </div>
  )

  // Стартовый экран
  if (!started) return (
    <div style={{ minHeight: '100vh', background: '#F7F6F2', fontFamily: 'Onest,sans-serif' }}>
      <Navbar />
      <div style={{ maxWidth: '600px', margin: '60px auto', padding: '0 16px' }}>
        <div style={{ background: '#fff', border: '1px solid #E2E0D8', borderRadius: '24px', padding: '40px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
          <h1 style={{ fontSize: '22px', fontWeight: 900, color: '#111', marginBottom: '8px' }}>{quiz.title}</h1>
          <p style={{ fontSize: '14px', color: '#999', marginBottom: '32px' }}>{quiz.subject} · {quiz.teacher.name}</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '32px' }}>
            {[
              { icon: '❓', label: 'Вопросов', val: quiz.questions.length },
              { icon: '⏱', label: 'Время', val: `${quiz.duration} мин` },
            ].map((s, i) => (
              <div key={i} style={{ background: '#F7F6F2', borderRadius: '14px', padding: '16px' }}>
                <div style={{ fontSize: '24px', marginBottom: '6px' }}>{s.icon}</div>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#111' }}>{s.val}</div>
                <div style={{ fontSize: '12px', color: '#999' }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '12px', padding: '12px 16px', fontSize: '13px', color: '#78350F', marginBottom: '24px', textAlign: 'left' }}>
            ⚠️ После начала вернуться к предыдущим вопросам нельзя. Когда время выйдет — квиз завершится автоматически.
          </div>

          <button onClick={() => setStarted(true)}
            style={{ width: '100%', fontFamily: 'Onest,sans-serif', fontSize: '16px', fontWeight: 700, padding: '14px', border: 'none', borderRadius: '14px', background: '#2563EB', color: '#fff', cursor: 'pointer' }}>
            Начать квиз →
          </button>
        </div>
      </div>
    </div>
  )

  const q = quiz.questions[current]

  return (
    <div style={{ minHeight: '100vh', background: '#F7F6F2', fontFamily: 'Onest,sans-serif' }}>
      <style>{`
        .opt-card:hover { border-color: #2563EB !important; background: #EEF3FF !important; }
      `}</style>

      {/* Header с таймером */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E2E0D8', padding: '0 20px', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#111' }}>{quiz.title}</div>
            <div style={{ fontSize: '12px', color: '#999' }}>Вопрос {current + 1} из {quiz.questions.length}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: timeLeft < 60 ? '#FEF2F2' : '#F7F6F2', padding: '8px 16px', borderRadius: '12px', border: `1.5px solid ${timerColor}` }}>
            <span style={{ fontSize: '20px' }}>⏱</span>
            <span style={{ fontSize: '18px', fontWeight: 900, color: timerColor, fontFamily: 'monospace' }}>{formatTime(timeLeft)}</span>
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ height: '3px', background: '#F1F5F9' }}>
          <div style={{ height: '100%', background: '#2563EB', width: `${((current) / quiz.questions.length) * 100}%`, transition: 'width .3s' }} />
        </div>
      </div>

      {/* Question */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 16px' }}>
        <div style={{ background: '#fff', border: '1px solid #E2E0D8', borderRadius: '20px', padding: '28px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#2563EB', background: '#EEF3FF', padding: '4px 10px', borderRadius: '7px' }}>
              Вопрос {current + 1}
            </span>
          </div>
          <p style={{ fontSize: '17px', fontWeight: 700, color: '#111', lineHeight: 1.5 }}>{q.text}</p>
          {q.imageUrl && <img src={q.imageUrl} alt="" style={{ maxWidth: '100%', borderRadius: '12px', marginTop: '16px' }} />}
        </div>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
          {(q.options as Option[]).map((opt) => {
            const isSelected = selected === opt.id
            return (
              <div key={opt.id} className="opt-card" onClick={() => handleSelect(opt.id)}
                style={{
                  background: isSelected ? '#EEF3FF' : '#fff',
                  border: `2px solid ${isSelected ? '#2563EB' : '#E2E0D8'}`,
                  borderRadius: '14px', padding: '16px 20px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '14px', transition: 'all .15s',
                }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '13px', fontWeight: 800,
                  background: isSelected ? '#2563EB' : '#F7F6F2',
                  color: isSelected ? '#fff' : '#444',
                  border: `2px solid ${isSelected ? '#2563EB' : '#E2E0D8'}`,
                }}>
                  {opt.id}
                </div>
                <span style={{ fontSize: '15px', fontWeight: isSelected ? 700 : 500, color: isSelected ? '#2563EB' : '#111' }}>
                  {opt.text}
                </span>
              </div>
            )
          })}
        </div>

        <button onClick={handleNext} disabled={!selected || submitting}
          style={{ width: '100%', fontFamily: 'Onest,sans-serif', fontSize: '15px', fontWeight: 700, padding: '14px', border: 'none', borderRadius: '14px', background: selected && !submitting ? '#2563EB' : '#E2E0D8', color: selected && !submitting ? '#fff' : '#999', cursor: selected && !submitting ? 'pointer' : 'not-allowed' }}>
          {submitting ? 'Сохраняем результаты...' : current < quiz.questions.length - 1 ? 'Следующий вопрос →' : '✓ Завершить квиз'}
        </button>
      </div>
    </div>
  )
}
