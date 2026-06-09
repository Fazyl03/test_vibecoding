import Navbar from '@/components/layout/Navbar'
import Link from 'next/link'

const products = [
  { id: 1, name: 'Сборник ЕНТ 2025 — Математика', type: 'Книга', price: 3500, oldPrice: 5000, emoji: '📗', badge: 'Хит', badgeColor: '#DC2626', badgeBg: '#FEF2F2' },
  { id: 2, name: 'История Казахстана — шпаргалки', type: 'Книга', price: 2900, oldPrice: null, emoji: '📘', badge: null, badgeColor: '', badgeBg: '' },
  { id: 3, name: 'Полный комплект ЕНТ 2025', type: 'Набор', price: 12000, oldPrice: 18000, emoji: '📚', badge: 'Выгодно', badgeColor: '#16A34A', badgeBg: '#F0FDF4' },
  { id: 4, name: 'Тетрадь для задач А4', type: 'Канцелярия', price: 800, oldPrice: null, emoji: '📓', badge: null, badgeColor: '', badgeBg: '' },
  { id: 5, name: 'Флэш-карточки — Химия (200 шт)', type: 'Канцелярия', price: 1500, oldPrice: 2000, emoji: '🗂', badge: null, badgeColor: '', badgeBg: '' },
  { id: 6, name: 'Онлайн-курс: Физика с нуля', type: 'Курс', price: 8900, oldPrice: 15000, emoji: '🎓', badge: 'Новинка', badgeColor: '#7C3AED', badgeBg: '#F5F3FF' },
]

export default function ShopPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: 'Inter,sans-serif' }}>
      <Navbar />
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#0F172A', marginBottom: '6px', letterSpacing: '-.5px' }}>Товары</h1>
          <p style={{ fontSize: '15px', color: '#475569' }}>Книги, курсы и материалы для подготовки к ЕНТ</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
          {products.map(p => (
            <div key={p.id} style={{ background: '#fff', borderRadius: '20px', padding: '24px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ fontSize: '40px' }}>{p.emoji}</span>
                {p.badge && <span style={{ fontSize: '12px', fontWeight: 700, color: p.badgeColor, background: p.badgeBg, padding: '3px 10px', borderRadius: '20px' }}>{p.badge}</span>}
              </div>
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', color: '#94A3B8', marginBottom: '6px' }}>{p.type}</div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', lineHeight: 1.35, marginBottom: '16px', flex: 1 }}>{p.name}</h3>
              <div style={{ height: '1px', background: '#F1F5F9', marginBottom: '16px' }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>{p.price.toLocaleString()} </span>
                  <span style={{ fontSize: '13px', color: '#94A3B8' }}>тг</span>
                  {p.oldPrice && <span style={{ fontSize: '13px', color: '#94A3B8', textDecoration: 'line-through', marginLeft: '8px' }}>{p.oldPrice.toLocaleString()}</span>}
                </div>
                <Link href="/auth/register" style={{ fontFamily: 'Inter,sans-serif', fontSize: '13px', fontWeight: 700, padding: '9px 18px', border: 'none', borderRadius: '10px', background: '#2563EB', color: '#fff', cursor: 'pointer', textDecoration: 'none' }}>
                  Купить
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
