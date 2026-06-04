import Navbar from '@/components/layout/Navbar'
import Link from 'next/link'

const team = [
  { name: 'Айгерим Мусаева', role: 'Учитель математики', exp: '8 лет опыта', emoji: '👩‍🏫' },
  { name: 'Болат Сейткали', role: 'Учитель истории', exp: '12 лет опыта', emoji: '👨‍🏫' },
  { name: 'Дина Касымова', role: 'Физика и химия', exp: '6 лет опыта', emoji: '👩‍🔬' },
]

const values = [
  { emoji: '🎯', title: 'Доступность', desc: 'Качественная подготовка к ЕНТ должна быть доступна каждому ученику Казахстана.' },
  { emoji: '📈', title: 'Результат', desc: 'Мы фокусируемся на реальном росте баллов, а не просто на количестве материала.' },
  { emoji: '🤝', title: 'Сообщество', desc: 'Ученики и учителя на одной платформе — вместе к общей цели.' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F7F6F2]">
      <Navbar />

      <section className="max-w-6xl mx-auto px-6 pt-16 pb-12">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-[#EEF3FF] text-[#2563EB] text-xs font-bold px-3 py-1.5 rounded-full mb-6 border border-[#BFCFFF]">
            <span className="w-1.5 h-1.5 bg-[#2563EB] rounded-full"/>
            О платформе
          </div>
          <h1 className="text-4xl font-black text-[#111111] tracking-tight mb-4">
            Мы помогаем казахстанским{' '}
            <span className="font-['Instrument_Serif'] italic font-normal text-[#2563EB]">ученикам</span>{' '}
            сдать ЕНТ
          </h1>
          <p className="text-[#444444] leading-relaxed">
            QazTestPrep — образовательная платформа для подготовки к ЕНТ. Мы объединяем лучших учителей Казахстана и создаём инструменты, которые делают подготовку эффективной.
          </p>
        </div>
      </section>

      <section className="bg-white border-y border-[#E2E0D8]">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-black text-[#111111] tracking-tight mb-8">Наши ценности</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {values.map(v => (
              <div key={v.title} className="flex gap-4">
                <div className="w-10 h-10 bg-[#EEF3FF] rounded-2xl flex items-center justify-center text-xl shrink-0">{v.emoji}</div>
                <div>
                  <h3 className="font-black text-[#111111] mb-1">{v.title}</h3>
                  <p className="text-sm text-[#444444] leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-black text-[#111111] tracking-tight mb-8">Наша команда</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {team.map(t => (
            <div key={t.name} className="bg-white border border-[#E2E0D8] rounded-3xl p-7 text-center hover:border-[#BFCFFF] hover:shadow-md hover:shadow-black/5 transition-all">
              <span className="text-5xl block mb-4">{t.emoji}</span>
              <h3 className="font-black text-[#111111] mb-1">{t.name}</h3>
              <p className="text-sm text-[#2563EB] font-bold mb-1">{t.role}</p>
              <p className="text-xs text-[#999999] font-semibold">{t.exp}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="bg-[#111111] rounded-3xl px-10 py-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/20 to-transparent pointer-events-none"/>
          <h2 className="text-2xl font-black text-white mb-3 relative">Присоединяйся к нам</h2>
          <p className="text-white/50 text-sm mb-6 relative">Тысячи учеников уже готовятся к ЕНТ вместе с нами</p>
          <Link href="/auth/register"
            className="inline-flex items-center gap-2 bg-white text-[#111111] font-bold px-7 py-3.5 rounded-2xl hover:bg-[#F7F6F2] transition text-sm relative">
            Зарегистрироваться бесплатно
          </Link>
        </div>
      </section>

      <footer className="border-t border-[#E2E0D8] py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <span className="text-sm font-black">Qaz<span className="text-[#2563EB]">TestPrep</span></span>
          <p className="text-xs text-[#999999]">© 2025 QazTestPrep. Алматы, Казахстан</p>
        </div>
      </footer>
    </div>
  )
}
