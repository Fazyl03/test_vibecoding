import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'

const stats = [
  { value: '50 000+', label: 'Тестовых вопросов' },
  { value: '10 000+', label: 'Учеников' },
  { value: '94%', label: 'Сдали ЕНТ успешно' },
]

const subjects = [
  { name: 'Математика', icon: '📐', count: 8400 },
  { name: 'История Казахстана', icon: '📜', count: 6200 },
  { name: 'Грамотность чтения', icon: '📖', count: 4800 },
  { name: 'Матем. грамотность', icon: '🔢', count: 3600 },
  { name: 'Физика', icon: '⚡', count: 5100 },
  { name: 'Химия', icon: '🧪', count: 4300 },
  { name: 'Биология', icon: '🧬', count: 4700 },
  { name: 'География', icon: '🌍', count: 3900 },
]

const steps = [
  { num: '01', title: 'Зарегистрируйся', desc: 'Создай аккаунт за 30 секунд — только email и пароль.' },
  { num: '02', title: 'Выбери предмет', desc: 'Открой нужный предмет и начни решать тесты в своём темпе.' },
  { num: '03', title: 'Следи за прогрессом', desc: 'Видишь свои результаты, слабые темы и динамику роста.' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F7F6F2]">
      <Navbar />

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#EEF3FF] text-[#2563EB] text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-[#BFCFFF]">
              <span className="w-1.5 h-1.5 bg-[#2563EB] rounded-full animate-pulse"/>
              Подготовка к ЕНТ 2025
            </div>

            <h1 className="text-5xl lg:text-6xl font-black text-[#111111] leading-[1.05] tracking-tight mb-6">
              Сдай ЕНТ на{' '}
              <span className="font-['Instrument_Serif'] italic font-normal text-[#2563EB]">140+</span>
              {' '}баллов
            </h1>

            <p className="text-lg text-[#444444] leading-relaxed mb-8 max-w-lg">
              Тысячи реальных тестовых вопросов, видеоуроки от лучших учителей и умная аналитика прогресса.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link href="/auth/register"
                className="inline-flex items-center gap-2.5 bg-[#2563EB] text-white font-bold px-7 py-4 rounded-2xl hover:bg-[#1A44C2] transition-all hover:shadow-xl hover:shadow-blue-200 hover:-translate-y-0.5 text-sm">
                Начать бесплатно
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link href="/quizzes"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#444444] hover:text-[#111111] transition-colors px-4 py-4">
                Смотреть квизы →
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-12 flex flex-wrap gap-8 pt-8 border-t border-[#E2E0D8]">
              {stats.map(s => (
                <div key={s.label}>
                  <p className="text-2xl font-black text-[#111111]">{s.value}</p>
                  <p className="text-xs text-[#999999] mt-0.5 font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero visual */}
          <div className="hidden lg:block relative">
            <div className="bg-white rounded-3xl border border-[#E2E0D8] p-6 shadow-xl shadow-black/5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-[#111111]">Твой прогресс</span>
                <span className="text-xs text-[#2563EB] font-semibold bg-[#EEF3FF] px-2.5 py-1 rounded-full">Неделя 3</span>
              </div>
              <div className="space-y-3 mb-5">
                {[
                  { name: 'Математика', pct: 78, color: '#2563EB' },
                  { name: 'История KZ', pct: 91, color: '#10B981' },
                  { name: 'Физика', pct: 54, color: '#F59E0B' },
                ].map(s => (
                  <div key={s.name}>
                    <div className="flex justify-between text-xs font-medium mb-1.5">
                      <span className="text-[#444444]">{s.name}</span>
                      <span style={{ color: s.color }}>{s.pct}%</span>
                    </div>
                    <div className="h-2 bg-[#F7F6F2] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${s.pct}%`, background: s.color }}/>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-[#EEF3FF] rounded-2xl p-4">
                <p className="text-xs font-semibold text-[#2563EB] mb-1">💡 Рекомендация</p>
                <p className="text-xs text-[#444444]">Пройди 3 квиза по Физике — тема Механика</p>
              </div>
            </div>
            {/* Floating badge */}
            <div className="absolute -top-4 -right-4 bg-[#111111] text-white text-xs font-bold px-4 py-2 rounded-2xl shadow-lg">
              🔥 573 ученика онлайн
            </div>
          </div>
        </div>
      </section>

      {/* SUBJECTS */}
      <section className="bg-white border-y border-[#E2E0D8]">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black text-[#111111] tracking-tight mb-1">Все предметы ЕНТ</h2>
              <p className="text-[#444444] text-sm">Выбери предмет и начни прямо сейчас</p>
            </div>
            <Link href="/quizzes" className="text-sm font-semibold text-[#2563EB] hover:text-[#1A44C2] transition hidden md:block">
              Все квизы →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {subjects.map(s => (
              <Link href="/quizzes" key={s.name}
                className="group bg-[#F7F6F2] border border-[#E2E0D8] rounded-2xl p-5 hover:bg-[#EEF3FF] hover:border-[#BFCFFF] transition-all">
                <span className="text-2xl mb-3 block">{s.icon}</span>
                <p className="font-bold text-[#111111] text-sm leading-tight mb-1 group-hover:text-[#2563EB] transition-colors">{s.name}</p>
                <p className="text-xs text-[#999999] font-medium">{s.count.toLocaleString()} вопросов</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="mb-12">
          <h2 className="text-3xl font-black text-[#111111] tracking-tight mb-1">Как это работает</h2>
          <p className="text-[#444444] text-sm">Три шага до успешной сдачи ЕНТ</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map(step => (
            <div key={step.num} className="bg-white border border-[#E2E0D8] rounded-3xl p-7">
              <span className="text-5xl font-['Instrument_Serif'] italic text-[#E2E0D8] leading-none block mb-4">{step.num}</span>
              <h3 className="font-black text-[#111111] mb-2">{step.title}</h3>
              <p className="text-sm text-[#444444] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="bg-[#111111] rounded-3xl px-10 py-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/20 to-transparent pointer-events-none"/>
          <h2 className="text-3xl font-black text-white tracking-tight mb-3 relative">
            Готов начать подготовку?
          </h2>
          <p className="text-white/50 mb-8 text-sm relative">
            Присоединяйся к тысячам учеников которые уже готовятся к ЕНТ
          </p>
          <Link href="/auth/register"
            className="inline-flex items-center gap-2 bg-white text-[#111111] font-bold px-7 py-3.5 rounded-2xl hover:bg-[#F7F6F2] transition-colors text-sm relative">
            Зарегистрироваться бесплатно
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#E2E0D8] py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#2563EB] rounded-lg flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 12L8 4L13 12H3Z" fill="white"/></svg>
            </div>
            <span className="text-sm font-black">Qaz<span className="text-[#2563EB]">TestPrep</span></span>
          </div>
          <p className="text-xs text-[#999999]">© 2025 QazTestPrep. Алматы, Казахстан</p>
        </div>
      </footer>
    </div>
  )
}
