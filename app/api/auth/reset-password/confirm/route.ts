import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const Schema = z.object({
  phone:       z.string().regex(/^\+7\d{10}$/),
  code:        z.string().length(6),
  newPassword: z.string().min(8, 'Минимум 8 символов'),
})

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = Schema.safeParse(body)
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })

  const { phone, code, newPassword } = parsed.data

  const otp = await prisma.otpCode.findFirst({
    where: { phone, code, purpose: 'RESET_PASSWORD', used: false, expiresAt: { gt: new Date() } },
  })
  if (!otp)
    return NextResponse.json({ error: 'Неверный или истёкший код' }, { status: 400 })

  const hashed = await bcrypt.hash(newPassword, 12)
  await prisma.user.update({
    where: { phone },
    data: { password: hashed },
  })
  await prisma.otpCode.update({ where: { id: otp.id }, data: { used: true } })

  return NextResponse.json({ message: 'Пароль изменён' })
}
