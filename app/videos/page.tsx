import Navbar from '@/components/layout/Navbar'
import Link from 'next/link'

const subjectColor: Record<string, string> = {
  'Математика':         'bg-blue-50 text-blue-700 border-blue-100',
  'История Казахстана': 'bg-amber-50 text-amber-700 border-amber-100',
  'Физика':             'bg-purple-50 text-purple-700 border-purple-100',
  'Химия':              'bg-green-50 text-green-700 border-green-100',
  'Биология':           'bg-emerald-50 text-emerald-700 border-emerald-100',
}

const videos = [
  { id: 1, title: 'Как решать квадратные уравнения — полный разбор', subject: 'Математика', teacher: 'Айгерим М.', duration: '18:42', views: 4200, thumb: '📐' },
  { id: 2, title: 'Казахское ханство — основание и первые ханы', subject: 'История Казахстана', teacher: 'Болат С.', duration: '22:15', views: 3800, thumb: '📜' },
  { id: 3, title: 'Второй закон Ньютона — задачи ЕНТ', subject: 'Физика', teacher: 'Дина К.', duration: '15:30', views: 5100, thumb: '⚡' },
  { id: 4, title: 'Алканы и алкены — номенклатура', subject: 'Химия', teacher: 'Айгерим М.', duration: '20:10', views: 2900, thumb: '🧪' },
  { id: 5, title: 'Митоз и мейоз — в чём разница', subject: 'Биология', teacher: 'Дина К.', duration: '16:55', views: 3300, thumb: '🧬' },
  { id: 6, title: 'Тригонометрия — синус, косинус, тангенс', subject: 'Математика', teacher: 'Болат С.', duration: '25:00', views: 6700, thumb: '📐' },
]

export default function VideosPage() {
  return (
    <div className="min-h-screen bg-[#F7F6F2]">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-[#111111] tracking-tight mb-1">Видеоуроки</h1>
          <p className="text-sm text-[#444444] font-medium">Понятные объяснения сложных тем от опытных учителей</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map(v => (
            <div key={v.id} className="bg-white border border-[#E2E0D8] rounded-3xl overflow-hidden hover:shadow-md hover:shadow-black/5 transition-all group">
              <div className="h-40 bg-gradient-to-br from-[#EEF3FF] to-[#F7F6F2] flex items-center justify-center text-5xl relative">
                {v.thumb}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                  <div className="w-14 h-14 bg-[#2563EB] rounded-2xl flex items-center justify-center shadow-xl shadow-blue-300">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M6 4L14 9L6 14V4Z" fill="white"/>
                    </svg>
                  </div>
                </div>
                <span className="absolute bottom-2 right-2 bg-[#111111]/80 text-white text-xs font-bold px-2 py-0.5 rounded-lg">
                  {v.duration}
                </span>
              </div>
              <div className="p-5">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${subjectColor[v.subject] ?? 'bg-gray-50 text-gray-700 border-gray-100'}`}>
                  {v.subject}
                </span>
                <h3 className="font-black text-[#111111] text-sm leading-snug mt-3 mb-3">{v.title}</h3>
                <div className="flex items-center justify-between pt-3 border-t border-[#F7F6F2]">
                  <div>
                    <p className="text-xs text-[#999999] font-semibold">👤 {v.teacher}</p>
                    <p className="text-xs text-[#999999] font-semibold">👁 {v.views.toLocaleString()} просмотров</p>
                  </div>
                  <Link href="/auth/register"
                    className="text-xs font-bold bg-[#2563EB] text-white px-4 py-2 rounded-xl hover:bg-[#1A44C2] transition shadow-sm shadow-blue-200">
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
