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
  'Хит':     'bg-red-50 text-red-600',
  'Выгодно': 'bg-green-50 text-green-700',
  'Новинка': 'bg-purple-50 text-purple-700',
}

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1A1A1A] tracking-tight mb-2">Товары</h1>
          <p className="text-[#4A4A4A]">Книги, курсы и материалы для подготовки к ЕНТ</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(p => (
            <div key={p.id} className="bg-white border border-[#E8E8E4] rounded-2xl p-5 hover:shadow-sm hover:border-[#BFCFFF] transition-all flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <span className="text-4xl">{p.emoji}</span>
                {p.badge && (
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badgeColor[p.badge]}`}>{p.badge}</span>
                )}
              </div>
              <p className="text-xs text-[#9A9A9A] mb-1">{p.type}</p>
              <h3 className="font-semibold text-[#1A1A1A] text-sm leading-snug mb-4 flex-1">{p.name}</h3>
              <div className="flex items-center justify-between mt-auto">
                <div>
                  <span className="text-lg font-bold text-[#1A1A1A]">{p.price.toLocaleString()} ₸</span>
                  {p.oldPrice && (
                    <span className="text-sm text-[#9A9A9A] line-through ml-2">{p.oldPrice.toLocaleString()} ₸</span>
                  )}
                </div>
                <Link href="/auth/register"
                  className="text-xs font-semibold bg-[#2563EB] text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition">
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
