import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireTeacher } from '@/lib/teacher-auth'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const { error, user } = await requireTeacher()
  if (error) return error

  const classroom = await prisma.classroom.findFirst({
    where: { id: params.id, teacherId: user!.id },
    include: {
      members: {
        include: { student: { select: { id: true, name: true, username: true, email: true } } },
        orderBy: { joinedAt: 'asc' },
      },
      _count: { select: { members: true } },
    },
  })
  if (!classroom) return NextResponse.json({ error: 'Класс не найден' }, { status: 404 })
  return NextResponse.json(classroom)
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { error, user } = await requireTeacher()
  if (error) return error

  const classroom = await prisma.classroom.findFirst({ where: { id: params.id, teacherId: user!.id } })
  if (!classroom) return NextResponse.json({ error: 'Класс не найден' }, { status: 404 })

  await prisma.classroom.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
