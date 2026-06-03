import Link from 'next/link'

const stats = [
  { value: '50 000+', label: 'Тестовых вопросов' },
  { value: '10 000+', label: 'Учеников' },
  { value: '94%', label: 'Сдали ЕНТ успешно' },
]

const subjects = [
  { name: 'Математика', icon: '📐', count: 8400 },
  { name: 'История Казахстана', icon: '📜', count: 6200 },
  { name: 'Грамотность чтения', icon: '📖', count: 4800 },
  { name: 'Математическая грамотность', icon: '🔢', count: 3600 },
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
    <div className="min-h-screen bg-[#FAFAF7]">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-[#FAFAF7]/90 backdrop-blur-md border-b border-[#E8E8E4]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 12L8 4L13 12H3Z" fill="white" />
              </svg>
            </div>
            <span className="font-bold text-[15px] tracking-tight">
              Qaz<span className="text-[#2563EB]">TestPrep</span>
            </span>
          </div>

          <ul className="hidden md:flex items-center gap-8 list-none">
            {['Предметы', 'Как работает', 'Цены'].map((item) => (
              <li key={item}>
                <a href={`#${item.toLowerCase()}`} className="text-sm font-medium text-[#4A4A4A] hover:text-[#1A1A1A] transition-colors">
                  {item}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="text-sm font-medium text-[#4A4A4A] hover:text-[#1A1A1A] transition-colors px-4 py-2"
            >
              Войти
            </Link>
            <Link
              href="/auth/register"
              className="text-sm font-semibold bg-[#2563EB] text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors"
            >
              Начать бесплатно
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-[#EEF3FF] text-[#2563EB] text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-[#2563EB] rounded-full"></span>
            Подготовка к ЕНТ 2025
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-[#1A1A1A] leading-[1.1] tracking-tight mb-6">
            Сдай ЕНТ на{' '}
            <span className="font-['Instrument_Serif'] italic text-[#2563EB]">140+</span>
            {' '}баллов
          </h1>

          <p className="text-lg text-[#4A4A4A] leading-relaxed mb-8 max-w-xl">
            Тысячи реальных тестовых вопросов, подробные объяснения и отслеживание прогресса. Готовься эффективно — в своём ритме.
          </p>

          <div className="flex items-center gap-4">
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 bg-[#2563EB] text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-blue-700 transition-all hover:shadow-lg hover:shadow-blue-200 text-sm"
            >
              Попробовать бесплатно
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <p className="text-xs text-[#9A9A9A]">Без карты. Бесплатно навсегда.</p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 flex flex-wrap gap-8">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold text-[#1A1A1A] tracking-tight">{s.value}</p>
              <p className="text-sm text-[#9A9A9A] mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SUBJECTS */}
      <section id="предметы" className="max-w-6xl mx-auto px-6 py-20">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-[#1A1A1A] tracking-tight mb-2">Все предметы ЕНТ</h2>
          <p className="text-[#4A4A4A]">Выбери предмет и начни решать прямо сейчас</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {subjects.map((subject) => (
            <div
              key={subject.name}
              className="bg-white border border-[#E8E8E4] rounded-2xl p-5 hover:border-[#BFCFFF] hover:shadow-sm transition-all cursor-pointer group"
            >
              <span className="text-2xl mb-3 block">{subject.icon}</span>
              <p className="font-semibold text-[#1A1A1A] text-sm leading-tight mb-1 group-hover:text-[#2563EB] transition-colors">
                {subject.name}
              </p>
              <p className="text-xs text-[#9A9A9A]">{subject.count.toLocaleString()} вопросов</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="как работает" className="bg-white border-y border-[#E8E8E4]">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-[#1A1A1A] tracking-tight mb-2">Как это работает</h2>
            <p className="text-[#4A4A4A]">Три шага до успешной сдачи ЕНТ</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.num} className="flex gap-4">
                <span className="text-4xl font-bold text-[#E8E8E4] leading-none shrink-0 font-['Instrument_Serif']">
                  {step.num}
                </span>
                <div>
                  <h3 className="font-semibold text-[#1A1A1A] mb-1">{step.title}</h3>
                  <p className="text-sm text-[#4A4A4A] leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="bg-[#2563EB] rounded-3xl px-10 py-14 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
            Готов начать подготовку?
          </h2>
          <p className="text-blue-200 mb-8 text-sm">
            Присоединяйся к тысячам учеников которые уже готовятся к ЕНТ
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 bg-white text-[#2563EB] font-semibold px-6 py-3.5 rounded-xl hover:bg-blue-50 transition-colors text-sm"
          >
            Зарегистрироваться бесплатно
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#E8E8E4] py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <span className="text-sm font-bold">
            Qaz<span className="text-[#2563EB]">TestPrep</span>
          </span>
          <p className="text-xs text-[#9A9A9A]">© 2025 QazTestPrep. Алматы, Казахстан</p>
        </div>
      </footer>

    </div>
  )
}
