'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'

type CourseMeta = { title: string; description: string; price: number; type: 'ENT'|'PBB'|'COMBO' }
type Quiz  = { id: string; title: string; subject: string; type: string; questions?: { length: number } | unknown[]; _count?: { questions: number } }
type Video = { id: string; title: string; subject: string; duration: string | null }

const TYPE_LABEL: Record<string, string> = { ENT: 'ЕНТ', PBB: 'ПББ', COMBO: 'Комбо' }
const SUBJECT_ICON: Record<string, string> = {
  'Математика': '📐', 'История Казахстана': '🏛️', 'Физика': '⚡', 'Химия': '🧪', 'Биология': '🧬',
  'География': '🌍', 'Информатика': '💻', 'Казахский язык': '🇰🇿', 'Русский язык': '🇷🇺',
}

// ─── STEP BAR ────────────────────────────────────────────────
function StepBar({ step }: { step: number }) {
  const steps = ['Основная информация', 'Выбор контента', 'Превью и публикация']
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '8px' }}>
      {steps.map((label, i) => {
        const num = i + 1
        const state = num < step ? 'done' : num === step ? 'active' : 'pending'
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
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
            {i < 2 && <div style={{ width: '40px', height: '2px', background: state === 'done' ? '#16A34A' : '#E2E0D8', margin: '0 8px' }} />}
          </div>
        )
      })}
    </div>
  )
}

// ─── STEP 1: META ────────────────────────────────────────────
function Step1({ meta, setMeta, onNext }: { meta: CourseMeta; setMeta: (m: CourseMeta) => void; onNext: () => void }) {
  const upd = (k: keyof CourseMeta, v: string | number) => setMeta({ ...meta, [k]: v })
  const valid = meta.title.length >= 3 && meta.type && meta.price >= 0

  const fi: React.CSSProperties = {
    width: '100%', fontFamily: 'Onest,sans-serif', fontSize: '14px', padding: '11px 14px',
    border: '1.5px solid #E2E0D8', borderRadius: '14px', background: '#F7F6F2', color: '#111',
    outline: 'none', boxSizing: 'border-box',
  }

  return (
    <div style={{ background: '#fff', border: '1px solid #E2E0D8', borderRadius: '20px', overflow: 'hidden', maxWidth: '600px' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9' }}>
        <span style={{ fontSize: '15px', fontWeight: 800, color: '#111' }}>📋 Шаг 1 из 3 — Информация о курсе</span>
      </div>
      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '18px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#111', marginBottom: '7px' }}>
            Название курса <span style={{ color: '#DC2626' }}>*</span>
          </label>
          <input value={meta.title} onChange={e => upd('title', e.target.value)}
            placeholder="Например: Полная подготовка по математике к ЕНТ 2025" style={fi} />
        </div>

        <div style={{ marginBottom: '18px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#111', marginBottom: '7px' }}>Описание</label>
          <textarea value={meta.description} onChange={e => upd('description', e.target.value)}
            placeholder="Расскажи, что входит в курс и для кого он подходит..."
            style={{ ...fi, resize: 'vertical', minHeight: '90px' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '8px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#111', marginBottom: '7px' }}>Тип <span style={{ color: '#DC2626' }}>*</span></label>
            <select value={meta.type} onChange={e => upd('type', e.target.value as 'ENT'|'PBB'|'COMBO')} style={{ ...fi, cursor: 'pointer' }}>
              <option value="ENT">ЕНТ</option>
              <option value="PBB">ПББ</option>
              <option value="COMBO">Комбо</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#111', marginBottom: '7px' }}>Цена (тг) <span style={{ color: '#DC2626' }}>*</span></label>
            <input type="number" value={meta.price} onChange={e => upd('price', Math.max(0, Number(e.target.value)))}
              min={0} placeholder="15000" style={fi} />
          </div>
        </div>
        <div style={{ fontSize: '12px', color: '#999', marginBottom: '20px' }}>Укажи 0 для бесплатного курса</div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onNext} disabled={!valid}
            style={{ fontFamily: 'Onest,sans-serif', fontSize: '14px', fontWeight: 700, padding: '11px 22px', border: 'none', borderRadius: '12px', background: valid ? '#2563EB' : '#E2E0D8', color: valid ? '#fff' : '#999', cursor: valid ? 'pointer' : 'not-allowed' }}>
            Далее: Выбор контента →
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── STEP 2: SELECT QUIZZES / VIDEOS ───────────────────────────
function Step2({ quizzes, videos, selectedQuizzes, selectedVideos, toggleQuiz, toggleVideo, selectAllQuizzes, selectAllVideos, onBack, onNext }: {
  quizzes: Quiz[]; videos: Video[]
  selectedQuizzes: Set<string>; selectedVideos: Set<string>
  toggleQuiz: (id: string) => void; toggleVideo: (id: string) => void
  selectAllQuizzes: () => void; selectAllVideos: () => void
  onBack: () => void; onNext: () => void
}) {
  return (
    <div>
      <style>{`@media(max-width:768px){.cc-grid2{grid-template-columns:1fr!important}}`}</style>

      {/* Counter */}
      <div style={{ background: '#fff', border: '1px solid #E2E0D8', borderRadius: '14px', padding: '14px 20px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#111' }}>
          Выбрано: <span style={{ color: '#2563EB' }}>{selectedQuizzes.size} квизов</span> и <span style={{ color: '#7C3AED' }}>{selectedVideos.size} видео</span>
        </span>
        <div style={{ display: 'flex', gap: '6px' }}>
          <div style={{ padding: '4px 10px', background: '#EEF3FF', borderRadius: '7px', fontSize: '12px', fontWeight: 700, color: '#2563EB' }}>📝 {selectedQuizzes.size}</div>
          <div style={{ padding: '4px 10px', background: '#F5F3FF', borderRadius: '7px', fontSize: '12px', fontWeight: 700, color: '#7C3AED' }}>🎬 {selectedVideos.size}</div>
        </div>
      </div>

      <div className="cc-grid2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Quizzes */}
        <div style={{ background: '#fff', border: '1px solid #E2E0D8', borderRadius: '20px', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '15px', fontWeight: 800, color: '#111' }}>📝 Мои квизы</span>
            <button onClick={selectAllQuizzes} style={{ fontFamily: 'Onest,sans-serif', fontSize: '12px', fontWeight: 700, padding: '7px 15px', border: '1.5px solid #E2E0D8', borderRadius: '9px', background: 'transparent', color: '#444', cursor: 'pointer' }}>Выбрать все</button>
          </div>
          <div style={{ padding: '20px' }}>
            {quizzes.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#999', fontSize: '13px', padding: '20px 0' }}>
                У вас нет квизов. <Link href="/teacher/quizzes/create" style={{ color: '#2563EB', fontWeight: 700, textDecoration: 'none' }}>Создать квиз →</Link>
              </div>
            ) : quizzes.map(q => {
              const checked = selectedQuizzes.has(q.id)
              return (
                <div key={q.id} onClick={() => toggleQuiz(q.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', border: `1.5px solid ${checked ? '#2563EB' : '#E2E0D8'}`, borderRadius: '14px', marginBottom: '10px', cursor: 'pointer', transition: 'all .15s', background: checked ? '#EEF3FF' : '#fff' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '7px', border: `2px solid ${checked ? '#2563EB' : '#E2E0D8'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: checked ? '#2563EB' : '#fff', color: '#fff', fontSize: '13px', fontWeight: 800 }}>
                    {checked ? '✓' : ''}
                  </div>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: checked ? '#fff' : '#F7F6F2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px', flexShrink: 0 }}>
                    {SUBJECT_ICON[q.subject] ?? '📝'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#111' }}>{q.title}</div>
                    <div style={{ fontSize: '12px', color: '#999', marginTop: '1px' }}>{q.subject} · {TYPE_LABEL[q.type] ?? q.type}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Videos */}
        <div style={{ background: '#fff', border: '1px solid #E2E0D8', borderRadius: '20px', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '15px', fontWeight: 800, color: '#111' }}>🎬 Мои видеоуроки</span>
            <button onClick={selectAllVideos} style={{ fontFamily: 'Onest,sans-serif', fontSize: '12px', fontWeight: 700, padding: '7px 15px', border: '1.5px solid #E2E0D8', borderRadius: '9px', background: 'transparent', color: '#444', cursor: 'pointer' }}>Выбрать все</button>
          </div>
          <div style={{ padding: '20px' }}>
            {videos.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#999', fontSize: '13px', padding: '20px 0' }}>
                У вас нет видео.
              </div>
            ) : videos.map(v => {
              const checked = selectedVideos.has(v.id)
              return (
                <div key={v.id} onClick={() => toggleVideo(v.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', border: `1.5px solid ${checked ? '#2563EB' : '#E2E0D8'}`, borderRadius: '14px', marginBottom: '10px', cursor: 'pointer', transition: 'all .15s', background: checked ? '#EEF3FF' : '#fff' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '7px', border: `2px solid ${checked ? '#2563EB' : '#E2E0D8'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: checked ? '#2563EB' : '#fff', color: '#fff', fontSize: '13px', fontWeight: 800 }}>
                    {checked ? '✓' : ''}
                  </div>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: checked ? '#fff' : '#F7F6F2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px', flexShrink: 0 }}>▶</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#111' }}>{v.title}</div>
                    <div style={{ fontSize: '12px', color: '#999', marginTop: '1px' }}>{v.subject}{v.duration ? ` · ${v.duration}` : ''}</div>
                  </div>
                </div>
              )
            })}
            <div style={{ marginTop: '8px', padding: '14px', background: '#F7F6F2', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#999' }}>
                Нет нужного видео? <Link href="/teacher/videos/create" style={{ color: '#2563EB', fontWeight: 700, textDecoration: 'none' }}>Создать видеоурок →</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #F1F5F9' }}>
        <button onClick={onBack} style={{ fontFamily: 'Onest,sans-serif', fontSize: '14px', fontWeight: 700, padding: '11px 22px', border: '1.5px solid #E2E0D8', borderRadius: '12px', background: 'transparent', color: '#444', cursor: 'pointer' }}>← Назад</button>
        <button onClick={onNext} disabled={selectedQuizzes.size === 0 && selectedVideos.size === 0}
          style={{ fontFamily: 'Onest,sans-serif', fontSize: '14px', fontWeight: 700, padding: '11px 22px', border: 'none', borderRadius: '12px', background: (selectedQuizzes.size > 0 || selectedVideos.size > 0) ? '#2563EB' : '#E2E0D8', color: (selectedQuizzes.size > 0 || selectedVideos.size > 0) ? '#fff' : '#999', cursor: (selectedQuizzes.size > 0 || selectedVideos.size > 0) ? 'pointer' : 'not-allowed' }}>
          Далее: Превью и публикация →
        </button>
      </div>
    </div>
  )
}

// ─── STEP 3: PREVIEW + PUBLISH ─────────────────────────────────
function Step3({ meta, quizzes, videos, selectedQuizzes, selectedVideos, onBack, onPublish, publishing }: {
  meta: CourseMeta
  quizzes: Quiz[]; videos: Video[]
  selectedQuizzes: Set<string>; selectedVideos: Set<string>
  onBack: () => void; onPublish: () => void; publishing: boolean
}) {
  const chosenQuizzes = quizzes.filter(q => selectedQuizzes.has(q.id))
  const chosenVideos  = videos.filter(v => selectedVideos.has(v.id))
  const canPublish = chosenQuizzes.length > 0 || chosenVideos.length > 0

  return (
    <div>
      <style>{`@media(max-width:768px){.cc-grid2{grid-template-columns:1fr!important}}`}</style>
      <div className="cc-grid2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: '#fff', border: '1px solid #E2E0D8', borderRadius: '20px', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9' }}>
              <span style={{ fontSize: '15px', fontWeight: 800, color: '#111' }}>📋 Информация о курсе</span>
            </div>
            <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div style={{ gridColumn: '1/-1' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', color: '#999', marginBottom: '5px' }}>Название</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#111' }}>{meta.title}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', color: '#999', marginBottom: '5px' }}>Тип</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#111' }}>{TYPE_LABEL[meta.type]}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', color: '#999', marginBottom: '5px' }}>Цена</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#111' }}>{meta.price > 0 ? `${meta.price.toLocaleString()} тг` : 'Бесплатно'}</div>
              </div>
            </div>
          </div>

          <div style={{ background: '#fff', border: '1px solid #E2E0D8', borderRadius: '20px', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9' }}>
              <span style={{ fontSize: '15px', fontWeight: 800, color: '#111' }}>📝 Квизы ({chosenQuizzes.length})</span>
            </div>
            <div style={{ padding: '12px 20px' }}>
              {chosenQuizzes.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#999', fontSize: '13px', padding: '8px 0' }}>Не выбраны</div>
              ) : chosenQuizzes.map((q, i) => (
                <div key={q.id} style={{ padding: '10px 0', borderBottom: i < chosenQuizzes.length - 1 ? '1px solid #F1F5F9' : 'none', fontSize: '13px', fontWeight: 600, color: '#444' }}>
                  {SUBJECT_ICON[q.subject] ?? '📝'} {q.title}
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: '#fff', border: '1px solid #E2E0D8', borderRadius: '20px', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9' }}>
              <span style={{ fontSize: '15px', fontWeight: 800, color: '#111' }}>🎬 Видео ({chosenVideos.length})</span>
            </div>
            <div style={{ padding: '12px 20px' }}>
              {chosenVideos.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#999', fontSize: '13px', padding: '8px 0' }}>Не выбраны</div>
              ) : chosenVideos.map((v, i) => (
                <div key={v.id} style={{ padding: '10px 0', borderBottom: i < chosenVideos.length - 1 ? '1px solid #F1F5F9' : 'none', fontSize: '13px', fontWeight: 600, color: '#444' }}>
                  ▶ {v.title}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: publish panel */}
        <div>
          <div style={{ background: '#fff', border: '1px solid #E2E0D8', borderRadius: '20px', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9' }}>
              <span style={{ fontSize: '15px', fontWeight: 800, color: '#111' }}>🚀 Публикация</span>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                {[
                  { ok: meta.title.length >= 3, label: 'Название заполнено' },
                  { ok: true, label: `Тип: ${TYPE_LABEL[meta.type]}, цена: ${meta.price > 0 ? meta.price.toLocaleString() + ' тг' : 'Бесплатно'}` },
                  { ok: canPublish, label: canPublish ? `Добавлено ${chosenQuizzes.length} квизов и ${chosenVideos.length} видео` : 'Выбери минимум 1 квиз или видео' },
                ].map((c, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, background: c.ok ? '#F0FDF4' : '#FEF2F2', color: c.ok ? '#16A34A' : '#DC2626' }}>
                      {c.ok ? '✓' : '✕'}
                    </div>
                    <span style={{ color: c.ok ? '#111' : '#DC2626' }}>{c.label}</span>
                  </div>
                ))}
              </div>

              <div style={{ height: '1px', background: '#F1F5F9', margin: '16px 0' }} />

              <div style={{ background: '#F7F6F2', border: '1px solid #E2E0D8', borderRadius: '12px', padding: '14px', marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#999', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '.5px' }}>После публикации</div>
                <div style={{ fontSize: '13px', color: '#444', lineHeight: 1.6 }}>Курс появится в каталоге /courses и станет доступен для покупки.</div>
              </div>

              <button onClick={onPublish} disabled={!canPublish || publishing}
                style={{ width: '100%', fontFamily: 'Onest,sans-serif', fontSize: '14px', fontWeight: 700, padding: '13px', border: 'none', borderRadius: '12px', background: canPublish && !publishing ? '#2563EB' : '#E2E0D8', color: canPublish && !publishing ? '#fff' : '#999', cursor: canPublish && !publishing ? 'pointer' : 'not-allowed' }}>
                {publishing ? '⏳ Публикуем...' : '🚀 Опубликовать курс'}
              </button>
            </div>
          </div>

          <button onClick={onBack} style={{ width: '100%', marginTop: '16px', fontFamily: 'Onest,sans-serif', fontSize: '14px', fontWeight: 700, padding: '11px', border: '1.5px solid #E2E0D8', borderRadius: '12px', background: 'transparent', color: '#444', cursor: 'pointer' }}>
            ← Вернуться к выбору контента
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── MAIN PAGE ───────────────────────────────────────────────
export default function CreateCoursePage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [courseId, setCourseId] = useState<string | null>(null)
  const [meta, setMeta] = useState<CourseMeta>({ title: '', description: '', price: 0, type: 'ENT' })
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [videos, setVideos] = useState<Video[]>([])
  const [selectedQuizzes, setSelectedQuizzes] = useState<Set<string>>(new Set())
  const [selectedVideos, setSelectedVideos] = useState<Set<string>>(new Set())
  const [publishing, setPublishing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/teacher/quizzes').then(r => r.json()).then(setQuizzes).catch(() => {})
    fetch('/api/teacher/videos').then(r => r.json()).then(setVideos).catch(() => {})
  }, [])

  const toggleQuiz = (id: string) => setSelectedQuizzes(prev => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })
  const toggleVideo = (id: string) => setSelectedVideos(prev => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })
  const selectAllQuizzes = () => setSelectedQuizzes(selectedQuizzes.size === quizzes.length ? new Set() : new Set(quizzes.map(q => q.id)))
  const selectAllVideos  = () => setSelectedVideos(selectedVideos.size === videos.length ? new Set() : new Set(videos.map(v => v.id)))

  const handleStep1Next = async () => {
    setError('')
    const res = await fetch('/api/teacher/courses', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: meta.title, description: meta.description || undefined, price: meta.price, type: meta.type }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error); return }
    setCourseId(data.id)
    setStep(2)
  }

  const handlePublish = async () => {
    if (!courseId) return
    setPublishing(true); setError('')

    const itemsRes = await fetch(`/api/teacher/courses/${courseId}/items`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quizIds: Array.from(selectedQuizzes), videoIds: Array.from(selectedVideos) }),
    })
    if (!itemsRes.ok) { const d = await itemsRes.json(); setError(d.error); setPublishing(false); return }

    const pubRes = await fetch(`/api/teacher/courses/${courseId}/publish`, { method: 'PUT' })
    if (!pubRes.ok) { const d = await pubRes.json(); setError(d.error); setPublishing(false); return }

    router.push('/teacher/courses')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F7F6F2', fontFamily: 'Onest,sans-serif' }}>
      <Navbar />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 16px' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#999', marginBottom: '24px' }}>
          <Link href="/teacher/courses" style={{ color: '#2563EB', fontWeight: 600, textDecoration: 'none' }}>Мои курсы</Link>
          <span>›</span>
          <span style={{ fontWeight: 600, color: '#111' }}>Создать курс</span>
        </div>

        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#111', letterSpacing: '-.5px', marginBottom: '4px' }}>
            {step === 1 ? 'Создать курс' : meta.title}
          </h1>
          <p style={{ fontSize: '14px', color: '#999' }}>
            {step === 1 ? 'Заполни основную информацию о курсе' : step === 2 ? 'Выбери квизы и видео, которые войдут в курс' : 'Проверь курс перед публикацией'}
          </p>
        </div>

        {error && (
          <div style={{ background: '#FEF2F2', border: '1.5px solid #FECACA', borderRadius: '12px', padding: '12px 16px', fontSize: '13px', color: '#DC2626', fontWeight: 600, marginBottom: '20px' }}>
            ⚠ {error}
          </div>
        )}

        <StepBar step={step} />

        {step === 1 && <Step1 meta={meta} setMeta={setMeta} onNext={handleStep1Next} />}
        {step === 2 && (
          <Step2
            quizzes={quizzes} videos={videos}
            selectedQuizzes={selectedQuizzes} selectedVideos={selectedVideos}
            toggleQuiz={toggleQuiz} toggleVideo={toggleVideo}
            selectAllQuizzes={selectAllQuizzes} selectAllVideos={selectAllVideos}
            onBack={() => setStep(1)} onNext={() => setStep(3)}
          />
        )}
        {step === 3 && (
          <Step3
            meta={meta} quizzes={quizzes} videos={videos}
            selectedQuizzes={selectedQuizzes} selectedVideos={selectedVideos}
            onBack={() => setStep(2)} onPublish={handlePublish} publishing={publishing}
          />
        )}
      </div>
    </div>
  )
}
