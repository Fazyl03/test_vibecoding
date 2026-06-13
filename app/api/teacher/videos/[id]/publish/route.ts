import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireTeacher } from '@/lib/teacher-auth'

export async function PUT(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error, user } = await requireTeacher()
  if (error) return error

  const video = await prisma.video.findFirst({ where: { id: params.id, teacherId: user!.id } })
  if (!video) return NextResponse.json({ error: 'Видео не найдено' }, { status: 404 })

  await prisma.video.update({ where: { id: params.id }, data: { isPublished: true } })
  return NextResponse.json({ ok: true })
}
