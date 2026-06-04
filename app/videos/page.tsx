import Navbar from '@/components/layout/Navbar'
import Link from 'next/link'

const subjectColors: Record<string, string> = {
  'Математика':         'bg-blue-50 text-blue-700',
  'История Казахстана': 'bg-amber-50 text-amber-700',
  'Физика':             'bg-purple-50 text-purple-700',
  'Химия':              'bg-green-50 text-green-700',
  'Биология':           'bg-emerald-50 text-emerald-700',
}

const videos = [
  { id: 1, title: 'Как решать квадратные уравнения — полный разбор', subject: 'Математика', teacher: 'Айгерим М.', duration: '18:42', views: 4200, thumb: '📐' },
  { id: 2, title: 'Казахское ханство — основание и первые ханы', subject: 'История Казахстана', teacher: 'Болат С.', duration: '22:15', views: 3800, thumb: '📜' },
  { id: 3, title: 'Второй закон Ньютона — задачи ЕНТ', subject: 'Физика', teacher: 'Дина К.', duration: '15:30', views: 5100, thumb: '⚡' },
  { id: 4, title: 'Алканы и алкены — номенклатура и свойства', subject: 'Химия', teacher: 'Айгерим М.', duration: '20:10', views: 2900, thumb: '🧪' },
  { id: 5, title: 'Митоз и мейоз — в чём разница', subject: 'Биология', teacher: 'Дина К.', duration: '16:55', views: 3300, thumb: '🧬' },
  { id: 6, title: 'Тригонометрия — синус, косинус, тангенс', subject: 'Математика', teacher: 'Болат С.', duration: '25:00', views: 6700, thumb: '📐' },
]

export default function VideosPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1A1A1A] tracking-tight mb-2">Видеоуроки</h1>
          <p className="text-[#4A4A4A]">Понятные объяснения сложных тем от опытных учителей</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map(v => (
            <div key={v.id} className="bg-white border border-[#E8E8E4] rounded-2xl overflow-hidden hover:shadow-sm hover:border-[#BFCFFF] transition-all group">
              {/* Thumb */}
              <div className="h-36 bg-gradient-to-br from-[#EEF3FF] to-[#BFCFFF] flex items-center justify-center text-5xl relative">
                {v.thumb}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M6 4L14 9L6 14V4Z" fill="#2563EB"/>
                    </svg>
                  </div>
                </div>
                <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded">{v.duration}</span>
              </div>

              <div className="p-4">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${subjectColors[v.subject] ?? 'bg-gray-50 text-gray-700'}`}>
                  {v.subject}
                </span>
                <h3 className="font-semibold text-[#1A1A1A] text-sm leading-snug mt-2 mb-3">{v.title}</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#9A9A9A]">👤 {v.teacher}</p>
                    <p className="text-xs text-[#9A9A9A]">👁 {v.views.toLocaleString()} просмотров</p>
                  </div>
                  <Link href="/auth/register"
                    className="text-xs font-semibold bg-[#2563EB] text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition">
                    Смотреть
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
