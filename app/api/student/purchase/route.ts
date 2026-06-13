import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { z } from 'zod'

const Schema = z.object({
  productId: z.string().optional(),
  courseId:  z.string().optional(),
}).refine(d => (!!d.productId) !== (!!d.courseId), {
  message: 'Укажите либо productId, либо courseId — но не оба',
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
  if (!user) return NextResponse.json({ error: 'Пользователь не найден' }, { status: 401 })
  if (user.role !== 'STUDENT') {
    return NextResponse.json({ error: 'Только ученики могут совершать покупки' }, { status: 403 })
  }

  const body = await req.json()
  const parsed = Schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })

  const { productId, courseId } = parsed.data

  let amount = 0

  if (productId) {
    const product = await prisma.product.findFirst({ where: { id: productId, isPublished: true } })
    if (!product) return NextResponse.json({ error: 'Товар не найден' }, { status: 404 })

    const existing = await prisma.purchase.findUnique({
      where: { studentId_productId: { studentId: user.id, productId } },
    })
    if (existing) return NextResponse.json({ error: 'Вы уже купили этот товар' }, { status: 400 })

    amount = product.price
  } else if (courseId) {
    const course = await prisma.course.findFirst({ where: { id: courseId, isPublished: true } })
    if (!course) return NextResponse.json({ error: 'Курс не найден' }, { status: 404 })

    const existing = await prisma.purchase.findUnique({
      where: { studentId_courseId: { studentId: user.id, courseId } },
    })
    if (existing) return NextResponse.json({ error: 'Вы уже купили этот курс' }, { status: 400 })

    amount = course.price
  }

  const purchase = await prisma.purchase.create({
    data: {
      studentId: user.id,
      productId: productId ?? null,
      courseId:  courseId ?? null,
      amount,
      status: 'COMPLETED', // MVP заглушка — оплата подключится позже
    },
  })

  return NextResponse.json({ ok: true, purchaseId: purchase.id }, { status: 201 })
}
