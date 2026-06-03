import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await getServerSession()
  if (!session) redirect('/auth/login')

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <nav className="border-b border-[#E8E8E4] bg-white">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 12L8 4L13 12H3Z" fill="white" />
              </svg>
            </div>
            <span className="font-bold text-[15px]">
              Qaz<span className="text-[#2563EB]">TestPrep</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#4A4A4A]">{session.user?.name}</span>
            <Link
              href="/api/auth/signout"
              className="text-sm text-[#9A9A9A] hover:text-[#1A1A1A] transition-colors"
            >
              Выйти
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-[#1A1A1A] tracking-tight mb-2">
          Привет, {session.user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-[#4A4A4A] mb-10">Выбери предмет и начни готовиться</p>

        <div className="bg-white border border-[#E8E8E4] rounded-2xl p-8 text-center">
          <p className="text-[#9A9A9A] text-sm">
            Предметы и тесты появятся в следующей версии
          </p>
        </div>
      </main>
    </div>
  )
}
