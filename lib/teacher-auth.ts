import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function requireTeacher() {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return { error: NextResponse.json({ error: 'Не авторизован' }, { status: 401 }), user: null }
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, role: true, name: true },
  })

  if (!user || user.role !== 'TEACHER') {
    return { error: NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 }), user: null }
  }

  return { error: null, user }
}
