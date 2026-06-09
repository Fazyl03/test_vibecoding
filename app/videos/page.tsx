import Navbar from '@/components/layout/Navbar'
import Link from 'next/link'

const subjectColor: Record<string, string> = {
  'Математика': '#2563EB', 'История Казахстана': '#D97706',
  'Физика': '#7C3AED', 'Химия': '#16A34A', 'Биология': '#059669',
}
const subjectBg: Record<string, string> = {
  'Математика': '#EEF3FF', 'История Казахстана': '#FFFBEB',
  'Физика': '#F5F3FF', 'Химия': '#F0FDF4', 'Биология': '#ECFDF5',
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
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: 'Inter,sans-serif' }}>
      <Navbar />
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#0F172A', marginBottom: '6px', letterSpacing: '-.5px' }}>Видеоуроки</h1>
          <p style={{ fontSize: '15px', color: '#475569' }}>Понятные объяснения сложных тем от опытных учителей</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
          {videos.map(v => (
            <div key={v.id} style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
              <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '56px', background: 'linear-gradient(135deg,#EEF3FF,#BFCFFF)', position: 'relative' }}>
                {v.thumb}
                <span style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,.65)', color: '#fff', fontSize: '12px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px' }}>{v.duration}</span>
              </div>
              <div style={{ padding: '18px 20px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: subjectColor[v.subject] ?? '#2563EB', background: subjectBg[v.subject] ?? '#EEF3FF', padding: '3px 10px', borderRadius: '20px' }}>{v.subject}</span>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', lineHeight: 1.35, margin: '10px 0 8px' }}>{v.title}</h3>
                <div style={{ height: '1px', background: '#F1F5F9', margin: '12px 0' }} />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>👤 {v.teacher}</div>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>👁 {v.views.toLocaleString()} просмотров</div>
                  </div>
                  <Link href="/auth/register" style={{ fontFamily: 'Inter,sans-serif', fontSize: '13px', fontWeight: 700, padding: '9px 18px', border: 'none', borderRadius: '10px', background: '#2563EB', color: '#fff', cursor: 'pointer', textDecoration: 'none' }}>
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
