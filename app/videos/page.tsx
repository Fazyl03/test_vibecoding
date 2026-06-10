import { prisma } from '@/lib/prisma'
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
const subjectEmoji: Record<string, string> = {
  'Математика': '📐', 'История Казахстана': '📜',
  'Физика': '⚡', 'Химия': '🧪', 'Биология': '🧬',
}

export default async function VideosPage() {
  const videos = await prisma.video.findMany({
    where: { isPublished: true },
    include: { teacher: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: 'Inter,sans-serif' }}>
      <style>{`
        .video-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
        @media (max-width: 768px) { .video-grid { grid-template-columns: 1fr; } }
        @media (min-width: 769px) and (max-width: 1024px) { .video-grid { grid-template-columns: repeat(2,1fr); } }
      `}</style>
      <Navbar />
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 16px' }}>
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '30px', fontWeight: 900, color: '#0F172A', marginBottom: '6px' }}>Видеоуроки</h1>
          <p style={{ fontSize: '15px', color: '#475569' }}>Понятные объяснения сложных тем от опытных учителей</p>
        </div>

        {videos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', background: '#fff', borderRadius: '20px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎬</div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>Видеоуроки скоро появятся</h3>
            <p style={{ fontSize: '14px', color: '#94A3B8' }}>Учителя ещё не добавили видеоуроки</p>
          </div>
        ) : (
          <div className="video-grid">
            {videos.map(v => (
              <div key={v.id} style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
                <div style={{ height: '170px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '56px', background: 'linear-gradient(135deg,#EEF3FF,#BFCFFF)', position: 'relative' }}>
                  {subjectEmoji[v.subject] ?? '📹'}
                  {v.duration && <span style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,.65)', color: '#fff', fontSize: '12px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px' }}>{v.duration}</span>}
                </div>
                <div style={{ padding: '16px 18px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: subjectColor[v.subject] ?? '#2563EB', background: subjectBg[v.subject] ?? '#EEF3FF', padding: '3px 10px', borderRadius: '20px' }}>{v.subject}</span>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', lineHeight: 1.35, margin: '10px 0 8px' }}>{v.title}</h3>
                  <div style={{ height: '1px', background: '#F1F5F9', margin: '10px 0' }} />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>👤 {v.teacher.name}</div>
                    <a href={v.youtubeUrl} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'Inter,sans-serif', fontSize: '13px', fontWeight: 700, padding: '9px 16px', border: 'none', borderRadius: '10px', background: '#2563EB', color: '#fff', textDecoration: 'none' }}>
                      Смотреть
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
