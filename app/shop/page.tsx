import { prisma } from '@/lib/prisma'
import Navbar from '@/components/layout/Navbar'
import Link from 'next/link'

const typeLabel: Record<string, string> = {
  BOOK: 'Книга', CHEATSHEET_DIGITAL: 'Цифровая', CHEATSHEET_PHYSICAL: 'Физическая', OTHER: 'Другое',
}
const typeEmoji: Record<string, string> = {
  BOOK: '📗', CHEATSHEET_DIGITAL: '💾', CHEATSHEET_PHYSICAL: '📄', OTHER: '📦',
}

export default async function ShopPage() {
  const products = await prisma.product.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: 'Inter,sans-serif' }}>
      <style>{`
        .shop-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
        @media (max-width: 768px) { .shop-grid { grid-template-columns: 1fr; } }
        @media (min-width: 769px) and (max-width: 1024px) { .shop-grid { grid-template-columns: repeat(2,1fr); } }
      `}</style>
      <Navbar />
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 16px' }}>
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '30px', fontWeight: 900, color: '#0F172A', marginBottom: '6px' }}>Товары</h1>
          <p style={{ fontSize: '15px', color: '#475569' }}>Книги, курсы и материалы для подготовки к ЕНТ</p>
        </div>

        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', background: '#fff', borderRadius: '20px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛍️</div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>Товары скоро появятся</h3>
            <p style={{ fontSize: '14px', color: '#94A3B8' }}>Учителя ещё не добавили товары</p>
          </div>
        ) : (
          <div className="shop-grid">
            {products.map(p => (
              <Link key={p.id} href={`/shop/${p.id}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: '#fff', borderRadius: '20px', padding: '20px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div style={{ fontSize: '40px', marginBottom: '14px' }}>{typeEmoji[p.type] ?? '📦'}</div>
                  <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', color: '#94A3B8', marginBottom: '5px' }}>{typeLabel[p.type]}</div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', lineHeight: 1.35, marginBottom: '14px', flex: 1 }}>{p.name}</h3>
                  <div style={{ height: '1px', background: '#F1F5F9', marginBottom: '14px' }} />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '19px', fontWeight: 800, color: '#0F172A' }}>{p.price.toLocaleString()} </span>
                      <span style={{ fontSize: '13px', color: '#94A3B8' }}>тг</span>
                    </div>
                    <span style={{ fontFamily: 'Inter,sans-serif', fontSize: '13px', fontWeight: 700, padding: '9px 16px', border: 'none', borderRadius: '10px', background: '#2563EB', color: '#fff' }}>
                      Подробнее
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
