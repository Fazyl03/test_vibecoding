const RESEND_API_KEY = process.env.RESEND_API_KEY!

export async function sendOtpEmail(email: string, code: string, purpose: 'register' | 'reset'): Promise<boolean> {
  const subject = purpose === 'register'
    ? 'QazTestPrep — код подтверждения'
    : 'QazTestPrep — сброс пароля'

  const html = `
    <div style="font-family: 'Helvetica Neue', sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; background: #FAFAF7;">
      <div style="margin-bottom: 32px;">
        <span style="font-weight: 800; font-size: 18px; color: #1A1A1A;">Qaz</span><span style="font-weight: 800; font-size: 18px; color: #2563EB;">TestPrep</span>
      </div>
      <h1 style="font-size: 22px; font-weight: 700; color: #1A1A1A; margin: 0 0 8px;">
        ${purpose === 'register' ? 'Подтверди email' : 'Сброс пароля'}
      </h1>
      <p style="color: #4A4A4A; font-size: 15px; margin: 0 0 32px; line-height: 1.5;">
        ${purpose === 'register'
          ? 'Введи этот код для завершения регистрации. Он действителен 5 минут.'
          : 'Введи этот код для сброса пароля. Он действителен 5 минут.'}
      </p>
      <div style="background: white; border: 1px solid #E8E8E4; border-radius: 16px; padding: 24px; text-align: center; margin-bottom: 32px;">
        <span style="font-size: 40px; font-weight: 800; letter-spacing: 12px; color: #2563EB;">${code}</span>
      </div>
      <p style="color: #9A9A9A; font-size: 13px; line-height: 1.5;">
        Если ты не запрашивал этот код — просто проигнорируй письмо.
      </p>
    </div>
  `

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'QazTestPrep <onboarding@resend.dev>',
        to: email,
        subject,
        html,
      }),
    })
    const data = await res.json()
    console.log('[Resend response]', data)
    return res.ok
  } catch (err) {
    console.error('[Resend error]', err)
    return false
  }
}

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function otpExpiresAt(): Date {
  return new Date(Date.now() + 5 * 60 * 1000)
}
