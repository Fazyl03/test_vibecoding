'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const navLinks = [
  { href: '/',           label: 'Главная' },
  { href: '/quizzes',    label: 'Квизы' },
  { href: '/videos',     label: 'Видеоуроки' },
  { href: '/shop',       label: 'Товары' },
  { href: '/about',      label: 'О нас' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-[#FAFAF7]/90 backdrop-blur-md border-b border-[#E8E8E4]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 12L8 4L13 12H3Z" fill="white"/></svg>
          </div>
          <span className="font-bold text-[15px]">Qaz<span className="text-[#2563EB]">TestPrep</span></span>
        </Link>

        <ul className="hidden md:flex items-center gap-6 list-none">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link href={href}
                className={`text-sm font-medium transition-colors ${pathname === href ? 'text-[#2563EB]' : 'text-[#4A4A4A] hover:text-[#1A1A1A]'}`}>
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/auth/login" className="text-sm font-medium text-[#4A4A4A] hover:text-[#1A1A1A] px-4 py-2 transition-colors">
            Войти
          </Link>
          <Link href="/auth/register" className="text-sm font-semibold bg-[#2563EB] text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors">
            Начать бесплатно
          </Link>
        </div>

        {/* Mobile burger */}
        <button onClick={() => setOpen(!open)} className="md:hidden flex flex-col gap-1.5 p-2">
          <span className={`block w-5 h-0.5 bg-[#1A1A1A] transition-all ${open ? 'rotate-45 translate-y-2' : ''}`}/>
          <span className={`block w-5 h-0.5 bg-[#1A1A1A] transition-all ${open ? 'opacity-0' : ''}`}/>
          <span className={`block w-5 h-0.5 bg-[#1A1A1A] transition-all ${open ? '-rotate-45 -translate-y-2' : ''}`}/>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-[#E8E8E4] bg-[#FAFAF7] px-6 py-4 flex flex-col gap-4">
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}
              className={`text-sm font-medium ${pathname === href ? 'text-[#2563EB]' : 'text-[#4A4A4A]'}`}>
              {label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-2 border-t border-[#E8E8E4]">
            <Link href="/auth/login" className="text-sm font-medium text-center border border-[#E8E8E4] py-2.5 rounded-xl">Войти</Link>
            <Link href="/auth/register" className="text-sm font-semibold text-center bg-[#2563EB] text-white py-2.5 rounded-xl">Начать бесплатно</Link>
          </div>
        </div>
      )}
    </nav>
  )
}
