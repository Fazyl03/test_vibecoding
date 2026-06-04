'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const navLinks = [
  { href: '/',        label: 'Главная' },
  { href: '/quizzes', label: 'Квизы' },
  { href: '/videos',  label: 'Видеоуроки' },
  { href: '/shop',    label: 'Товары' },
  { href: '/about',   label: 'О нас' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-[#F7F6F2]/95 backdrop-blur-md border-b border-[#E2E0D8]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 bg-[#2563EB] rounded-xl flex items-center justify-center shadow-md shadow-blue-200">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 12L8 4L13 12H3Z" fill="white"/></svg>
          </div>
          <span className="font-black text-[15px] tracking-tight">Qaz<span className="text-[#2563EB]">TestPrep</span></span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-1 list-none">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link href={href}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  pathname === href
                    ? 'bg-[#EEF3FF] text-[#2563EB]'
                    : 'text-[#444444] hover:text-[#111111] hover:bg-black/5'
                }`}>
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-2">
          <Link href="/auth/login"
            className="text-sm font-semibold text-[#444444] hover:text-[#111111] px-4 py-2 rounded-xl hover:bg-black/5 transition-all">
            Войти
          </Link>
          <Link href="/auth/register"
            className="text-sm font-bold bg-[#2563EB] text-white px-5 py-2.5 rounded-xl hover:bg-[#1A44C2] transition-all shadow-md shadow-blue-200">
            Начать бесплатно
          </Link>
        </div>

        {/* Mobile burger */}
        <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-xl hover:bg-black/5 transition">
          <div className={`w-5 h-0.5 bg-[#111111] transition-all mb-1.5 ${open ? 'rotate-45 translate-y-2' : ''}`}/>
          <div className={`w-5 h-0.5 bg-[#111111] transition-all mb-1.5 ${open ? 'opacity-0' : ''}`}/>
          <div className={`w-5 h-0.5 bg-[#111111] transition-all ${open ? '-rotate-45 -translate-y-2' : ''}`}/>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-[#E2E0D8] bg-[#F7F6F2] px-6 py-4 flex flex-col gap-1">
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                pathname === href ? 'bg-[#EEF3FF] text-[#2563EB]' : 'text-[#444444]'
              }`}>
              {label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-3 mt-2 border-t border-[#E2E0D8]">
            <Link href="/auth/login" className="text-sm font-semibold text-center border border-[#E2E0D8] py-3 rounded-xl bg-white">Войти</Link>
            <Link href="/auth/register" className="text-sm font-bold text-center bg-[#2563EB] text-white py-3 rounded-xl">Начать бесплатно</Link>
          </div>
        </div>
      )}
    </nav>
  )
}
