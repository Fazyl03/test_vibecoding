'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'

type Product = {
  id: string; name: string; description: string | null; price: number; type: string; fileUrl: string | null
  teacher: { name: string }
  hasPurchased: boolean
  similar: { id: string; name: string; type: string; price: number }[]
}

const TYPE_LABEL: Record<string, string> = {
  BOOK: '📗 Книга', CHEATSHEET_DIGITAL: '💾 Цифровой товар', CHEATSHEET_PHYSICAL: '📄 Физическая', OTHER: '📦 Товар',
}
const TYPE_COLOR: Record<string, { color: string; bg: string }> = {
  BOOK: { color: '#2563EB', bg: '#EEF3FF' },
  CHEATSHEET_DIGITAL: { color: '#7C3AED', bg: '#F5F3FF' },
  CHEATSHEET_PHYSICAL: { color: '#D97706', bg: '#FFFBEB' },
  OTHER: { color: '#999', bg: '#F7F6F2' },
}
const TYPE_EMOJI: Record<string, string> = { BOOK: '📗', CHEATSHEET_DIGITAL: '💾', CHEATSHEET_PHYSICAL: '📄', OTHER: '📦' }

export default function ShopItemPage() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/shop/${id}`)
      .then(r => r.json())
      .then(data => { setProduct(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  const handlePurchase = async () => {
    setPurchasing(true); setError('')
    const res = await fetch('/api/student/purchase', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: id }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error); setPurchasing(false); return }
    setProduct(p => p ? { ...p, hasPurchased: true } : p)
    setPurchasing(false)
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#F7F6F2', fontFamily: 'Onest,sans-serif' }}>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '80px 20px', color: '#999' }}>Загружаем...</div>
    </div>
  )

  if (!product) return (
    <div style={{ minHeight: '100vh', background: '#F7F6F2', fontFamily: 'Onest,sans-serif' }}>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</div>
        <p style={{ color: '#999', fontSize: '14px' }}>Товар не найден</p>
        <Link href="/shop" style={{ color: '#2563EB', fontWeight: 700, textDecoration: 'none', fontSize: '14px', marginTop: '12px', display: 'inline-block' }}>← Назад в магазин</Link>
      </div>
    </div>
  )

  const typeInfo = TYPE_COLOR[product.type] ?? TYPE_COLOR.OTHER
  const isDigital = product.type === 'CHEATSHEET_DIGITAL'

  return (
    <div style={{ minHeight: '100vh', background: '#F7F6F2', fontFamily: 'Onest,sans-serif' }}>
      <style>{`
        .shop-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: start; }
        .similar-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
        @media (max-width: 768px) {
          .shop-grid { grid-template-columns: 1fr; }
          .similar-grid { grid-template-columns: 1fr; }
        }
      `}</style>
      <Navbar />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 16px' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#999', marginBottom: '24px' }}>
          <Link href="/shop" style={{ color: '#2563EB', fontWeight: 600, textDecoration: 'none' }}>Товары</Link>
          <span>›</span>
          <span style={{ fontWeight: 600, color: '#111' }}>{product.name}</span>
        </div>

        <div className="shop-grid">
          {/* Left: image */}
          <div>
            <div style={{ aspectRatio: '4/3', background: 'linear-gradient(135deg,#EEF3FF,#DBEAFE)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '96px', marginBottom: '16px' }}>
              {TYPE_EMOJI[product.type] ?? '📦'}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              {['📄','📊','📐'].map((e, i) => (
                <div key={i} style={{ flex: 1, aspectRatio: '1', background: '#F7F6F2', border: '1px solid #E2E0D8', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>{e}</div>
              ))}
            </div>
          </div>

          {/* Right: info */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, padding: '5px 12px', borderRadius: '9px', background: typeInfo.bg, color: typeInfo.color, marginBottom: '14px' }}>
              {TYPE_LABEL[product.type] ?? product.type}
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#111', letterSpacing: '-.5px', lineHeight: 1.25, marginBottom: '12px' }}>{product.name}</h1>
            {product.description && (
              <p style={{ fontSize: '14px', color: '#444', lineHeight: 1.75, marginBottom: '24px' }}>{product.description}</p>
            )}

            {/* Price box */}
            <div style={{ background: '#fff', border: '1px solid #E2E0D8', borderRadius: '20px', padding: '20px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Цена</div>
                  <div style={{ fontSize: '32px', fontWeight: 900, color: '#111', fontFamily: 'Instrument Serif,serif' }}>{product.price.toLocaleString()} тг</div>
                </div>
                {!product.hasPurchased && (
                  <button onClick={handlePurchase} disabled={purchasing}
                    style={{ fontFamily: 'Onest,sans-serif', fontSize: '15px', fontWeight: 700, padding: '14px 32px', border: 'none', borderRadius: '12px', background: purchasing ? '#93C5FD' : '#2563EB', color: '#fff', cursor: purchasing ? 'not-allowed' : 'pointer' }}>
                    {purchasing ? 'Покупаем...' : `💳 Купить за ${product.price.toLocaleString()} тг`}
                  </button>
                )}
              </div>
            </div>

            {error && (
              <div style={{ background: '#FEF2F2', border: '1.5px solid #FECACA', borderRadius: '12px', padding: '12px 14px', fontSize: '13px', color: '#DC2626', fontWeight: 600, marginBottom: '20px' }}>
                ⚠ {error}
              </div>
            )}

            {product.hasPurchased ? (
              <div style={{ background: '#F0FDF4', border: '1.5px solid #BBF7D0', borderRadius: '16px', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', color: '#fff', flexShrink: 0 }}>✓</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#16A34A' }}>Покупка завершена!</div>
                  <div style={{ fontSize: '12px', color: '#16A34A', opacity: .8 }}>
                    {isDigital ? 'Файл доступен для скачивания' : 'Спасибо за покупку!'}
                  </div>
                </div>
                {isDigital && product.fileUrl && (
                  <a href={product.fileUrl} target="_blank" rel="noopener noreferrer"
                    style={{ fontFamily: 'Onest,sans-serif', fontSize: '14px', fontWeight: 700, padding: '11px 22px', border: 'none', borderRadius: '12px', background: '#16A34A', color: '#fff', textDecoration: 'none', flexShrink: 0 }}>
                    ⬇ Скачать
                  </a>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {isDigital && (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: '#444' }}>
                      <span style={{ width: '32px', height: '32px', borderRadius: '9px', background: '#EEF3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', flexShrink: 0 }}>📄</span>
                      Цифровой файл (PDF)
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: '#444' }}>
                      <span style={{ width: '32px', height: '32px', borderRadius: '9px', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', flexShrink: 0 }}>⬇</span>
                      Доступ к скачиванию навсегда после покупки
                    </div>
                  </>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: '#444' }}>
                  <span style={{ width: '32px', height: '32px', borderRadius: '9px', background: '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', flexShrink: 0 }}>👩‍🏫</span>
                  Автор: {product.teacher.name}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Similar */}
        {product.similar.length > 0 && (
          <div style={{ marginTop: '48px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#111', marginBottom: '16px' }}>Похожие товары</h2>
            <div className="similar-grid">
              {product.similar.map(s => {
                const sInfo = TYPE_COLOR[s.type] ?? TYPE_COLOR.OTHER
                return (
                  <Link key={s.id} href={`/shop/${s.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{ background: '#fff', border: '1px solid #E2E0D8', borderRadius: '20px', overflow: 'hidden' }}>
                      <div style={{ aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', background: sInfo.bg }}>{TYPE_EMOJI[s.type] ?? '📦'}</div>
                      <div style={{ padding: '16px 18px' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, padding: '4px 10px', borderRadius: '8px', background: sInfo.bg, color: sInfo.color, marginBottom: '8px' }}>
                          {TYPE_EMOJI[s.type]} {TYPE_LABEL[s.type]?.split(' ').slice(1).join(' ')}
                        </div>
                        <div style={{ fontSize: '15px', fontWeight: 800, color: '#111', marginBottom: '10px', lineHeight: 1.35 }}>{s.name}</div>
                        <div style={{ fontSize: '18px', fontWeight: 900, color: '#111' }}>{s.price.toLocaleString()} <span style={{ fontSize: '12px', fontWeight: 600, color: '#999' }}>тг</span></div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
