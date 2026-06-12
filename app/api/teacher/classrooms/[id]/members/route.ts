import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireTeacher } from '@/lib/teacher-auth'
import { z } from 'zod'

const Schema = z.object({
  username: z.string().min(1, 'Введите никнейм'),
})

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error, user } = await requireTeacher()
  if (error) return error

  const classroom = await prisma.classroom.findUnique({ where: { id: params.id } })
  if (!classroom)
    return NextResponse.json({ error: 'Класс не найден' }, { status: 404 })
  if (classroom.teacherId !== user!.id)
    return NextResponse.json({ error: 'Нет доступа' }, { status: 403 })

  try {
    const body = await req.json()
    const parsed = Schema.safeParse(body)
    if (!parsed.success)
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })

    const student = await prisma.user.findUnique({
      where: { username: parsed.data.username },
      select: { id: true, name: true, username: true, role: true },
    })

    if (!student)
      return NextResponse.json({ error: 'Ученик с таким никнеймом не найден' }, { status: 404 })

    if (student.role !== 'STUDENT')
      return NextResponse.json({ error: 'Пользователь не является учеником' }, { status: 400 })

    const existing = await prisma.classMember.findUnique({
      where: { classroomId_studentId: { classroomId: params.id, studentId: student.id } },
    })
    if (existing)
      return NextResponse.json({ error: 'Ученик уже добавлен в этот класс' }, { status: 400 })

    const member = await prisma.classMember.create({
      data: { classroomId: params.id, studentId: student.id },
    })

    return NextResponse.json({ member, student }, { status: 201 })
  } catch (err) {
    console.error('[members POST]', err)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error, user } = await requireTeacher()
  if (error) return error

  const classroom = await prisma.classroom.findUnique({ where: { id: params.id } })
  if (!classroom)
    return NextResponse.json({ error: 'Класс не найден' }, { status: 404 })
  if (classroom.teacherId !== user!.id)
    return NextResponse.json({ error: 'Нет доступа' }, { status: 403 })

  const { studentId } = await req.json()
  await prisma.classMember.deleteMany({
    where: { classroomId: params.id, studentId },
  })

  return NextResponse.json({ message: 'Ученик удалён из класса' })
}
