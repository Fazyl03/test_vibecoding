import Navbar from '@/components/layout/Navbar'
import Link from 'next/link'

const team = [
  { name: 'Айгерим Мусаева', role: 'Учитель математики', exp: '8 лет опыта', emoji: '👩‍🏫' },
  { name: 'Болат Сейткали', role: 'Учитель истории', exp: '12 лет опыта', emoji: '👨‍🏫' },
  { name: 'Дина Касымова', role: 'Учитель физики и химии', exp: '6 лет опыта', emoji: '👩‍🔬' },
]

const values = [
  { emoji: '🎯', title: 'Доступность', desc: 'Качественная подготовка к ЕНТ должна быть доступна каждому ученику Казахстана.' },
  { emoji: '📈', title: 'Результат', desc: 'Мы фокусируемся на реальном росте баллов, а не просто на количестве материала.' },
  { emoji: '🤝', title: 'Сообщество', desc: 'Ученики и учителя на одной платформе — вместе к общей цели.' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <Navbar />

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-12">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-[#EEF3FF] text-[#2563EB] text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-[#2563EB] rounded-full"/>
            О платформе
          </div>
          <h1 className="text-4xl font-bold text-[#1A1A1A] tracking-tight mb-4">
            Мы помогаем казахстанским{' '}
            <span className="font-['Instrument_Serif'] italic text-[#2563EB]">ученикам</span>{' '}
            сдать ЕНТ
          </h1>
          <p className="text-[#4A4A4A] leading-relaxed">
            QazTestPrep — образовательная платформа для подготовки к Единому Национальному Тестированию. Мы объединяем лучших учителей Казахстана и создаём инструменты, которые делают подготовку эффективной и понятной.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white border-y border-[#E8E8E4]">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold text-[#1A1A1A] tracking-tight mb-8">Наши ценности</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {values.map(v => (
              <div key={v.title} className="flex gap-4">
                <span className="text-2xl shrink-0">{v.emoji}</span>
                <div>
                  <h3 className="font-semibold text-[#1A1A1A] mb-1">{v.title}</h3>
                  <p className="text-sm text-[#4A4A4A] leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-[#1A1A1A] tracking-tight mb-8">Наша команда</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {team.map(t => (
            <div key={t.name} className="bg-white border border-[#E8E8E4] rounded-2xl p-6 text-center hover:border-[#BFCFFF] transition">
              <span className="text-5xl block mb-3">{t.emoji}</span>
              <h3 className="font-semibold text-[#1A1A1A] mb-1">{t.name}</h3>
              <p className="text-sm text-[#2563EB] font-medium mb-1">{t.role}</p>
              <p className="text-xs text-[#9A9A9A]">{t.exp}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="bg-[#2563EB] rounded-3xl px-10 py-12 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Присоединяйся к нам</h2>
          <p className="text-blue-200 text-sm mb-6">Тысячи учеников уже готовятся к ЕНТ вместе с нами</p>
          <Link href="/auth/register"
            className="inline-flex items-center gap-2 bg-white text-[#2563EB] font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition text-sm">
            Зарегистрироваться бесплатно
          </Link>
        </div>
      </section>

      <footer className="border-t border-[#E8E8E4] py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <span className="text-sm font-bold">Qaz<span className="text-[#2563EB]">TestPrep</span></span>
          <p className="text-xs text-[#9A9A9A]">© 2025 QazTestPrep. Алматы, Казахстан</p>
        </div>
      </footer>
    </div>
  )
}
