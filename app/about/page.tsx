import Navbar from '@/components/layout/Navbar'
import Link from 'next/link'

const team = [
  { name: 'Айгерим Мусаева', role: 'Учитель математики', exp: '8 лет опыта', emoji: '👩‍🏫' },
  { name: 'Болат Сейткали', role: 'Учитель истории', exp: '12 лет опыта', emoji: '👨‍🏫' },
  { name: 'Дина Касымова', role: 'Физика и химия', exp: '6 лет опыта', emoji: '👩‍🔬' },
]

export default function AboutPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: 'Inter,sans-serif' }}>
      <Navbar />
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ marginBottom: '48px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#2563EB', marginBottom: '10px' }}>О ПЛАТФОРМЕ</div>
          <h1 style={{ fontSize: '36px', fontWeight: 900, color: '#0F172A', letterSpacing: '-.5px', lineHeight: 1.2, marginBottom: '12px' }}>Мы помогаем казахстанским ученикам сдать ЕНТ</h1>
          <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.7, maxWidth: '600px' }}>QazTestPrep — образовательная платформа для подготовки к ЕНТ. Мы объединяем лучших учителей Казахстана и создаём инструменты, которые делают подготовку эффективной.</p>
        </div>

        <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '40px', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', marginBottom: '28px' }}>Наши ценности</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '24px' }}>
            {[
              { icon: '🎯', t: 'Доступность', d: 'Качественная подготовка к ЕНТ должна быть доступна каждому ученику.' },
              { icon: '📈', t: 'Результат', d: 'Мы фокусируемся на реальном росте баллов, а не на количестве материала.' },
              { icon: '🤝', t: 'Сообщество', d: 'Ученики и учителя на одной платформе — вместе к общей цели.' },
            ].map((v, i) => (
              <div key={i} style={{ display: 'flex', gap: '16px' }}>
                <div style={{ width: '44px', height: '44px', flexShrink: 0, borderRadius: '12px', background: '#EEF3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>{v.icon}</div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>{v.t}</div>
                  <div style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6 }}>{v.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', marginBottom: '20px' }}>Наша команда</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginBottom: '40px' }}>
          {team.map(t => (
            <div key={t.name} style={{ background: '#fff', borderRadius: '20px', padding: '28px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
              <span style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}>{t.emoji}</span>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>{t.name}</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#2563EB', marginBottom: '4px' }}>{t.role}</div>
              <div style={{ fontSize: '13px', color: '#94A3B8' }}>{t.exp}</div>
            </div>
          ))}
        </div>

        <div style={{ background: '#1E3A8A', borderRadius: '20px', padding: '48px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#fff', marginBottom: '10px' }}>Присоединяйся к нам</h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,.6)', marginBottom: '24px' }}>Тысячи учеников уже готовятся к ЕНТ вместе с нами</p>
          <Link href="/auth/register" style={{ fontFamily: 'Inter,sans-serif', fontSize: '15px', fontWeight: 700, padding: '14px 32px', border: 'none', borderRadius: '50px', background: '#fff', color: '#1E3A8A', cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}>
            Зарегистрироваться бесплатно
          </Link>
        </div>
      </main>
    </div>
  )
}
