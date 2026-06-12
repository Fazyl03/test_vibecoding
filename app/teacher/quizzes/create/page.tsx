'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Link from 'next/link'

// ─── TYPES ───────────────────────────────────────────────────
type Option = { id: string; text: string }
type Question = {
  id: string
  text: string
  options: Option[]
  correctOption: string
}
type QuizMeta = {
  title: string
  subject: string
  type: 'ENT' | 'PBB' | 'COMBO'
  duration: number
  courseId: string
}

const SUBJECTS = ['Математика','История Казахстана','Физика','Химия','Биология','География','Информатика','Казахский язык','Русский язык']
const OPTION_LABELS = ['A','B','C','D']

function newQuestion(): Question {
  return {
    id: crypto.randomUUID(),
    text: '',
    options: OPTION_LABELS.map(l => ({ id: l, text: '' })),
    correctOption: '',
  }
}

// ─── STEP INDICATOR ──────────────────────────────────────────
function StepBar({ step }: { step: number }) {
  const steps = ['Основная информация', 'Вопросы', 'Превью и публикация']
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '8px' }}>
      {steps.map((label, i) => {
        const num = i + 1
        const state = num < step ? 'done' : num === step ? 'active' : 'pending'
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '14px', fontWeight: 800, flexShrink: 0,
                background: state === 'done' ? '#16A34A' : state === 'active' ? '#2563EB' : '#fff',
                color: state === 'pending' ? '#999' : '#fff',
                border: state === 'pending' ? '2px solid #E2E0D8' : 'none',
              }}>
                {state === 'done' ? '✓' : num}
              </div>
              <span style={{ fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap', color: state === 'active' ? '#2563EB' : state === 'done' ? '#16A34A' : '#999' }}>
                {label}
              </span>
            </div>
            {i < 2 && (
              <div style={{ width: '40px', height: '2px', background: state === 'done' ? '#16A34A' : '#E2E0D8', margin: '0 8px' }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── STEP 1: QUIZ META ────────────────────────────────────────
function Step1({ meta, setMeta, onNext }: { meta: QuizMeta; setMeta: (m: QuizMeta) => void; onNext: () => void }) {
  const upd = (k: keyof QuizMeta, v: string | number) => setMeta({ ...meta, [k]: v })
  const valid = meta.title.length >= 3 && meta.subject && meta.type && meta.duration > 0

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
      <style>{`@media(max-width:768px){.step1-grid{grid-template-columns:1fr!important}}`}</style>
      <div className="step1-grid" style={{ display: 'contents' }}>
      {/* Form */}
      <div style={{ background: '#fff', border: '1px solid #E2E0D8', borderRadius: '24px', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '15px', fontWeight: 700, color: '#111' }}>📋 Шаг 1 из 3 — Информация о квизе</span>
        </div>
        <div style={{ padding: '20px' }}>
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#111', marginBottom: '7px' }}>
              Название квиза <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <input value={meta.title} onChange={e => upd('title', e.target.value)}
              placeholder="Например: Квадратные уравнения — ЕНТ 2025"
              style={{ width: '100%', fontFamily: 'Onest,sans-serif', fontSize: '14px', padding: '11px 14px', border: '1.5px solid #E2E0D8', borderRadius: '14px', background: '#F7F6F2', color: '#111', outline: 'none' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#111', marginBottom: '7px' }}>Тип <span style={{ color: '#DC2626' }}>*</span></label>
              <select value={meta.type} onChange={e => upd('type', e.target.value as 'ENT'|'PBB'|'COMBO')}
                style={{ width: '100%', fontFamily: 'Onest,sans-serif', fontSize: '14px', padding: '11px 14px', border: '1.5px solid #E2E0D8', borderRadius: '14px', background: '#F7F6F2', color: '#111', outline: 'none', cursor: 'pointer' }}>
                <option value="ENT">ЕНТ</option>
                <option value="PBB">ПББ</option>
                <option value="COMBO">COMBO</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#111', marginBottom: '7px' }}>Длительность (мин) <span style={{ color: '#DC2626' }}>*</span></label>
              <input type="number" value={meta.duration} onChange={e => upd('duration', Number(e.target.value))}
                min={5} max={180} placeholder="40"
                style={{ width: '100%', fontFamily: 'Onest,sans-serif', fontSize: '14px', padding: '11px 14px', border: '1.5px solid #E2E0D8', borderRadius: '14px', background: '#F7F6F2', color: '#111', outline: 'none' }} />
            </div>
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#111', marginBottom: '7px' }}>Предмет <span style={{ color: '#DC2626' }}>*</span></label>
            <select value={meta.subject} onChange={e => upd('subject', e.target.value)}
              style={{ width: '100%', fontFamily: 'Onest,sans-serif', fontSize: '14px', padding: '11px 14px', border: '1.5px solid #E2E0D8', borderRadius: '14px', background: '#F7F6F2', color: '#111', outline: 'none', cursor: 'pointer' }}>
              <option value="">— Выберите предмет —</option>
              {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button onClick={onNext} disabled={!valid}
              style={{ fontFamily: 'Onest,sans-serif', fontSize: '14px', fontWeight: 700, padding: '11px 22px', border: 'none', borderRadius: '12px', background: valid ? '#2563EB' : '#E2E0D8', color: valid ? '#fff' : '#999', cursor: valid ? 'pointer' : 'not-allowed', display: 'inline-flex', alignItems: 'center', gap: '7px' }}>
              Далее: Добавить вопросы →
            </button>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div style={{ background: '#fff', border: '1px solid #E2E0D8', borderRadius: '24px', overflow: 'hidden', height: 'fit-content' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9' }}>
          <span style={{ fontSize: '15px', fontWeight: 700, color: '#111' }}>💡 Советы по созданию</span>
        </div>
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[
            { icon: '🎯', bg: '#EEF3FF', t: 'Выбирай конкретную тему', d: 'Лучше «Квадратные уравнения» чем «Алгебра» — ученики точнее знают что тренируют.' },
            { icon: '⏱', bg: '#F0FDF4', t: 'Оптимальное время', d: '~1.5 мин на вопрос. 20 вопросов → 30 мин.' },
            { icon: '📊', bg: '#FFFBEB', t: 'Минимум 1 вопрос', d: 'Публикация возможна только если добавлен хотя бы 1 вопрос.' },
          ].map((tip, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: tip.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', flexShrink: 0 }}>{tip.icon}</div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#111', marginBottom: '3px' }}>{tip.t}</div>
                <div style={{ fontSize: '12px', color: '#999', lineHeight: 1.5 }}>{tip.d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  )
}

// ─── STEP 2: QUESTIONS ────────────────────────────────────────
function Step2({ questions, setQuestions, onBack, onNext }: {
  questions: Question[]
  setQuestions: (q: Question[]) => void
  onBack: () => void
  onNext: () => void
}) {
  const addQuestion = () => setQuestions([...questions, newQuestion()])

  const updateQuestion = (idx: number, upd: Partial<Question>) => {
    const copy = [...questions]
    copy[idx] = { ...copy[idx], ...upd }
    setQuestions(copy)
  }

  const updateOption = (qIdx: number, optId: string, text: string) => {
    const copy = [...questions]
    copy[qIdx].options = copy[qIdx].options.map(o => o.id === optId ? { ...o, text } : o)
    setQuestions(copy)
  }

  const removeQuestion = (idx: number) => setQuestions(questions.filter((_, i) => i !== idx))

  const moveQuestion = (idx: number, dir: -1 | 1) => {
    const copy = [...questions]
    const target = idx + dir
    if (target < 0 || target >= copy.length) return;
    [copy[idx], copy[target]] = [copy[target], copy[idx]]
    setQuestions(copy)
  }

  const IS = (style: string): React.CSSProperties => ({
    fontFamily: 'Onest,sans-serif', fontSize: '14px', padding: '11px 14px',
    border: '1.5px solid #E2E0D8', borderRadius: '14px', background: '#F7F6F2',
    color: '#111', outline: 'none', width: '100%',
    ...(style === 'focus' ? { borderColor: '#2563EB', background: '#fff' } : {}),
  })

  return (
    <div>
      <style>{`@media(max-width:768px){.opts-grid{grid-template-columns:1fr!important}}`}</style>
      {/* Counter */}
      <div style={{ background: '#fff', border: '1px solid #E2E0D8', borderRadius: '14px', padding: '14px 20px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2563EB' }} />
          <span style={{ fontSize: '13px', fontWeight: 700 }}>{questions.length} {questions.length === 1 ? 'вопрос' : 'вопроса'} добавлено</span>
          <span style={{ fontSize: '13px', color: '#999' }}>Рекомендуется: 15–30</span>
        </div>
        <div style={{ background: '#EEF3FF', borderRadius: '7px', padding: '4px 10px', fontSize: '12px', fontWeight: 700, color: '#2563EB' }}>
          ≈ {(questions.length * 1.5).toFixed(0)} мин
        </div>
      </div>

      {/* Questions */}
      {questions.map((q, qi) => (
        <div key={q.id} style={{ background: '#fff', border: '1.5px solid #E2E0D8', borderRadius: '20px', padding: '20px', marginBottom: '14px' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#2563EB', background: '#EEF3FF', padding: '4px 10px', borderRadius: '7px' }}>
              Вопрос {qi + 1}
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={() => moveQuestion(qi, -1)} disabled={qi === 0}
                style={{ fontFamily: 'Onest,sans-serif', fontSize: '12px', fontWeight: 700, padding: '6px 10px', border: '1.5px solid #E2E0D8', borderRadius: '9px', background: 'transparent', color: qi === 0 ? '#ccc' : '#444', cursor: qi === 0 ? 'not-allowed' : 'pointer' }}>⬆</button>
              <button onClick={() => moveQuestion(qi, 1)} disabled={qi === questions.length - 1}
                style={{ fontFamily: 'Onest,sans-serif', fontSize: '12px', fontWeight: 700, padding: '6px 10px', border: '1.5px solid #E2E0D8', borderRadius: '9px', background: 'transparent', color: qi === questions.length - 1 ? '#ccc' : '#444', cursor: qi === questions.length - 1 ? 'not-allowed' : 'pointer' }}>⬇</button>
              <button onClick={() => removeQuestion(qi)}
                style={{ fontFamily: 'Onest,sans-serif', fontSize: '12px', fontWeight: 700, padding: '6px 13px', border: '1.5px solid #FECACA', borderRadius: '9px', background: '#FEF2F2', color: '#DC2626', cursor: 'pointer' }}>Удалить</button>
            </div>
          </div>

          {/* Question text */}
          <input value={q.text} onChange={e => updateQuestion(qi, { text: e.target.value })}
            placeholder="Введите текст вопроса..."
            style={{ ...IS(''), marginBottom: '14px', fontWeight: 600 }} />

          {/* Options */}
          <div className="opts-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {q.options.map(opt => (
              <div key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#999', width: '20px', textAlign: 'center' }}>{opt.id}</span>
                <div onClick={() => updateQuestion(qi, { correctOption: opt.id })}
                  style={{
                    width: '18px', height: '18px', borderRadius: '50%', border: '2px solid',
                    borderColor: q.correctOption === opt.id ? '#16A34A' : '#E2E0D8',
                    background: q.correctOption === opt.id ? '#16A34A' : '#fff',
                    cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                  {q.correctOption === opt.id && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff' }} />}
                </div>
                <input value={opt.text} onChange={e => updateOption(qi, opt.id, e.target.value)}
                  placeholder={`Вариант ${opt.id}`}
                  style={{
                    flex: 1, fontFamily: 'Onest,sans-serif', fontSize: '13px', padding: '9px 12px',
                    border: '1.5px solid', borderColor: q.correctOption === opt.id ? '#16A34A' : '#E2E0D8',
                    borderRadius: '10px', background: q.correctOption === opt.id ? '#F0FDF4' : '#F7F6F2',
                    color: '#111', outline: 'none',
                  }} />
              </div>
            ))}
          </div>

          {q.correctOption && (
            <div style={{ marginTop: '12px', fontSize: '12px', color: '#16A34A', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
              ✓ Правильный ответ: {q.correctOption} — {q.options.find(o => o.id === q.correctOption)?.text}
            </div>
          )}
          {!q.correctOption && q.text && (
            <div style={{ marginTop: '12px', fontSize: '12px', color: '#999' }}>
              👆 Нажми на кружок рядом с вариантом чтобы отметить правильный ответ
            </div>
          )}
        </div>
      ))}

      {/* Add question */}
      <button onClick={addQuestion}
        style={{ width: '100%', padding: '14px', border: '2px dashed #E2E0D8', borderRadius: '20px', background: 'transparent', fontFamily: 'Onest,sans-serif', fontSize: '14px', fontWeight: 700, color: '#999', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        <span style={{ fontSize: '18px' }}>＋</span> Добавить вопрос
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #F1F5F9' }}>
        <button onClick={onBack} style={{ fontFamily: 'Onest,sans-serif', fontSize: '14px', fontWeight: 700, padding: '11px 22px', border: '1.5px solid #E2E0D8', borderRadius: '12px', background: 'transparent', color: '#444', cursor: 'pointer' }}>
          ← Назад
        </button>
        <button onClick={onNext} disabled={questions.length === 0}
          style={{ fontFamily: 'Onest,sans-serif', fontSize: '14px', fontWeight: 700, padding: '11px 22px', border: 'none', borderRadius: '12px', background: questions.length > 0 ? '#2563EB' : '#E2E0D8', color: questions.length > 0 ? '#fff' : '#999', cursor: questions.length > 0 ? 'pointer' : 'not-allowed' }}>
          Далее: Превью и публикация →
        </button>
      </div>
    </div>
  )
}

// ─── STEP 3: PREVIEW + PUBLISH ────────────────────────────────
function Step3({ meta, questions, onBack, onPublish, publishing }: {
  meta: QuizMeta
  questions: Question[]
  onBack: () => void
  onPublish: () => void
  publishing: boolean
}) {
  const typeLabel: Record<string, string> = { ENT: 'ЕНТ', PBB: 'ПББ', COMBO: 'Комбо' }
  const typeColor: Record<string, string> = { ENT: '#2563EB', PBB: '#D97706', COMBO: '#7C3AED' }
  const typeBg: Record<string, string> = { ENT: '#EEF3FF', PBB: '#FFFBEB', COMBO: '#F5F3FF' }

  const incomplete = questions.filter(q => !q.text || !q.correctOption || q.options.some(o => !o.text))
  const canPublish = questions.length > 0 && incomplete.length === 0

  const checks = [
    { ok: meta.title.length >= 3, label: 'Название заполнено' },
    { ok: !!meta.subject, label: 'Предмет указан' },
    { ok: questions.length > 0, label: `Добавлено ${questions.length} вопросов` },
    { ok: incomplete.length === 0, label: incomplete.length > 0 ? `${incomplete.length} вопроса не заполнены` : 'Все вопросы заполнены' },
  ]

  return (
    <div>
      <style>{`@media(max-width:768px){.step3-grid{grid-template-columns:1fr!important}}`}</style>
      <div className="step3-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Left: meta + questions preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Meta */}
          <div style={{ background: '#fff', border: '1px solid #E2E0D8', borderRadius: '24px', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '15px', fontWeight: 700 }}>📋 Информация о квизе</span>
              <button onClick={onBack} style={{ fontFamily: 'Onest,sans-serif', fontSize: '12px', fontWeight: 700, padding: '6px 13px', border: '1.5px solid #E2E0D8', borderRadius: '9px', background: 'transparent', color: '#444', cursor: 'pointer' }}>Изменить</button>
            </div>
            <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              {[
                { label: 'Название', val: meta.title },
                { label: 'Предмет', val: meta.subject },
                { label: 'Тип', val: <span style={{ background: typeBg[meta.type], color: typeColor[meta.type], fontSize: '11px', fontWeight: 700, padding: '3px 9px', borderRadius: '7px', textTransform: 'uppercase' }}>{typeLabel[meta.type]}</span> },
                { label: 'Длительность', val: `${meta.duration} минут` },
              ].map((row, i) => (
                <div key={i}>
                  <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', color: '#999', marginBottom: '5px' }}>{row.label}</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#111' }}>{row.val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Questions preview */}
          <div style={{ background: '#fff', border: '1px solid #E2E0D8', borderRadius: '24px', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '15px', fontWeight: 700 }}>❓ Вопросы ({questions.length})</span>
              <button onClick={onBack} style={{ fontFamily: 'Onest,sans-serif', fontSize: '12px', fontWeight: 700, padding: '6px 13px', border: '1.5px solid #E2E0D8', borderRadius: '9px', background: 'transparent', color: '#444', cursor: 'pointer' }}>Изменить</button>
            </div>
            <div style={{ padding: '0 20px' }}>
              {questions.map((q, i) => (
                <div key={q.id} style={{ padding: '16px 0', borderBottom: i < questions.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: q.text ? '#111' : '#999', fontStyle: q.text ? 'normal' : 'italic', marginBottom: '10px' }}>
                    {i + 1}. {q.text || '(Вопрос не заполнен)'}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                    {q.options.map(opt => (
                      <div key={opt.id} style={{
                        padding: '8px 12px', borderRadius: '10px', fontSize: '13px', fontWeight: q.correctOption === opt.id ? 700 : 500,
                        border: '1.5px solid', borderColor: q.correctOption === opt.id ? '#16A34A' : '#E2E0D8',
                        background: q.correctOption === opt.id ? '#F0FDF4' : '#F7F6F2',
                        color: q.correctOption === opt.id ? '#16A34A' : '#444',
                      }}>
                        {opt.id}. {opt.text || <em style={{ color: '#ccc' }}>пусто</em>}
                        {q.correctOption === opt.id && ' ✓'}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: publish panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Checklist */}
          <div style={{ background: '#fff', border: '1px solid #E2E0D8', borderRadius: '24px', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9' }}>
              <span style={{ fontSize: '15px', fontWeight: 700 }}>🚀 Публикация</span>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                {checks.map((c, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, background: c.ok ? '#F0FDF4' : '#FEF2F2', color: c.ok ? '#16A34A' : '#DC2626' }}>
                      {c.ok ? '✓' : '✕'}
                    </div>
                    <span style={{ color: c.ok ? '#111' : '#DC2626' }}>{c.label}</span>
                  </div>
                ))}
              </div>

              <div style={{ height: '1px', background: '#F1F5F9', margin: '20px 0' }} />

              <div style={{ background: '#F7F6F2', border: '1px solid #E2E0D8', borderRadius: '12px', padding: '14px', marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#999', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '.5px' }}>После публикации</div>
                <div style={{ fontSize: '13px', color: '#444', lineHeight: 1.6 }}>Квиз появится на странице /quizzes и станет доступен всем ученикам.</div>
              </div>

              <button onClick={onPublish} disabled={!canPublish || publishing}
                style={{ width: '100%', fontFamily: 'Onest,sans-serif', fontSize: '14px', fontWeight: 700, padding: '13px', border: 'none', borderRadius: '12px', background: canPublish && !publishing ? '#2563EB' : '#E2E0D8', color: canPublish && !publishing ? '#fff' : '#999', cursor: canPublish && !publishing ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                {publishing ? '⏳ Публикуем...' : '🚀 Опубликовать квиз'}
              </button>
              {!canPublish && <div style={{ textAlign: 'center', fontSize: '12px', color: '#999', marginTop: '8px' }}>Исправь ошибки выше чтобы опубликовать</div>}
            </div>
          </div>

          <button onClick={onBack} style={{ fontFamily: 'Onest,sans-serif', fontSize: '14px', fontWeight: 700, padding: '11px', border: '1.5px solid #E2E0D8', borderRadius: '12px', background: 'transparent', color: '#444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px' }}>
            ← Вернуться к вопросам
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── MAIN PAGE ────────────────────────────────────────────────
export default function CreateQuizPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [quizId, setQuizId] = useState<string | null>(null)
  const [publishing, setPublishing] = useState(false)
  const [error, setError] = useState('')

  const [meta, setMeta] = useState<QuizMeta>({
    title: '', subject: '', type: 'ENT', duration: 40, courseId: '',
  })
  const [questions, setQuestions] = useState<Question[]>([newQuestion()])

  const handleStep1Next = async () => {
    setError('')
    try {
      const res = await fetch('/api/teacher/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: meta.title, subject: meta.subject, type: meta.type, duration: meta.duration }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      setQuizId(data.id)
      setStep(2)
    } catch { setError('Ошибка соединения') }
  }

  const handlePublish = async () => {
    if (!quizId) return
    setPublishing(true)
    setError('')
    try {
      // Save all questions
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i]
        const res = await fetch(`/api/teacher/quizzes/${quizId}/questions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: q.text, options: q.options, correctOption: q.correctOption, order: i }),
        })
        if (!res.ok) { const d = await res.json(); setError(d.error); setPublishing(false); return }
      }
      // Publish
      const res = await fetch(`/api/teacher/quizzes/${quizId}/publish`, { method: 'PUT' })
      if (!res.ok) { const d = await res.json(); setError(d.error); setPublishing(false); return }
      router.push('/dashboard?published=1')
    } catch { setError('Ошибка соединения'); setPublishing(false) }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F7F6F2', fontFamily: 'Onest,sans-serif' }}>
      <Navbar />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 16px' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#999', marginBottom: '24px' }}>
          <Link href="/dashboard" style={{ color: '#2563EB', fontWeight: 600, textDecoration: 'none' }}>Кабинет</Link>
          <span>›</span>
          <span style={{ fontWeight: 600, color: '#111' }}>Создать квиз</span>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#111', letterSpacing: '-.5px', marginBottom: '4px' }}>Создать квиз</h1>
          <p style={{ fontSize: '14px', color: '#999' }}>
            {step === 1 ? 'Заполни основную информацию о квизе' : step === 2 ? 'Добавь вопросы и варианты ответов' : 'Проверь квиз перед публикацией'}
          </p>
        </div>

        {error && (
          <div style={{ background: '#FEF2F2', border: '1.5px solid #FECACA', borderRadius: '12px', padding: '12px 16px', fontSize: '13px', color: '#DC2626', fontWeight: 600, marginBottom: '20px' }}>
            ⚠ {error}
          </div>
        )}

        <StepBar step={step} />

        {step === 1 && <Step1 meta={meta} setMeta={setMeta} onNext={handleStep1Next} />}
        {step === 2 && <Step2 questions={questions} setQuestions={setQuestions} onBack={() => setStep(1)} onNext={() => setStep(3)} />}
        {step === 3 && <Step3 meta={meta} questions={questions} onBack={() => setStep(2)} onPublish={handlePublish} publishing={publishing} />}
      </div>
    </div>
  )
}
