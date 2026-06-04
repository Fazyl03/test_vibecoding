import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendSms, generateOtp, otpExpiresAt } from '@/lib/sms'
import { z } from 'zod'

const Schema = z.object({
  phone: z.string().regex(/^\+7\d{10}$/, 'Формат: +77XXXXXXXXX'),
})

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = Schema.safeParse(body)
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })

  const { phone } = parsed.data

  const user = await prisma.user.findUnique({ where: { phone } })
  if (!user)
    return NextResponse.json({ error: 'Номер не найден' }, { status: 404 })

  await prisma.otpCode.updateMany({
    where: { phone, purpose: 'RESET_PASSWORD', used: false },
    data: { used: true },
  })

  const code = generateOtp()
  await prisma.otpCode.create({
    data: { phone, code, purpose: 'RESET_PASSWORD', expiresAt: otpExpiresAt(), userId: user.id },
  })

  const sent = await sendSms(phone, `QazTestPrep: код для сброса пароля — ${code}. Действителен 5 минут.`)
  if (!sent)
    return NextResponse.json({ error: 'Ошибка отправки SMS' }, { status: 500 })

  return NextResponse.json({ message: 'Код отправлен' })
}
