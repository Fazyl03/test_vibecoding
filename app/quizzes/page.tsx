import Navbar from '@/components/layout/Navbar'
import Link from 'next/link'

const subjects = ['Все', 'Математика', 'История Казахстана', 'Физика', 'Химия', 'Биология', 'География']

const quizzes = [
  { id: 1, title: 'Алгебра — квадратные уравнения', subject: 'Математика', questions: 25, teacher: 'Айгерим М.', duration: '30 мин', difficulty: 'Средний' },
  { id: 2, title: 'История KZ — XIX век', subject: 'История Казахстана', questions: 30, teacher: 'Болат С.', duration: '35 мин', difficulty: 'Лёгкий' },
  { id: 3, title: 'Механика — законы Ньютона', subject: 'Физика', questions: 20, teacher: 'Дина К.', duration: '25 мин', difficulty: 'Сложный' },
  { id: 4, title: 'Органическая химия — основы', subject: 'Химия', questions: 20, teacher: 'Айгерим М.', duration: '25 мин', difficulty: 'Средний' },
  { id: 5, title: 'Клетка и её строение', subject: 'Биология', questions: 25, teacher: 'Дина К.', duration: '30 мин', difficulty: 'Лёгкий' },
  { id: 6, title: 'Геометрия — теорема Пифагора', subject: 'Математика', questions: 15, teacher: 'Болат С.', duration: '20 мин', difficulty: 'Лёгкий' },
]

const diffBadge: Record<string, string> = {
  'Лёгкий':  'bg-emerald-50 text-emerald-700 border-emerald-100',
  'Средний': 'bg-amber-50 text-amber-700 border-amber-100',
  'Сложный': 'bg-red-50 text-red-700 border-red-100',
}

export default function QuizzesPage() {
  return (
    <div className="min-h-screen bg-[#F7F6F2]">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-[#111111] tracking-tight mb-1">Квизы</h1>
          <p className="text-sm text-[#444444] font-medium">Тренируйся с тестами от лучших учителей Казахстана</p>
        </div>

        <div className="flex gap-2 flex-wrap mb-8">
          {subjects.map((s, i) => (
            <button key={s}
              className={`px-4 py-2 rounded-xl text-sm font-bold border transition ${
                i === 0
                  ? 'bg-[#111111] text-white border-[#111111]'
                  : 'border-[#E2E0D8] bg-white text-[#444444] hover:border-[#2563EB] hover:text-[#2563EB]'
              }`}>
              {s}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quizzes.map(q => (
            <div key={q.id} className="bg-white border border-[#E2E0D8] rounded-3xl p-6 hover:shadow-md hover:shadow-black/5 hover:border-[#BFCFFF] transition-all group">
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-bold text-[#2563EB] bg-[#EEF3FF] px-2.5 py-1 rounded-lg border border-[#BFCFFF]">
                  {q.subject}
                </span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${diffBadge[q.difficulty]}`}>
                  {q.difficulty}
                </span>
              </div>
              <h3 className="font-black text-[#111111] text-sm leading-snug mb-3 group-hover:text-[#2563EB] transition-colors">
                {q.title}
              </h3>
              <div className="flex items-center gap-3 text-xs text-[#999999] font-semibold mb-4">
                <span>📝 {q.questions} вопросов</span>
                <span>⏱ {q.duration}</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-[#F7F6F2]">
                <span className="text-xs text-[#999999] font-semibold">👤 {q.teacher}</span>
                <Link href="/auth/register"
                  className="text-xs font-bold bg-[#2563EB] text-white px-4 py-2 rounded-xl hover:bg-[#1A44C2] transition shadow-sm shadow-blue-200">
                  Начать
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
