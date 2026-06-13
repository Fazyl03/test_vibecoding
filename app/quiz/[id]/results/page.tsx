'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'

type Answer = { questionId: string; chosen: string; correct: boolean; correctOption: string }
type Result = { attemptId: string; score: number; total: number; answers: Answer[] }
type QOption = { id: string; text: string }
type QQuestion = { id: string; text: string; options: QOption[] }

export default function QuizResultsPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [result, setResult] = useState<Result | null>(null)
  const [questions, setQuestions] = useState<QQuestion[]>([])
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    const stored = sessionStorage.getItem(`quiz_result_${id}`)
    if (!stored) { router.push(`/quiz/${id}`); return }
    setResult(JSON.parse(stored))

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
  const wrong = result.total - result.score

  let gradient, badgeText, badgeIcon
  if (pct >= 70) {
    gradient = 'linear-gradient(135deg,#064e3b,#16A34A)'
    badgeIcon = '🏆'; badgeText = `Отлично! ${pct}% правильных ответов`
  } else if (pct >= 50) {
    gradient = 'linear-gradient(135deg,#78350f,#D97706)'
    badgeIcon = '💪'; badgeText = `Неплохо, но можно лучше! ${pct}%`
  } else {
    gradient = 'linear-gradient(135deg,#7f1d1d,#DC2626)'
    badgeIcon = '📚'; badgeText = `Нужно ещё поработать. ${pct}%`
  }

  const qMap = new Map(questions.map(q => [q.id, q]))
  const visibleAnswers = showAll ? result.answers : result.answers.slice(0, 3)

  return (
    <div style={{ minHeight: '100vh', background: '#F7F6F2', fontFamily: 'Onest,sans-serif' }}>
      <style>{`
        @media (max-width: 768px) {
          .results-stats { gap: 16px !important; }
          .breakdown-opts { grid-template-columns: 1fr !important; }
          .result-actions { flex-direction: column; align-items: stretch !important; }
          .result-actions button, .result-actions a { width: 100%; justify-content: center; margin-left: 0 !important; }
        }
      `}</style>
      <Navbar />
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 16px 80px' }}>

        {/* Score hero */}
        <div style={{ background: gradient, borderRadius: '24px', padding: '48px 32px', textAlign: 'center', marginBottom: '28px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,.7)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Твой результат</div>
            <div style={{ fontSize: '72px', fontWeight: 900, color: '#fff', lineHeight: 1, letterSpacing: '-3px', marginBottom: '8px', fontFamily: 'Instrument Serif,serif' }}>
              {result.score}/{result.total}
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,.15)', borderRadius: '100px', padding: '6px 16px', fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '20px' }}>
              {badgeIcon} {badgeText}
            </div>
            <div className="results-stats" style={{ display: 'flex', justifyContent: 'center', gap: '32px', flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '22px', fontWeight: 900, color: '#fff' }}>{result.score}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,.65)', marginTop: '2px' }}>Правильных</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '22px', fontWeight: 900, color: 'rgba(255,255,255,.6)' }}>{wrong}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,.65)', marginTop: '2px' }}>Ошибок</div>
              </div>
            </div>
          </div>
        </div>

        {/* Motivation block for low scores */}
        {pct < 50 && (
          <div style={{ background: '#fff', border: '1.5px solid #BFCFFF', borderRadius: '20px', padding: '20px', marginBottom: '20px', display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#EEF3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>💡</div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#111', marginBottom: '4px' }}>Совет: повтори материал</div>
              <div style={{ fontSize: '13px', color: '#444', lineHeight: 1.6 }}>
                Ты ошибся в {wrong} вопросах. Разбери каждый, посмотри правильный ответ и пройди квиз снова. Практика — ключ к успеху.
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="result-actions" style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
          <Link href={`/quiz/${id}`}
            style={{ fontFamily: 'Onest,sans-serif', fontSize: '14px', fontWeight: 700, padding: '12px 24px', border: 'none', borderRadius: '12px', background: '#2563EB', color: '#fff', cursor: 'pointer', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
            🔄 Пройти снова
          </Link>
          <Link href="/dashboard"
            style={{ fontFamily: 'Onest,sans-serif', fontSize: '14px', fontWeight: 700, padding: '12px 24px', border: '1.5px solid #E2E0D8', borderRadius: '12px', background: '#fff', color: '#444', cursor: 'pointer', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
            ← На главную
          </Link>
        </div>

        {/* Question breakdown */}
        <div style={{ background: '#fff', border: '1px solid #E2E0D8', borderRadius: '20px', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E0D8', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ fontSize: '15px', fontWeight: 800, color: '#111' }}>Разбор ответов</span>
            <div style={{ display: 'flex', gap: '14px', fontSize: '12px', fontWeight: 700 }}>
              <span style={{ color: '#16A34A', display: 'flex', alignItems: 'center', gap: '4px' }}>✓ {result.score} правильных</span>
              <span style={{ color: '#DC2626', display: 'flex', alignItems: 'center', gap: '4px' }}>✕ {wrong} ошибок</span>
            </div>
          </div>

          {visibleAnswers.map((a, i) => {
            const q = qMap.get(a.questionId)
            if (!q) return null
            const opts = q.options
            return (
              <div key={a.questionId} style={{ padding: '20px', borderBottom: '1px solid #F8FAFC', background: a.correct ? 'transparent' : '#FFFBFB' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '14px' }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800,
                    background: a.correct ? '#F0FDF4' : '#FEF2F2',
                    border: `2px solid ${a.correct ? '#BBF7D0' : '#FECACA'}`,
                    color: a.correct ? '#16A34A' : '#DC2626',
                  }}>
                    {a.correct ? '✓' : '✕'}
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#999', marginBottom: '4px' }}>Вопрос {i + 1}</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#111' }}>{q.text}</div>
                  </div>
                </div>
                <div className="breakdown-opts" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginLeft: '40px' }}>
                  {opts.map(opt => {
                    const isCorrectOpt = opt.id === a.correctOption
                    const isChosenOpt  = opt.id === a.chosen
                    let style: React.CSSProperties = { padding: '9px 13px', borderRadius: '10px', fontSize: '13px', background: '#fff', border: '1.5px solid #E2E0D8', color: '#999' }
                    let suffix = ''
                    if (isCorrectOpt) {
                      style = { ...style, fontWeight: 700, background: '#F0FDF4', border: '1.5px solid #BBF7D0', color: '#16A34A' }
                      suffix = ' ✓'
                    }
                    if (isChosenOpt && !isCorrectOpt) {
                      style = { ...style, fontWeight: 700, background: '#FEF2F2', border: '1.5px solid #FECACA', color: '#DC2626' }
                      suffix = ' ← Твой ответ'
                    }
                    return (
                      <div key={opt.id} style={style}>
                        {opt.id}. {opt.text}{suffix}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}

          {!showAll && result.answers.length > 3 && (
            <div style={{ padding: '16px 20px', borderTop: '1px solid #E2E0D8', textAlign: 'center' }}>
              <button onClick={() => setShowAll(true)}
                style={{ fontFamily: 'Onest,sans-serif', fontSize: '13px', fontWeight: 700, padding: '9px 20px', border: '1.5px solid #E2E0D8', borderRadius: '10px', background: '#fff', color: '#444', cursor: 'pointer' }}>
                Показать все {result.total} вопросов ↓
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
