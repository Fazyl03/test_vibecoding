import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendOtpEmail, generateOtp, otpExpiresAt } from '@/lib/email'
import { z } from 'zod'

const Schema = z.object({
  email: z.string().email('Неверный формат email'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = Schema.safeParse(body)
    if (!parsed.success)
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })

    const { email } = parsed.data

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing)
      return NextResponse.json({ error: 'Этот email уже зарегистрирован' }, { status: 400 })

    await prisma.otpCode.updateMany({
      where: { email, purpose: 'REGISTER', used: false },
      data: { used: true },
    })

    const code = generateOtp()
    await prisma.otpCode.create({
      data: { email, code, purpose: 'REGISTER', expiresAt: otpExpiresAt() },
    })

    const sent = await sendOtpEmail(email, code, 'register')

    if (!sent) {
      console.warn('[send-otp] Email failed, dev mode: returning code')
      return NextResponse.json({ message: 'dev', devCode: code })
    }

    return NextResponse.json({ message: 'Код отправлен на email' })
  } catch (err) {
    console.error('[send-otp] Error:', err)
    return NextResponse.json({ error: 'Ошибка сервера. Попробуйте позже.' }, { status: 500 })
  }
}
