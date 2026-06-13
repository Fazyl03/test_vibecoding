'use client'
import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

type Option = { id: string; text: string }
type Question = { id: string; text: string; options: Option[]; order: number; imageUrl?: string }
type Quiz = { id: string; title: string; subject: string; type: string; duration: number; questions: Question[]; teacher: { name: string } }

const TYPE_LABEL: Record<string, string> = { ENT: 'ЕНТ', PBB: 'ПББ', COMBO: 'Комбо' }

export default function QuizPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [quiz, setQuiz]             = useState<Quiz | null>(null)
  const [loading, setLoading]       = useState(true)
  const [current, setCurrent]       = useState(0)
  const [answers, setAnswers]       = useState<Record<string, string>>({})
  const [selected, setSelected]     = useState<string | null>(null)
  const [timeLeft, setTimeLeft]     = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [started, setStarted]       = useState(false)
  const [timedOut, setTimedOut]     = useState(false)

  useEffect(() => {
    fetch(`/api/quiz/${id}`)
      .then(r => r.json())
      .then(data => { setQuiz(data); setTimeLeft(data.duration * 60); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  const submit = useCallback(async (finalAnswers: Record<string, string>, isTimeout = false) => {
    if (submitting) return
    setSubmitting(true)
    if (isTimeout) setTimedOut(true)
    const answerArr = Object.entries(finalAnswers).map(([questionId, chosen]) => ({ questionId, chosen }))
    const res = await fetch(`/api/quiz/${id}/attempt`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: answerArr }),
    })
    const data = await res.json()
    if (res.ok) {
      sessionStorage.setItem(`quiz_result_${id}`, JSON.stringify(data))
      if (isTimeout) return // показываем экран "время вышло" перед переходом
      router.push(`/quiz/${id}/results`)
    }
  }, [id, router, submitting])

  // Таймер
  useEffect(() => {
    if (!started || timeLeft <= 0 || submitting) return
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timer); submit(answers, true); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [started, timeLeft, submitting, answers, submit])

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m.toString().padStart(2,'0')}:${sec.toString().padStart(2, '0')}`
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

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#F7F6F2', fontFamily: 'Onest,sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#999', fontSize: '14px' }}>Загружаем квиз...</p>
    </div>
  )

  if (!quiz) return (
    <div style={{ minHeight: '100vh', background: '#F7F6F2', fontFamily: 'Onest,sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <div>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>😕</div>
        <p style={{ color: '#999', fontSize: '14px' }}>Квиз не найден или недоступен</p>
      </div>
    </div>
  )

  // ─── TIMEOUT SCREEN ──────────────────────────────────────
  if (timedOut) {
    const answeredCount = Object.keys(answers).length
    return (
      <div style={{ minHeight: '100vh', background: '#F7F6F2', fontFamily: 'Onest,sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ maxWidth: '440px', width: '100%', textAlign: 'center' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#FFFBEB', border: '3px solid #FDE68A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', margin: '0 auto 20px' }}>⏰</div>
          <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#111', letterSpacing: '-.5px', marginBottom: '10px' }}>Время вышло!</h1>
          <p style={{ fontSize: '15px', color: '#999', lineHeight: 1.6, marginBottom: '28px' }}>
            Квиз автоматически завершён. Ответы отправлены — смотри свои результаты.
          </p>
          <div style={{ background: '#fff', border: '1px solid #E2E0D8', borderRadius: '20px', padding: '20px', marginBottom: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '22px', fontWeight: 900, color: '#111' }}>{quiz.questions.length}</div>
                <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>Вопросов</div>
              </div>
              <div>
                <div style={{ fontSize: '22px', fontWeight: 900, color: '#16A34A' }}>{answeredCount}</div>
                <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>Отвечено</div>
              </div>
              <div>
                <div style={{ fontSize: '22px', fontWeight: 900, color: '#999' }}>{quiz.questions.length - answeredCount}</div>
                <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>Пропущено</div>
              </div>
            </div>
          </div>
          <button onClick={() => router.push(`/quiz/${id}/results`)}
            style={{ width: '100%', fontFamily: 'Onest,sans-serif', fontSize: '15px', fontWeight: 700, padding: '14px', border: 'none', borderRadius: '12px', background: '#2563EB', color: '#fff', cursor: 'pointer' }}>
            Смотреть результаты →
          </button>
        </div>
      </div>
    )
  }

  // ─── START SCREEN ────────────────────────────────────────
  if (!started) return (
    <div style={{ minHeight: '100vh', background: '#F7F6F2', fontFamily: 'Onest,sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ maxWidth: '480px', width: '100%' }}>
        <div style={{ background: '#fff', border: '1px solid #E2E0D8', borderRadius: '24px', padding: '40px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
          <h1 style={{ fontSize: '22px', fontWeight: 900, color: '#111', marginBottom: '8px' }}>{quiz.title}</h1>
          <p style={{ fontSize: '14px', color: '#999', marginBottom: '32px' }}>{quiz.subject} · {TYPE_LABEL[quiz.type] ?? quiz.type} · {quiz.teacher.name}</p>

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

  // ─── QUIZ ACTIVE ─────────────────────────────────────────
  const q = quiz.questions[current]
  const total = quiz.questions.length
  const isLast = current === total - 1
  const pctProgress = Math.round((current / total) * 100)

  const totalSeconds = quiz.duration * 60
  const timeRatio = timeLeft / totalSeconds
  const timerLow = timeLeft <= 180 // ≤3 мин — красный
  const timerColor = timerLow ? '#DC2626' : '#111'
  const timerBg    = timerLow ? '#FEF2F2' : '#F7F6F2'
  const timerBorder = timerLow ? '#FECACA' : '#E2E0D8'

  return (
    <div style={{ minHeight: '100vh', background: '#F7F6F2', fontFamily: 'Onest,sans-serif' }}>
      <style>{`
        .opt-btn:hover { border-color: #BFCFFF !important; }
        @keyframes blink { 0%,100% { opacity: 1 } 50% { opacity: .4 } }
        .timer-blink { animation: blink 1s infinite; }
        @media (max-width: 768px) {
          .quiz-topbar-center { display: none !important; }
          .opts-grid { grid-template-columns: 1fr !important; }
          .quiz-nav-row { flex-direction: column; align-items: stretch !important; gap: 12px !important; }
          .quiz-nav-row > div:first-child { display: none; }
          .quiz-nav-row button { width: 100%; justify-content: center; }
        }
      `}</style>

      {/* Top bar */}
      <div style={{ position: 'sticky', top: 0, zIndex: 100, background: '#fff', borderBottom: '1px solid #E2E0D8', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>

          {/* Logo + title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <div style={{ width: '30px', height: '30px', background: '#2563EB', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 900, color: '#fff', fontStyle: 'italic' }}>Q</div>
            </Link>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '220px' }}>{quiz.title}</div>
              <div style={{ fontSize: '11px', color: '#999', fontWeight: 500 }}>{quiz.subject} · {TYPE_LABEL[quiz.type] ?? quiz.type}</div>
            </div>
          </div>

          {/* Progress */}
          <div className="quiz-topbar-center" style={{ flex: 1, maxWidth: '320px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, color: '#999', marginBottom: '6px' }}>
              <span>Вопрос {current + 1} из {total}</span>
              <span style={{ color: '#2563EB' }}>{pctProgress}%</span>
            </div>
            <div style={{ height: '6px', background: '#E2E0D8', borderRadius: '100px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pctProgress}%`, background: '#2563EB', borderRadius: '100px', transition: 'width .4s ease' }} />
            </div>
          </div>

          {/* Timer */}
          <div className={timerLow ? 'timer-blink' : ''} style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, background: timerBg, border: `1.5px solid ${timerBorder}`, borderRadius: '10px', padding: '8px 14px' }}>
            <span style={{ fontSize: '16px' }}>⏱</span>
            <span style={{ fontSize: '16px', fontWeight: 900, color: timerColor, fontVariantNumeric: 'tabular-nums', letterSpacing: '-.5px' }}>{formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>

      {/* Question */}
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '7px',
          background: isLast ? '#F0FDF4' : '#EEF3FF',
          border: `1px solid ${isLast ? '#BBF7D0' : '#BFCFFF'}`,
          borderRadius: '100px', padding: '5px 14px', fontSize: '12px', fontWeight: 700,
          color: isLast ? '#16A34A' : '#2563EB', marginBottom: '20px',
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isLast ? '#16A34A' : '#2563EB', display: 'inline-block' }} />
          {isLast ? 'Последний вопрос!' : `Вопрос ${current + 1} из ${total}`}
        </div>

        {/* Question text */}
        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#111', lineHeight: 1.45, marginBottom: '36px', letterSpacing: '-.3px' }}>
          {q.text}
        </h2>
        {q.imageUrl && <img src={q.imageUrl} alt="" style={{ maxWidth: '100%', borderRadius: '12px', marginBottom: '24px' }} />}

        {/* Options */}
        <div className="opts-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '40px' }}>
          {q.options.map(opt => {
            const isSelected = selected === opt.id
            return (
              <button key={opt.id} className="opt-btn" onClick={() => handleSelect(opt.id)}
                style={{
                  fontFamily: 'Onest,sans-serif', width: '100%', textAlign: 'left', padding: '18px 20px',
                  borderRadius: '16px', border: `2px solid ${isSelected ? '#2563EB' : '#E2E0D8'}`,
                  background: isSelected ? '#EEF3FF' : '#fff', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '14px', transition: 'all .15s',
                }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '14px', fontWeight: 800,
                  background: isSelected ? '#2563EB' : '#F7F6F2',
                  color: isSelected ? '#fff' : '#999',
                  border: isSelected ? 'none' : '2px solid #E2E0D8',
                }}>
                  {opt.id}
                </div>
                <span style={{ fontSize: '15px', fontWeight: isSelected ? 700 : 600, color: isSelected ? '#2563EB' : '#444', lineHeight: 1.35 }}>
                  {opt.text}
                </span>
              </button>
            )
          })}
        </div>

        {/* Nav row */}
        <div className="quiz-nav-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ fontSize: '13px', color: '#999', fontWeight: 500 }}>
            ← Вернуться нельзя (как в реальном ЕНТ)
          </div>
          <button onClick={handleNext} disabled={!selected || submitting}
            style={{
              fontFamily: 'Onest,sans-serif', fontSize: '15px', fontWeight: 700, padding: '14px 32px', border: 'none', borderRadius: '12px',
              background: !selected || submitting ? '#E2E0D8' : isLast ? '#16A34A' : '#2563EB',
              color: !selected || submitting ? '#999' : '#fff',
              cursor: !selected || submitting ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', gap: '8px',
              boxShadow: isLast && selected ? '0 4px 16px rgba(22,163,74,.3)' : 'none',
            }}>
            {submitting ? 'Сохраняем...' : isLast ? '✓ Завершить квиз' : 'Следующий вопрос →'}
          </button>
        </div>

        {/* Progress dots navigator */}
        <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid #E2E0D8' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '12px' }}>Прогресс</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {quiz.questions.map((qq, i) => {
              const answered = answers[qq.id] !== undefined
              const isCurrent = i === current
              let bg = '#fff', border = '#E2E0D8', color = '#999', fontWeight = 700
              if (isCurrent) { bg = '#2563EB'; border = '#2563EB'; color = '#fff'; fontWeight = 800 }
              else if (answered) { bg = '#F0FDF4'; border = '#BBF7D0'; color = '#16A34A'; fontWeight = 800 }
              return (
                <div key={qq.id} style={{ width: '28px', height: '28px', borderRadius: '8px', background: bg, border: `1.5px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight, color }}>
                  {i + 1}
                </div>
              )
            })}
          </div>
          <div style={{ display: 'flex', gap: '16px', marginTop: '12px', fontSize: '12px', fontWeight: 600, color: '#999', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#F0FDF4', border: '1.5px solid #BBF7D0', display: 'inline-block' }} />
              Отвечено ({Object.keys(answers).length})
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#2563EB', display: 'inline-block' }} />
              Текущий
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#fff', border: '1.5px solid #E2E0D8', display: 'inline-block' }} />
              Не отвечено ({total - Object.keys(answers).length - 1 >= 0 ? total - Object.keys(answers).length : 0})
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
