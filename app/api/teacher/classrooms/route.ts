import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireTeacher } from '@/lib/teacher-auth'
import { z } from 'zod'

const Schema = z.object({
  name: z.string().min(2, 'Минимум 2 символа').max(50),
})

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export async function POST(req: NextRequest) {
  const { error, user } = await requireTeacher()
  if (error) return error

  try {
    const body = await req.json()
    const parsed = Schema.safeParse(body)
    if (!parsed.success)
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })

    // Generate unique code
    let code = generateCode()
    let attempts = 0
    while (attempts < 10) {
      const existing = await prisma.classroom.findUnique({ where: { code } })
      if (!existing) break
      code = generateCode()
      attempts++
    }

    const classroom = await prisma.classroom.create({
      data: {
        teacherId: user!.id,
        name: parsed.data.name,
        code,
      },
    })

    return NextResponse.json({ id: classroom.id, code: classroom.code }, { status: 201 })
  } catch (err) {
    console.error('[classrooms POST]', err)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

export async function GET() {
  const { error, user } = await requireTeacher()
  if (error) return error

  const classrooms = await prisma.classroom.findMany({
    where: { teacherId: user!.id },
    include: { _count: { select: { members: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(classrooms)
}
