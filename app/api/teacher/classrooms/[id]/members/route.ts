import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireTeacher } from '@/lib/teacher-auth'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { error, user } = await requireTeacher()
  if (error) return error

  const classroom = await prisma.classroom.findFirst({ where: { id: params.id, teacherId: user!.id } })
  if (!classroom) return NextResponse.json({ error: 'Класс не найден' }, { status: 404 })

  const { username } = await req.json()
  if (!username) return NextResponse.json({ error: 'Укажите username' }, { status: 400 })

  const student = await prisma.user.findUnique({ where: { username }, select: { id: true, role: true, name: true } })
  if (!student || student.role !== 'STUDENT') return NextResponse.json({ error: 'Ученик не найден' }, { status: 404 })

  const existing = await prisma.classMember.findUnique({
    where: { classroomId_studentId: { classroomId: params.id, studentId: student.id } },
  })
  if (existing) return NextResponse.json({ error: 'Ученик уже в этом классе' }, { status: 400 })

  await prisma.classMember.create({ data: { classroomId: params.id, studentId: student.id } })
  return NextResponse.json({ ok: true, studentName: student.name }, { status: 201 })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { error, user } = await requireTeacher()
  if (error) return error

  const { studentId } = await req.json()
  const classroom = await prisma.classroom.findFirst({ where: { id: params.id, teacherId: user!.id } })
  if (!classroom) return NextResponse.json({ error: 'Класс не найден' }, { status: 404 })

  await prisma.classMember.deleteMany({ where: { classroomId: params.id, studentId } })
  return NextResponse.json({ ok: true })
}
