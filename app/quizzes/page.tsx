import Navbar from '@/components/layout/Navbar'
import Link from 'next/link'

const subjects = ['Все', 'Математика', 'История Казахстана', 'Физика', 'Химия', 'Биология', 'География']

const quizzes = [
  { id: 1, title: 'Алгебра — квадратные уравнения', subject: 'Математика', questions: 25, teacher: 'Айгерим М.', duration: '30 мин', difficulty: 'Средний' },
  { id: 2, title: 'История Казахстана — XIX век', subject: 'История Казахстана', questions: 30, teacher: 'Болат С.', duration: '35 мин', difficulty: 'Лёгкий' },
  { id: 3, title: 'Механика — законы Ньютона', subject: 'Физика', questions: 20, teacher: 'Дина К.', duration: '25 мин', difficulty: 'Сложный' },
  { id: 4, title: 'Органическая химия — основы', subject: 'Химия', questions: 20, teacher: 'Айгерим М.', duration: '25 мин', difficulty: 'Средний' },
  { id: 5, title: 'Клетка и её строение', subject: 'Биология', questions: 25, teacher: 'Дина К.', duration: '30 мин', difficulty: 'Лёгкий' },
  { id: 6, title: 'Геометрия — теорема Пифагора', subject: 'Математика', questions: 15, teacher: 'Болат С.', duration: '20 мин', difficulty: 'Лёгкий' },
]

const diffColor: Record<string, string> = {
  'Лёгкий':  'bg-green-50 text-green-700',
  'Средний': 'bg-yellow-50 text-yellow-700',
  'Сложный': 'bg-red-50 text-red-700',
}

export default function QuizzesPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1A1A1A] tracking-tight mb-2">Квизы</h1>
          <p className="text-[#4A4A4A]">Тренируйся с тестами от лучших учителей Казахстана</p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap mb-8">
          {subjects.map((s, i) => (
            <button key={s}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${i === 0 ? 'bg-[#2563EB] text-white border-[#2563EB]' : 'border-[#E8E8E4] text-[#4A4A4A] hover:border-[#2563EB] hover:text-[#2563EB]'}`}>
              {s}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quizzes.map(q => (
            <div key={q.id} className="bg-white border border-[#E8E8E4] rounded-2xl p-5 hover:shadow-sm hover:border-[#BFCFFF] transition-all">
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-medium text-[#2563EB] bg-[#EEF3FF] px-2.5 py-1 rounded-full">{q.subject}</span>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${diffColor[q.difficulty]}`}>{q.difficulty}</span>
              </div>
              <h3 className="font-semibold text-[#1A1A1A] text-sm leading-snug mb-3">{q.title}</h3>
              <div className="flex items-center gap-3 text-xs text-[#9A9A9A] mb-4">
                <span>📝 {q.questions} вопросов</span>
                <span>⏱ {q.duration}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#9A9A9A]">👤 {q.teacher}</span>
                <Link href="/auth/register"
                  className="text-xs font-semibold bg-[#2563EB] text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition">
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
