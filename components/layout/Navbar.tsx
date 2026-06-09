'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const navLinks = [
  { label: 'Главная',     href: '/' },
  { label: 'Квизы',       href: '/quizzes' },
  { label: 'Видеоуроки',  href: '/videos' },
  { label: 'Товары',      href: '/shop' },
  { label: 'Контакты',    href: '/about' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [cartCount] = useState(0)
  const [cartTotal] = useState(0)

  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(255,255,255,.96)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #E2E8F0', height: '68px', padding: '0 24px', fontFamily: 'Inter,sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ width: '38px', height: '38px', background: '#2563EB', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 900, color: '#fff', fontStyle: 'italic' }}>Q</div>
          <span style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>Qaz<span style={{ color: '#2563EB' }}>TestPrep</span></span>
        </Link>

        {/* Nav links */}
        <ul style={{ display: 'flex', alignItems: 'center', gap: '4px', listStyle: 'none', margin: 0, padding: 0 }}>
          {navLinks.map((item, i) => {
            const active = pathname === item.href
            return (
              <li key={i}>
                <Link href={item.href} style={{ fontSize: '14px', fontWeight: active ? 600 : 500, color: active ? '#fff' : '#475569', textDecoration: 'none', padding: '8px 14px', borderRadius: '8px', background: active ? '#2563EB' : 'transparent', display: 'block', transition: 'all .2s' }}>
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Cart + Login */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 600, padding: '8px 14px', border: '1.5px solid #E2E8F0', borderRadius: '8px', background: '#fff', color: '#475569', cursor: 'pointer', fontFamily: 'Inter,sans-serif', position: 'relative' }}>
            <span style={{ fontWeight: 700, color: '#0F172A' }}>{cartTotal} тг</span>
            <span style={{ fontSize: '18px', lineHeight: 1 }}>🛒</span>
            {cartCount > 0 && (
              <span style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#EF4444', color: '#fff', fontSize: '10px', fontWeight: 800, width: '17px', height: '17px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff' }}>
                {cartCount}
              </span>
            )}
          </button>
          <Link href="/auth/login" style={{ fontFamily: 'Inter,sans-serif', fontSize: '14px', fontWeight: 600, padding: '9px 20px', border: 'none', borderRadius: '8px', background: '#2563EB', color: '#fff', textDecoration: 'none' }}>
            Войти
          </Link>
        </div>
      </div>
    </nav>
  )
}
