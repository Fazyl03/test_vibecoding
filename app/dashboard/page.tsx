import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'

export default async function DashboardPage() {
  const session = await getServerSession()
  if (!session?.user) redirect('/auth/login')

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    select: { id: true, name: true, role: true, username: true },
  })
  if (!user) redirect('/auth/login')

  if (user.role === 'TEACHER') {
    const [quizCount, classroomCount, videoCount] = await Promise.all([
      prisma.quiz.count({ where: { teacherId: user.id } }),
      prisma.classroom.count({ where: { teacherId: user.id } }),
      prisma.video.count({ where: { teacherId: user.id } }),
    ])
    return <TeacherDashboard user={user} quizCount={quizCount} classroomCount={classroomCount} videoCount={videoCount} />
  }

  if (user.role === 'ADMIN') {
    const [userCount, quizCount, teacherCount] = await Promise.all([
      prisma.user.count(),
      prisma.quiz.count(),
      prisma.user.count({ where: { role: 'TEACHER' } }),
    ])
    return <AdminDashboard user={user} userCount={userCount} quizCount={quizCount} teacherCount={teacherCount} />
  }

  // STUDENT
  const [attemptCount, classCount, recentAttempts] = await Promise.all([
    prisma.quizAttempt.count({ where: { studentId: user.id } }),
    prisma.classMember.count({ where: { studentId: user.id } }),
    prisma.quizAttempt.findMany({
      where: { studentId: user.id },
      include: { quiz: { select: { id: true, title: true, subject: true } } },
      orderBy: { startedAt: 'desc' },
      take: 5,
    }),
  ])
  return <StudentDashboard user={user} attemptCount={attemptCount} classCount={classCount} recentAttempts={recentAttempts} />
}

// ─── STUDENT ─────────────────────────────────────────────────
function StudentDashboard({ user, attemptCount, classCount, recentAttempts }: {
  user: { name: string; username: string }
  attemptCount: number
  classCount: number
  recentAttempts: any[]
}) {
  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: 'Inter,sans-serif' }}>
      <style>{`
        .dash-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 768px) { .dash-grid { grid-template-columns: 1fr; } .two-col { grid-template-columns: 1fr; } }
      `}</style>
      <Navbar />
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 16px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#0F172A', marginBottom: '4px' }}>
            Привет, {user.name.split(' ')[0]} 👋
          </h1>
          <p style={{ fontSize: '14px', color: '#64748B' }}>@{user.username} · Ученик</p>
        </div>

        <div className="dash-grid" style={{ marginBottom: '24px' }}>
          {[
            { icon: '📋', label: 'Пройдено квизов', value: attemptCount, color: '#2563EB', bg: '#EEF3FF' },
            { icon: '🏫', label: 'Мои классы', value: classCount, color: '#16A34A', bg: '#F0FDF4' },
            { icon: '🎯', label: 'Средний балл', value: recentAttempts.length > 0
                ? Math.round(recentAttempts.reduce((s, a) => s + (a.score / a.total) * 100, 0) / recentAttempts.length) + '%'
                : '—', color: '#7C3AED', bg: '#F5F3FF' },
          ].map((s, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid #E2E0D8' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', marginBottom: '12px' }}>{s.icon}</div>
              <div style={{ fontSize: '26px', fontWeight: 900, color: '#0F172A', marginBottom: '4px' }}>{s.value}</div>
              <div style={{ fontSize: '13px', color: '#64748B' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div className="two-col">
          {/* Recent attempts */}
          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E2E0D8', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>📋 Последние квизы</span>
              <Link href="/quizzes" style={{ fontSize: '13px', fontWeight: 600, color: '#2563EB', textDecoration: 'none' }}>Все квизы →</Link>
            </div>
            {recentAttempts.length === 0 ? (
              <div style={{ padding: '32px 20px', textAlign: 'center' }}>
                <p style={{ fontSize: '14px', color: '#94A3B8', marginBottom: '14px' }}>Вы ещё не проходили квизы</p>
                <Link href="/quizzes" style={{ fontFamily: 'Inter,sans-serif', fontSize: '13px', fontWeight: 700, padding: '9px 18px', border: '1.5px solid #2563EB', borderRadius: '10px', color: '#2563EB', textDecoration: 'none', display: 'inline-block' }}>
                  Найти квиз
                </Link>
              </div>
            ) : (
              recentAttempts.map((a, i) => {
                const pct = Math.round((a.score / a.total) * 100)
                const color = pct >= 70 ? '#16A34A' : pct >= 50 ? '#D97706' : '#DC2626'
                return (
                  <div key={a.id} style={{ padding: '14px 20px', borderBottom: i < recentAttempts.length - 1 ? '1px solid #F1F5F9' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '2px' }}>{a.quiz.title}</div>
                      <div style={{ fontSize: '12px', color: '#64748B' }}>{a.quiz.subject}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '16px', fontWeight: 900, color }}>{a.score}/{a.total}</div>
                      <div style={{ fontSize: '11px', color: '#94A3B8' }}>{pct}%</div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Classes + join */}
          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E2E0D8', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9' }}>
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>🏫 Мои классы</span>
            </div>
            <div style={{ padding: '32px 20px', textAlign: 'center' }}>
              <p style={{ fontSize: '14px', color: '#94A3B8', marginBottom: '14px' }}>
                {classCount > 0 ? `Вы состоите в ${classCount} классе(ах)` : 'Вы пока не в классе'}
              </p>
              <Link href="/join-class" style={{ fontFamily: 'Inter,sans-serif', fontSize: '13px', fontWeight: 700, padding: '9px 18px', border: 'none', borderRadius: '10px', background: '#2563EB', color: '#fff', textDecoration: 'none', display: 'inline-block' }}>
                + Войти по коду
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// ─── TEACHER ─────────────────────────────────────────────────
function TeacherDashboard({ user, quizCount, classroomCount, videoCount }: {
  user: { name: string; username: string }
  quizCount: number
  classroomCount: number
  videoCount: number
}) {
  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: 'Inter,sans-serif' }}>
      <style>{`
        .dash-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
        .action-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 16px; }
        @media (max-width: 768px) { .dash-grid { grid-template-columns: 1fr; } .action-grid { grid-template-columns: 1fr; } }
      `}</style>
      <Navbar />
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#0F172A', marginBottom: '4px' }}>Кабинет учителя 👨‍🏫</h1>
            <p style={{ fontSize: '14px', color: '#64748B' }}>@{user.username} · {user.name}</p>
          </div>
          <Link href="/teacher/quizzes/create" style={{ fontFamily: 'Inter,sans-serif', fontSize: '14px', fontWeight: 700, padding: '10px 22px', border: 'none', borderRadius: '10px', background: '#2563EB', color: '#fff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            + Создать квиз
          </Link>
        </div>

        <div className="dash-grid" style={{ marginBottom: '24px' }}>
          {[
            { icon: '📝', label: 'Мои квизы', value: quizCount, color: '#2563EB', bg: '#EEF3FF' },
            { icon: '🏫', label: 'Мои классы', value: classroomCount, color: '#16A34A', bg: '#F0FDF4' },
            { icon: '🎬', label: 'Видеоуроки', value: videoCount, color: '#7C3AED', bg: '#F5F3FF' },
          ].map((s, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid #E2E0D8' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', marginBottom: '12px' }}>{s.icon}</div>
              <div style={{ fontSize: '26px', fontWeight: 900, color: '#0F172A', marginBottom: '4px' }}>{s.value}</div>
              <div style={{ fontSize: '13px', color: '#64748B' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div className="action-grid">
          <DashCard title="Мои квизы" icon="📝" empty="Вы ещё не создали квизы" action={{ label: 'Создать квиз', href: '/teacher/quizzes/create' }} />
          <DashCard title="Мои классы" icon="🏫" empty="Вы ещё не создали классы" action={{ label: 'Открыть классы', href: '/teacher/classrooms' }} />
        </div>
      </main>
    </div>
  )
}

// ─── ADMIN ───────────────────────────────────────────────────
function AdminDashboard({ user, userCount, quizCount, teacherCount }: {
  user: { name: string }
  userCount: number
  quizCount: number
  teacherCount: number
}) {
  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: 'Inter,sans-serif' }}>
      <style>{`
        .dash-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
        @media (max-width: 768px) { .dash-grid { grid-template-columns: 1fr; } }
      `}</style>
      <Navbar />
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 16px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#0F172A', marginBottom: '4px' }}>Панель администратора 🛡️</h1>
          <p style={{ fontSize: '14px', color: '#64748B' }}>{user.name}</p>
        </div>
        <div className="dash-grid" style={{ marginBottom: '24px' }}>
          {[
            { icon: '👥', label: 'Всего пользователей', value: userCount, bg: '#EEF3FF' },
            { icon: '👨‍🏫', label: 'Учителей', value: teacherCount, bg: '#F0FDF4' },
            { icon: '📝', label: 'Квизов', value: quizCount, bg: '#F5F3FF' },
          ].map((s, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid #E2E0D8' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', marginBottom: '12px' }}>{s.icon}</div>
              <div style={{ fontSize: '26px', fontWeight: 900, color: '#0F172A', marginBottom: '4px' }}>{s.value}</div>
              <div style={{ fontSize: '13px', color: '#64748B' }}>{s.label}</div>
            </div>
          ))}
        </div>
        <DashCard title="Управление пользователями" icon="👥" empty="Нет данных" action={{ label: 'Открыть', href: '/admin/users' }} />
      </main>
    </div>
  )
}

function DashCard({ title, icon, empty, action }: { title: string; icon: string; empty: string; action: { label: string; href: string } }) {
  return (
    <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E2E0D8', overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '18px' }}>{icon}</span>
        <span style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>{title}</span>
      </div>
      <div style={{ padding: '32px 20px', textAlign: 'center' }}>
        <p style={{ fontSize: '14px', color: '#94A3B8', marginBottom: '16px' }}>{empty}</p>
        <Link href={action.href} style={{ fontFamily: 'Inter,sans-serif', fontSize: '13px', fontWeight: 700, padding: '9px 18px', border: '1.5px solid #2563EB', borderRadius: '10px', color: '#2563EB', textDecoration: 'none', display: 'inline-block' }}>
          {action.label}
        </Link>
      </div>
    </div>
  )
}
