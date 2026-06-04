import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendSms, generateOtp, otpExpiresAt } from '@/lib/sms'
import { z } from 'zod'

const Schema = z.object({
  phone: z.string().regex(/^\+7\d{10}$/, 'Формат: +77XXXXXXXXX'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = Schema.safeParse(body)
    if (!parsed.success)
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })

    const { phone } = parsed.data

    const existing = await prisma.user.findUnique({ where: { phone } })
    if (existing)
      return NextResponse.json({ error: 'Этот номер уже зарегистрирован' }, { status: 400 })

    // Инвалидируем старые коды
    await prisma.otpCode.updateMany({
      where: { phone, purpose: 'REGISTER', used: false },
      data: { used: true },
    })

    const code = generateOtp()
    await prisma.otpCode.create({
      data: { phone, code, purpose: 'REGISTER', expiresAt: otpExpiresAt() },
    })

    const sent = await sendSms(phone, `QazTestPrep: код подтверждения — ${code}. Действителен 5 минут.`)

    if (!sent) {
      console.error('[send-otp] SMS failed for', phone)
      return NextResponse.json(
        { error: 'Не удалось отправить SMS. Проверьте номер и попробуйте снова.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Код отправлен' })
  } catch (err) {
    console.error('[send-otp] Unexpected error:', err)
    return NextResponse.json({ error: 'Ошибка сервера. Попробуйте позже.' }, { status: 500 })
  }
}
