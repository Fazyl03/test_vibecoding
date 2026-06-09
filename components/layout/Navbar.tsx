'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const navLinks = [
  { label: 'Главная',    href: '/' },
  { label: 'Квизы',      href: '/quizzes' },
  { label: 'Видеоуроки', href: '/videos' },
  { label: 'Товары',     href: '/shop' },
  { label: 'Контакты',   href: '/about' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      <style>{`
        .nav-links-desktop { display: flex !important; }
        .nav-right-desktop { display: flex !important; }
        .nav-burger { display: none !important; }
        .nav-mobile-menu { display: none; }
        @media (max-width: 768px) {
          .nav-links-desktop { display: none !important; }
          .nav-right-desktop { display: none !important; }
          .nav-burger { display: flex !important; }
          .nav-mobile-menu { display: flex; }
        }
      `}</style>

      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(255,255,255,.97)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #E2E8F0', fontFamily: 'Inter,sans-serif' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', height: '64px', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ width: '36px', height: '36px', background: '#2563EB', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px', fontWeight: 900, color: '#fff', fontStyle: 'italic' }}>Q</div>
            <span style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A' }}>Qaz<span style={{ color: '#2563EB' }}>TestPrep</span></span>
          </Link>

          {/* Desktop links */}
          <ul className="nav-links-desktop" style={{ alignItems: 'center', gap: '2px', listStyle: 'none', margin: 0, padding: 0 }}>
            {navLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} style={{ fontSize: '14px', fontWeight: pathname === item.href ? 600 : 500, color: pathname === item.href ? '#fff' : '#475569', textDecoration: 'none', padding: '7px 13px', borderRadius: '8px', background: pathname === item.href ? '#2563EB' : 'transparent', display: 'block', transition: 'all .2s' }}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop right */}
          <div className="nav-right-desktop" style={{ alignItems: 'center', gap: '10px' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 600, padding: '7px 13px', border: '1.5px solid #E2E8F0', borderRadius: '8px', background: '#fff', color: '#475569', cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>
              <span style={{ fontWeight: 700, color: '#0F172A' }}>0 тг</span>
              <span style={{ fontSize: '17px' }}>🛒</span>
            </button>
            <Link href="/auth/login" style={{ fontFamily: 'Inter,sans-serif', fontSize: '14px', fontWeight: 600, padding: '8px 18px', border: 'none', borderRadius: '8px', background: '#2563EB', color: '#fff', textDecoration: 'none' }}>
              Войти
            </Link>
          </div>

          {/* Burger */}
          <button className="nav-burger" onClick={() => setOpen(!open)} style={{ flexDirection: 'column', gap: '5px', padding: '8px', background: 'none', border: 'none', cursor: 'pointer' }}>
            <span style={{ display: 'block', width: '22px', height: '2px', background: '#0F172A', borderRadius: '2px', transition: 'all .25s', transform: open ? 'rotate(45deg) translate(5px,5px)' : 'none' }} />
            <span style={{ display: 'block', width: '22px', height: '2px', background: '#0F172A', borderRadius: '2px', transition: 'all .25s', opacity: open ? 0 : 1 }} />
            <span style={{ display: 'block', width: '22px', height: '2px', background: '#0F172A', borderRadius: '2px', transition: 'all .25s', transform: open ? 'rotate(-45deg) translate(5px,-5px)' : 'none' }} />
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="nav-mobile-menu" style={{ flexDirection: 'column', borderTop: '1px solid #E2E8F0', background: '#fff', padding: '12px 20px 16px' }}>
            {navLinks.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} style={{ fontSize: '15px', fontWeight: pathname === item.href ? 700 : 500, color: pathname === item.href ? '#2563EB' : '#475569', textDecoration: 'none', padding: '11px 12px', borderRadius: '10px', background: pathname === item.href ? '#EEF3FF' : 'transparent', display: 'block' }}>
                {item.label}
              </Link>
            ))}
            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid #F1F5F9', paddingTop: '12px' }}>
              <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '14px', fontWeight: 600, padding: '11px', border: '1.5px solid #E2E8F0', borderRadius: '10px', background: '#fff', color: '#475569', cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>
                <span style={{ fontWeight: 700, color: '#0F172A' }}>0 тг</span>
                <span style={{ fontSize: '17px' }}>🛒</span>
              </button>
              <Link href="/auth/login" onClick={() => setOpen(false)} style={{ fontFamily: 'Inter,sans-serif', fontSize: '14px', fontWeight: 700, padding: '11px', border: 'none', borderRadius: '10px', background: '#2563EB', color: '#fff', textDecoration: 'none', textAlign: 'center', display: 'block' }}>
                Войти
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
