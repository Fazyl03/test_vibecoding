import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const Schema = z.object({
  name:     z.string().min(2, 'Имя слишком короткое'),
  username: z.string().min(3).regex(/^[a-zA-Z0-9_]+$/, 'Только латиница, цифры и _'),
  email:    z.string().email('Неверный формат email'),
  password: z.string().min(8, 'Минимум 8 символов'),
  role:     z.enum(['STUDENT', 'TEACHER']),
  code:     z.string().length(6, 'Код — 6 цифр'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = Schema.safeParse(body)
    if (!parsed.success)
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })

    const { name, username, email, password, role, code } = parsed.data

    const otp = await prisma.otpCode.findFirst({
      where: { email, code, purpose: 'REGISTER', used: false, expiresAt: { gt: new Date() } },
    })
    if (!otp)
      return NextResponse.json({ error: 'Неверный или истёкший код' }, { status: 400 })

    const [byEmail, byUsername] = await Promise.all([
      prisma.user.findUnique({ where: { email } }),
      prisma.user.findUnique({ where: { username } }),
    ])
    if (byEmail)    return NextResponse.json({ error: 'Email уже зарегистрирован' }, { status: 400 })
    if (byUsername) return NextResponse.json({ error: 'Никнейм занят' }, { status: 400 })

    const hashed = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: { name, username, email, password: hashed, role },
    })
    await prisma.otpCode.update({ where: { id: otp.id }, data: { used: true } })

    return NextResponse.json({ message: 'Аккаунт создан', userId: user.id }, { status: 201 })
  } catch (err) {
    console.error('[register] Error:', err)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
