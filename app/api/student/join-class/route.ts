import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { z } from 'zod'

const Schema = z.object({
  code: z.string().length(6, 'Код должен состоять из 6 символов'),
})

export async function POST(req: NextRequest) {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, role: true },
  })
  if (!user) return NextResponse.json({ error: 'Не найден' }, { status: 401 })
  if (user.role !== 'STUDENT') {
    return NextResponse.json({ error: 'Только ученики могут вступать в классы' }, { status: 403 })
  }

  const body = await req.json()
  const parsed = Schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
  }

  const classroom = await prisma.classroom.findUnique({
    where: { code: parsed.data.code.toUpperCase() },
  })
  if (!classroom) {
    return NextResponse.json({ error: 'Класс с таким кодом не найден' }, { status: 404 })
  }

  const existing = await prisma.classMember.findUnique({
    where: { classroomId_studentId: { classroomId: classroom.id, studentId: user.id } },
  })
  if (existing) {
    return NextResponse.json({ error: 'Вы уже состоите в этом классе' }, { status: 400 })
  }

  await prisma.classMember.create({
    data: { classroomId: classroom.id, studentId: user.id },
  })

  return NextResponse.json({ ok: true, className: classroom.name }, { status: 201 })
}
