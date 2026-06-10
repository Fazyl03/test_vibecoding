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
  const [attemptCount, classCount] = await Promise.all([
    prisma.quizAttempt.count({ where: { studentId: user.id } }),
    prisma.classMember.count({ where: { studentId: user.id } }),
  ])
  return <StudentDashboard user={user} attemptCount={attemptCount} classCount={classCount} />
}

// ─── STUDENT ─────────────────────────────────────────────────
function StudentDashboard({ user, attemptCount, classCount }: { user: { name: string; username: string }; attemptCount: number; classCount: number }) {
  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: 'Inter,sans-serif' }}>
      <style>{`
        .dash-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
        @media (max-width: 768px) { .dash-grid { grid-template-columns: 1fr; } }
      `}</style>
      <Navbar />
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 16px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#0F172A', marginBottom: '4px' }}>
            Привет, {user.name.split(' ')[0]} 👋
          </h1>
          <p style={{ fontSize: '14px', color: '#64748B' }}>@{user.username} · Ученик</p>
        </div>

        <div className="dash-grid" style={{ marginBottom: '32px' }}>
          {[
            { icon: '📋', label: 'Пройдено квизов', value: attemptCount, color: '#2563EB', bg: '#EEF3FF' },
            { icon: '🏫', label: 'Мои классы', value: classCount, color: '#16A34A', bg: '#F0FDF4' },
            { icon: '🎯', label: 'Средний балл', value: '—', color: '#7C3AED', bg: '#F5F3FF' },
          ].map((s, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid #E2E8F0' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', marginBottom: '12px' }}>{s.icon}</div>
              <div style={{ fontSize: '26px', fontWeight: 900, color: '#0F172A', marginBottom: '4px' }}>{s.value}</div>
              <div style={{ fontSize: '13px', color: '#64748B' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <DashCard title="Мои квизы" icon="📝" empty="Вы ещё не проходили квизы" action={{ label: 'Найти квиз', href: '/quizzes' }} />
          <DashCard title="Мои классы" icon="🏫" empty="Вы ещё не в классе" action={{ label: 'Войти по коду', href: '/join-class' }} />
        </div>
      </main>
    </div>
  )
}

// ─── TEACHER ─────────────────────────────────────────────────
function TeacherDashboard({ user, quizCount, classroomCount, videoCount }: { user: { name: string; username: string }; quizCount: number; classroomCount: number; videoCount: number }) {
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
            <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#0F172A', marginBottom: '4px' }}>
              Кабинет учителя 👨‍🏫
            </h1>
            <p style={{ fontSize: '14px', color: '#64748B' }}>@{user.username} · {user.name}</p>
          </div>
          <Link href="/teacher/quizzes/create" style={{ fontFamily: 'Inter,sans-serif', fontSize: '14px', fontWeight: 700, padding: '10px 22px', border: 'none', borderRadius: '10px', background: '#2563EB', color: '#fff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            + Создать квиз
          </Link>
        </div>

        <div className="dash-grid" style={{ marginBottom: '32px' }}>
          {[
            { icon: '📝', label: 'Мои квизы', value: quizCount, color: '#2563EB', bg: '#EEF3FF' },
            { icon: '🏫', label: 'Мои классы', value: classroomCount, color: '#16A34A', bg: '#F0FDF4' },
            { icon: '🎬', label: 'Видеоуроки', value: videoCount, color: '#7C3AED', bg: '#F5F3FF' },
          ].map((s, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid #E2E8F0' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', marginBottom: '12px' }}>{s.icon}</div>
              <div style={{ fontSize: '26px', fontWeight: 900, color: '#0F172A', marginBottom: '4px' }}>{s.value}</div>
              <div style={{ fontSize: '13px', color: '#64748B' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div className="action-grid">
          <DashCard title="Мои квизы" icon="📝" empty="Вы ещё не создали квизы" action={{ label: 'Создать квиз', href: '/teacher/quizzes/create' }} />
          <DashCard title="Мои классы" icon="🏫" empty="Вы ещё не создали классы" action={{ label: 'Создать класс', href: '/teacher/classrooms/create' }} />
        </div>
      </main>
    </div>
  )
}

// ─── ADMIN ───────────────────────────────────────────────────
function AdminDashboard({ user, userCount, quizCount, teacherCount }: { user: { name: string }; userCount: number; quizCount: number; teacherCount: number }) {
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
        <div className="dash-grid" style={{ marginBottom: '32px' }}>
          {[
            { icon: '👥', label: 'Всего пользователей', value: userCount, bg: '#EEF3FF' },
            { icon: '👨‍🏫', label: 'Учителей', value: teacherCount, bg: '#F0FDF4' },
            { icon: '📝', label: 'Квизов', value: quizCount, bg: '#F5F3FF' },
          ].map((s, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid #E2E8F0' }}>
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

// ─── SHARED CARD ─────────────────────────────────────────────
function DashCard({ title, icon, empty, action }: { title: string; icon: string; empty: string; action: { label: string; href: string } }) {
  return (
    <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
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
