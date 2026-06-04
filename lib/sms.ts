const SMSC_LOGIN = process.env.SMSC_LOGIN!
const SMSC_PASSWORD = process.env.SMSC_PASSWORD!

export async function sendSms(phone: string, message: string): Promise<boolean> {
  const cleanPhone = phone.replace(/\D/g, '')
  const url = new URL('https://smsc.kz/sys/send.php')
  url.searchParams.set('login', SMSC_LOGIN)
  url.searchParams.set('psw', SMSC_PASSWORD)
  url.searchParams.set('phones', cleanPhone)
  url.searchParams.set('mes', message)
  url.searchParams.set('fmt', '3') // JSON response
  url.searchParams.set('charset', 'utf-8')

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)
    const res = await fetch(url.toString(), { signal: controller.signal })
    clearTimeout(timeout)
    const data = await res.json()
    console.log('[SMSC response]', data)
    return !data.error_code
  } catch (err) {
    console.error('[SMSC error]', err)
    return false
  }
}

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function otpExpiresAt(): Date {
  return new Date(Date.now() + 5 * 60 * 1000) // 5 минут
}
