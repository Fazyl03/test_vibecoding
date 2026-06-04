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

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user)
      return NextResponse.json({ error: 'Пользователь с таким email не найден' }, { status: 404 })

    await prisma.otpCode.updateMany({
      where: { email, purpose: 'RESET_PASSWORD', used: false },
      data: { used: true },
    })

    const code = generateOtp()
    await prisma.otpCode.create({
      data: { email, code, purpose: 'RESET_PASSWORD', expiresAt: otpExpiresAt(), userId: user.id },
    })

    const sent = await sendOtpEmail(email, code, 'reset')
    if (!sent)
      return NextResponse.json({ message: 'dev', devCode: code })

    return NextResponse.json({ message: 'Код отправлен на email' })
  } catch (err) {
    console.error('[reset-send] Error:', err)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
