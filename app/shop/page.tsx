import Navbar from '@/components/layout/Navbar'
import Link from 'next/link'

const products = [
  { id: 1, name: 'Сборник ЕНТ 2025 — Математика', type: 'Книга', price: 3500, oldPrice: 5000, emoji: '📗', badge: 'Хит' },
  { id: 2, name: 'История Казахстана — шпаргалки и тесты', type: 'Книга', price: 2900, oldPrice: null, emoji: '📘', badge: null },
  { id: 3, name: 'Полный комплект ЕНТ 2025 (все предметы)', type: 'Набор', price: 12000, oldPrice: 18000, emoji: '📚', badge: 'Выгодно' },
  { id: 4, name: 'Тетрадь для решения задач А4', type: 'Канцелярия', price: 800, oldPrice: null, emoji: '📓', badge: null },
  { id: 5, name: 'Флэш-карточки — Химия (200 шт)', type: 'Канцелярия', price: 1500, oldPrice: 2000, emoji: '🗂', badge: null },
  { id: 6, name: 'Онлайн-курс: Физика с нуля до 140+', type: 'Курс', price: 8900, oldPrice: 15000, emoji: '🎓', badge: 'Новинка' },
]

const badgeColor: Record<string, string> = {
  'Хит':     'bg-red-50 text-red-600 border-red-100',
  'Выгодно': 'bg-emerald-50 text-emerald-700 border-emerald-100',
  'Новинка': 'bg-purple-50 text-purple-700 border-purple-100',
}

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-[#F7F6F2]">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-[#111111] tracking-tight mb-1">Товары</h1>
          <p className="text-sm text-[#444444] font-medium">Книги, курсы и материалы для подготовки к ЕНТ</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(p => (
            <div key={p.id} className="bg-white border border-[#E2E0D8] rounded-3xl p-6 hover:shadow-md hover:shadow-black/5 transition-all flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <span className="text-4xl">{p.emoji}</span>
                {p.badge && (
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${badgeColor[p.badge]}`}>{p.badge}</span>
                )}
              </div>
              <p className="text-xs text-[#999999] font-bold uppercase tracking-wide mb-1">{p.type}</p>
              <h3 className="font-black text-[#111111] text-sm leading-snug mb-4 flex-1">{p.name}</h3>
              <div className="flex items-center justify-between pt-4 border-t border-[#F7F6F2]">
                <div>
                  <span className="text-lg font-black text-[#111111]">{p.price.toLocaleString()} ₸</span>
                  {p.oldPrice && (
                    <span className="text-sm text-[#999999] line-through ml-2">{p.oldPrice.toLocaleString()} ₸</span>
                  )}
                </div>
                <Link href="/auth/register"
                  className="text-xs font-bold bg-[#111111] text-white px-4 py-2 rounded-xl hover:bg-[#2563EB] transition shadow-sm">
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
