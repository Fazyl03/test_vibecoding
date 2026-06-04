'use client'
import Link from 'next/link'
import { useState } from 'react'

const T = {
  kz: {
    navLinks: [
      { label: 'Басты бет', href: '/' },
      { label: 'Квиздер', href: '/quizzes' },
      { label: 'Бейнесабақтар', href: '/videos' },
      { label: 'Тауарлар', href: '/shop' },
      { label: 'Байланыс', href: '/about' },
    ],
    login: 'Кіру',
    cartLabel: 'тг',
    heroBadge: 'ҰБТ 2025 дайындығы',
    heroTitle: '№1 ресурс ҰБТ сұрақтарына онлайн дайындық платформасы',
    heroSub: 'QazTestPrep ұлттық тестілеуден жоғары нәтижеге қол жеткізуге көмектеседі. Үздіктерден үйреніп, өз дағдыларыңызды жетілдіріп, білім беру саласында көшбасшы болыңыз.',
    heroCta: 'Квизді таңдау →',
    aboutLabel: 'ПЛАТФОРМА ТУРАЛЫ',
    aboutTitle: 'Мақсаттарыңа жол ашыңыз — бүгін бастаңыз!',
    aboutSub: 'Біздің онлайн платформа кез келген уақытта және кез келген жерде ҰБТ-ға дайындалу мүмкіндігін береді. Қай жерде болсаңыз да, білімге қол жетімділік әрқашан сізбен.',
    feats: [
      { icon: '📱', t: 'Кез келген жерде', d: 'Телефон, планшет немесе компьютерден кіре аласың.' },
      { icon: '⚡', t: 'Нәтижені бірден көр', d: 'Квиз өткеннен кейін бірден нәтиже мен қате талдауын аласың.' },
      { icon: '🎯', t: 'Нақты ҰБТ форматы', d: 'Барлық сұрақтар нақты емтихан форматында.' },
    ],
    coursesLabel: 'КВИЗДЕР МЕН КУРСТАР',
    coursesTitle: 'Пәнді таңдаңыз және бірден өтіңіз!',
    warnText: 'Тіркелгеннен кейін барлық тегін квиздерге қол жетімді болады.',
    tabs: ['Барлығы', 'ҰБТ', 'Видео', 'Кітаптар'],
    stepsLabel: 'ҚАЛАЙ ЖҰМЫС ІСТЕЙДІ',
    stepsTitle: '3 қадамда жоғары балл',
    steps: [
      { t: 'Тіркелу', d: '30 секундта аккаунт жасаңыз. Тек email мен пароль керек.' },
      { t: 'Пән таңдау', d: 'Қажетті пәнді ашыңыз және тесттерді өз қарқыныңда орындаңыз.' },
      { t: 'Прогрессті бақыла', d: 'Нәтижелеріңді, әлсіз тақырыптарыңды және өсуіңді бақылайсың.' },
    ],
    reviewsLabel: 'ПІКІРЛЕР',
    reviewsTitle: 'Біздің платформа туралы пікірлер',
    reviews: [
      { name: 'Айгерім С. — ҰБТ 138 балл', sub: '«Бұл платформа арқылы 3 ай дайындалдым»', bg: 'linear-gradient(135deg,#1a1a2e,#2563EB)' },
      { name: 'Дамир А. — ҰБТ 131 балл', sub: '«Грантқа ие болдым, рахмет QazTestPrep!»', bg: 'linear-gradient(135deg,#064e3b,#16A34A)' },
      { name: 'Зарина М. — ҰБТ 125 балл', sub: '«Телефоннан оқу өте ыңғайлы болды»', bg: 'linear-gradient(135deg,#4c1d95,#7C3AED)' },
      { name: 'Нұрай Б. — ҰБТ 118 балл', sub: '«Қате талдауы өте пайдалы!»', bg: 'linear-gradient(135deg,#78350f,#D97706)' },
    ],
    contactTitle: 'Байланыс',
    contactSub: 'Сұрақтарыңыз бар ма? Бізбен хабарласыңыз — жауап беруге дайынбыз.',
    nameLbl: 'Атыңыз', namePh: 'Аты-жөніңіз',
    phoneLbl: 'Телефон', msgLbl: 'Хабарлама', msgPh: 'Сұрағыңыз...',
    send: 'Жіберу',
    ftDesc: 'ҰБТ емтиханына дайындалуға арналған №1 онлайн платформа.',
    ftColTitle: 'ПЛАТФОРМА',
    ftLinks: [
      { label: 'Басты бет', href: '/' },
      { label: 'Квиздер', href: '/quizzes' },
      { label: 'Бейнесабақтар', href: '/videos' },
      { label: 'Тауарлар', href: '/shop' },
    ],
    ftRights: 'Барлық құқықтар қорғалған.',
    ftCity: 'Қазақстан, Алматы',
  },
  ru: {
    navLinks: [
      { label: 'Главная', href: '/' },
      { label: 'Квизы', href: '/quizzes' },
      { label: 'Видеоуроки', href: '/videos' },
      { label: 'Товары', href: '/shop' },
      { label: 'Контакты', href: '/about' },
    ],
    login: 'Войти',
    cartLabel: 'тг',
    heroBadge: 'Подготовка к ЕНТ 2025',
    heroTitle: '№1 ресурс для онлайн подготовки к ЕНТ',
    heroSub: 'QazTestPrep помогает достичь высоких результатов на национальном тестировании. Учитесь у лучших, совершенствуйте навыки, становитесь лидером в образовании.',
    heroCta: 'Выбрать квиз →',
    aboutLabel: 'О ПЛАТФОРМЕ',
    aboutTitle: 'Откройте путь к своим целям — начните сегодня!',
    aboutSub: 'Наша онлайн платформа даёт возможность готовиться к ЕНТ в любое время и в любом месте. Где бы вы ни находились, знания всегда с вами.',
    feats: [
      { icon: '📱', t: 'Везде и всегда', d: 'Заходи с телефона, планшета или компьютера.' },
      { icon: '⚡', t: 'Результат сразу', d: 'После квиза сразу получаешь результат и разбор ошибок.' },
      { icon: '🎯', t: 'Реальный формат ЕНТ', d: 'Все вопросы в формате реального экзамена.' },
    ],
    coursesLabel: 'КВИЗЫ И КУРСЫ',
    coursesTitle: 'Выберите предмет и приступайте сразу!',
    warnText: 'После регистрации открывается доступ ко всем бесплатным квизам.',
    tabs: ['Все', 'ЕНТ', 'Видео', 'Книги'],
    stepsLabel: 'КАК ЭТО РАБОТАЕТ',
    stepsTitle: 'Высокий балл за 3 шага',
    steps: [
      { t: 'Зарегистрируйся', d: 'Создай аккаунт за 30 секунд. Нужны только email и пароль.' },
      { t: 'Выбери предмет', d: 'Открой нужный предмет и начни решать тесты в своём темпе.' },
      { t: 'Следи за прогрессом', d: 'Видишь свои результаты, слабые темы и динамику роста.' },
    ],
    reviewsLabel: 'ОТЗЫВЫ',
    reviewsTitle: 'Отзывы о нашей платформе',
    reviews: [
      { name: 'Айгерим С. — ЕНТ 138 баллов', sub: '«Готовилась через эту платформу 3 месяца»', bg: 'linear-gradient(135deg,#1a1a2e,#2563EB)' },
      { name: 'Дамир А. — ЕНТ 131 балл', sub: '«Получил грант, спасибо QazTestPrep!»', bg: 'linear-gradient(135deg,#064e3b,#16A34A)' },
      { name: 'Зарина М. — ЕНТ 125 баллов', sub: '«Учиться с телефона было очень удобно»', bg: 'linear-gradient(135deg,#4c1d95,#7C3AED)' },
      { name: 'Нурай Б. — ЕНТ 118 баллов', sub: '«Разбор ошибок очень полезен!»', bg: 'linear-gradient(135deg,#78350f,#D97706)' },
    ],
    contactTitle: 'Контакты',
    contactSub: 'Есть вопросы? Свяжитесь с нами — мы готовы ответить.',
    nameLbl: 'Ваше имя', namePh: 'Ваше имя',
    phoneLbl: 'Телефон', msgLbl: 'Сообщение', msgPh: 'Ваш вопрос...',
    send: 'Отправить',
    ftDesc: '№1 онлайн платформа для подготовки к ЕНТ.',
    ftColTitle: 'ПЛАТФОРМА',
    ftLinks: [
      { label: 'Главная', href: '/' },
      { label: 'Квизы', href: '/quizzes' },
      { label: 'Видеоуроки', href: '/videos' },
      { label: 'Товары', href: '/shop' },
    ],
    ftRights: 'Все права защищены.',
    ftCity: 'Казахстан, Алматы',
  },
}

const courses = [
  { emoji: '📐', tag: 'ЕНТ', tagColor: '#2563EB', bg: 'linear-gradient(135deg,#1E3A8A,#2563EB)', typeKz: 'МАТЕМАТИКА', typeRu: 'МАТЕМАТИКА', nameKz: 'Алгебра + Геометрия', nameRu: 'Алгебра + Геометрия', price: '3 500' },
  { emoji: '📜', tag: 'ЕНТ', tagColor: '#16A34A', bg: 'linear-gradient(135deg,#064e3b,#16A34A)', typeKz: 'ТАРИХ', typeRu: 'ИСТОРИЯ', nameKz: 'Қазақстан тарихы — толық курс', nameRu: 'История Казахстана — полный курс', price: '3 500' },
  { emoji: '⭐', tag: 'PREMIUM', tagColor: '#7C3AED', bg: 'linear-gradient(135deg,#4c1d95,#7C3AED)', typeKz: 'ТОЛЫҚ ПАКЕТ', typeRu: 'ПОЛНЫЙ ПАКЕТ', nameKz: 'ҰБТ барлық пәндер', nameRu: 'ЕНТ все предметы', price: '12 000' },
]

const fi: React.CSSProperties = { width: '100%', fontFamily: 'Inter,sans-serif', fontSize: '14px', padding: '11px 14px', border: '1.5px solid #E2E8F0', borderRadius: '9px', background: '#F8FAFC', color: '#0F172A', outline: 'none' }

export default function HomePage() {
  const [lang, setLang] = useState<'kz' | 'ru'>('ru')
  const [tab, setTab] = useState(0)
  const [cartCount] = useState(0)
  const [cartTotal] = useState(0)
  const t = T[lang]

  return (
    <div style={{ fontFamily: 'Inter,sans-serif', background: '#fff', color: '#0F172A', lineHeight: 1.6, overflowX: 'hidden' }}>

      {/* LANG BANNER */}
      <div style={{ background: '#1E3A8A', padding: '7px 24px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,.45)', fontWeight: 500 }}>Тіл / Язык:</span>
        <div style={{ display: 'flex', background: 'rgba(255,255,255,.1)', borderRadius: '6px', overflow: 'hidden' }}>
          {(['kz', 'ru'] as const).map(l => (
            <button key={l} onClick={() => setLang(l)} style={{ fontFamily: 'Inter,sans-serif', fontSize: '12px', fontWeight: 700, padding: '5px 14px', border: 'none', cursor: 'pointer', letterSpacing: '.5px', background: lang === l ? '#2563EB' : 'transparent', color: lang === l ? '#fff' : 'rgba(255,255,255,.5)', borderRadius: lang === l ? '5px' : '0', transition: 'all .2s' }}>
              {l === 'kz' ? 'ҚАЗ' : 'РУС'}
            </button>
          ))}
        </div>
      </div>

      {/* NAV */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(255,255,255,.96)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #E2E8F0', height: '68px', padding: '0 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{ width: '38px', height: '38px', background: '#2563EB', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 900, color: '#fff', fontStyle: 'italic' }}>Q</div>
            <span style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>Qaz<span style={{ color: '#2563EB' }}>TestPrep</span></span>
          </Link>

          {/* Nav links */}
          <ul style={{ display: 'flex', alignItems: 'center', gap: '4px', listStyle: 'none', margin: 0, padding: 0 }}>
            {t.navLinks.map((item, i) => (
              <li key={i}>
                <Link href={item.href} style={{ fontSize: '14px', fontWeight: i === 0 ? 600 : 500, color: i === 0 ? '#fff' : '#475569', textDecoration: 'none', padding: '8px 14px', borderRadius: '8px', background: i === 0 ? '#2563EB' : 'transparent', transition: 'all .2s', display: 'block' }}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right: cart + login */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Cart */}
            <button style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 600, padding: '8px 14px', border: '1.5px solid #E2E8F0', borderRadius: '8px', background: '#fff', color: '#475569', cursor: 'pointer', transition: 'all .2s', position: 'relative', fontFamily: 'Inter,sans-serif' }}>
              <span style={{ fontWeight: 700, color: '#0F172A' }}>{cartTotal} {t.cartLabel}</span>
              <span style={{ fontSize: '18px', lineHeight: 1 }}>🛒</span>
              {cartCount > 0 && (
                <span style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#EF4444', color: '#fff', fontSize: '10px', fontWeight: 800, width: '17px', height: '17px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff' }}>
                  {cartCount}
                </span>
              )}
            </button>
            {/* Login */}
            <Link href="/auth/login" style={{ fontFamily: 'Inter,sans-serif', fontSize: '14px', fontWeight: 600, padding: '9px 20px', border: 'none', borderRadius: '8px', background: '#2563EB', color: '#fff', textDecoration: 'none', transition: 'background .2s' }}>
              {t.login}
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ background: '#fff', padding: '56px 24px 72px', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
          {/* Left — centered text */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <h1 style={{ fontSize: '38px', fontWeight: 900, color: '#0F172A', lineHeight: 1.2, marginBottom: '20px' }}>
              {t.heroTitle}
            </h1>
            <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.85, maxWidth: '480px', marginBottom: '36px', fontFamily: 'Courier New,monospace' }}>
              {t.heroSub}
            </p>
            <div>
              <Link href="/quizzes" style={{ fontFamily: 'Inter,sans-serif', fontSize: '16px', fontWeight: 700, padding: '16px 36px', border: 'none', borderRadius: '50px', background: '#2563EB', color: '#fff', cursor: 'pointer', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 20px rgba(37,99,235,.35)', transition: 'all .2s' }}>
                {t.heroCta}
              </Link>
            </div>
          </div>

          {/* Right — illustration */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: '100%', maxWidth: '500px' }}>
              <img src="/hero-student.png" alt="student studying" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
          </div>
        </div>
      </div>

      {/* ABOUT */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ maxWidth: '760px', margin: '0 auto' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#2563EB', marginBottom: '10px' }}>{t.aboutLabel}</div>
            <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#0F172A', letterSpacing: '-.5px', lineHeight: 1.2, marginBottom: '12px' }}>{t.aboutTitle}</h2>
            <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.7, maxWidth: '560px', marginBottom: '28px' }}>{t.aboutSub}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {t.feats.map((f, i) => (
                <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '44px', height: '44px', flexShrink: 0, borderRadius: '12px', background: '#EEF3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>{f.icon}</div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>{f.t}</div>
                    <div style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6 }}>{f.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* COURSES */}
      <section style={{ padding: '80px 24px', background: '#F8FAFC' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '36px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#2563EB', marginBottom: '10px' }}>{t.coursesLabel}</div>
            <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#0F172A', letterSpacing: '-.5px', lineHeight: 1.2 }}>{t.coursesTitle}</h2>
          </div>
          <div style={{ background: '#FFFBEB', border: '1.5px solid #FDE68A', borderRadius: '12px', padding: '14px 18px', display: 'flex', gap: '12px', alignItems: 'flex-start', fontSize: '14px', color: '#78350F', marginBottom: '12px' }}>
            <span style={{ fontSize: '18px', flexShrink: 0 }}>⚠️</span>
            <div>{t.warnText}</div>
          </div>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '36px', background: '#E2E8F0', padding: '4px', borderRadius: '12px', width: 'fit-content' }}>
            {t.tabs.map((tb, i) => (
              <button key={i} onClick={() => setTab(i)} style={{ fontFamily: 'Inter,sans-serif', fontSize: '14px', fontWeight: 600, padding: '10px 24px', borderRadius: '9px', border: 'none', cursor: 'pointer', background: tab === i ? '#fff' : 'transparent', color: tab === i ? '#2563EB' : '#475569', boxShadow: tab === i ? '0 2px 8px rgba(0,0,0,.06)' : 'none', transition: 'all .2s' }}>
                {tb}
              </button>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px' }}>
            {courses.map((c, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', border: '1px solid #E2E8F0', cursor: 'pointer', transition: 'all .2s' }}>
                <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', fontSize: '72px', background: c.bg }}>
                  {c.emoji}
                  <span style={{ position: 'absolute', top: '12px', right: '12px', background: '#fff', fontSize: '12px', fontWeight: 700, padding: '4px 10px', borderRadius: '6px', color: c.tagColor }}>{c.tag}</span>
                </div>
                <div style={{ padding: '18px 20px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', color: c.tagColor, marginBottom: '6px' }}>{lang === 'kz' ? c.typeKz : c.typeRu}</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '8px', lineHeight: 1.3 }}>{lang === 'kz' ? c.nameKz : c.nameRu}</div>
                  <div style={{ fontSize: '13px', color: '#94A3B8' }}>📖 {lang === 'kz' ? '2 ай қол жетімді' : '2 месяца доступа'}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderTop: '1px solid #E2E8F0', background: '#F8FAFC' }}>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>{c.price} <span style={{ fontSize: '13px', fontWeight: 500, color: '#94A3B8' }}>тг</span></div>
                  <Link href="/auth/register" style={{ fontFamily: 'Inter,sans-serif', fontSize: '13px', fontWeight: 700, padding: '9px 18px', border: 'none', borderRadius: '8px', background: '#2563EB', color: '#fff', cursor: 'pointer', textDecoration: 'none' }}>
                    {lang === 'kz' ? 'Сатып алу' : 'Купить'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '48px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#2563EB', marginBottom: '10px' }}>{t.stepsLabel}</div>
            <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#0F172A', letterSpacing: '-.5px', lineHeight: 1.2 }}>{t.stepsTitle}</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '24px' }}>
            {t.steps.map((s, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '28px', position: 'relative' }}>
                {i < 2 && (
                  <div style={{ position: 'absolute', top: '42px', right: '-28px', width: '32px', height: '2px', background: '#BFCFFF', zIndex: 1 }}>
                    <div style={{ position: 'absolute', right: '-5px', top: '-4px', width: '10px', height: '10px', borderTop: '2px solid #BFCFFF', borderRight: '2px solid #BFCFFF', transform: 'rotate(45deg)' }} />
                  </div>
                )}
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#2563EB', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 800, marginBottom: '18px' }}>{i + 1}</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>{s.t}</div>
                <div style={{ fontSize: '14px', color: '#475569', lineHeight: 1.65 }}>{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section style={{ padding: '80px 24px', background: '#F8FAFC' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '48px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#2563EB', marginBottom: '10px' }}>{t.reviewsLabel}</div>
            <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#0F172A', letterSpacing: '-.5px', lineHeight: 1.2 }}>{t.reviewsTitle}</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '20px' }}>
            {t.reviews.map((r, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', border: '1px solid #E2E8F0', cursor: 'pointer', transition: 'all .2s' }}>
                <div style={{ aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center', background: r.bg }}>
                  <div style={{ width: '52px', height: '52px', background: 'rgba(255,255,255,.9)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>▶</div>
                </div>
                <div style={{ padding: '14px 16px', fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>{r.name}</div>
                <div style={{ padding: '0 16px 14px', fontSize: '12px', color: '#94A3B8' }}>{r.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section style={{ padding: '80px 24px', background: '#1E3A8A' }} id="contact">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'start' }}>
            <div>
              <h2 style={{ fontSize: '34px', fontWeight: 800, color: '#fff', letterSpacing: '-.5px', marginBottom: '12px' }}>{t.contactTitle}</h2>
              <p style={{ fontSize: '15px', color: 'rgba(255,255,255,.62)', lineHeight: 1.7, marginBottom: '32px' }}>{t.contactSub}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { icon: '📞', lbl: 'Телефон', val: '+7 705 805 42 72' },
                  { icon: '📸', lbl: 'Instagram', val: '@qaztestprep' },
                  { icon: '✈️', lbl: 'Telegram', val: '@qaztestprep' },
                  { icon: '▶️', lbl: 'YouTube', val: '@qaztestprep' },
                ].map((c, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(255,255,255,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>{c.icon}</div>
                    <div>
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,.48)', fontWeight: 500, marginBottom: '2px' }}>{c.lbl}</div>
                      <div style={{ fontSize: '15px', fontWeight: 600, color: '#fff' }}>{c.val}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: '#fff', borderRadius: '20px', padding: '32px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', marginBottom: '20px' }}>{lang === 'kz' ? 'Хабарлама жіберу' : 'Отправить сообщение'}</h3>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>{t.nameLbl}</label>
                <input type="text" placeholder={t.namePh} style={fi} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>{lang === 'kz' ? 'Ел коды' : 'Код страны'}</label>
                  <input type="text" value="KZ +7" readOnly style={fi} />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>{t.phoneLbl}</label>
                  <input type="tel" placeholder={lang === 'kz' ? 'Нөмірі' : 'Номер'} style={fi} />
                </div>
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>{t.msgLbl}</label>
                <textarea placeholder={t.msgPh} style={{ ...fi, resize: 'vertical', minHeight: '100px' }} />
              </div>
              <button style={{ width: '100%', fontFamily: 'Inter,sans-serif', fontSize: '15px', fontWeight: 700, padding: '13px', border: 'none', borderRadius: '10px', background: '#2563EB', color: '#fff', cursor: 'pointer', marginTop: '4px' }}>
                {t.send}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#0F172A', padding: '40px 24px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '32px', flexWrap: 'wrap', marginBottom: '32px' }}>
            <div style={{ maxWidth: '280px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{ width: '34px', height: '34px', background: '#2563EB', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 900, color: '#fff', fontStyle: 'italic' }}>Q</div>
                <span style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>Qaz<span style={{ color: '#60A5FA' }}>TestPrep</span></span>
              </div>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,.42)', lineHeight: 1.6 }}>{t.ftDesc}</p>
            </div>
            <div>
              <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '14px' }}>{t.ftColTitle}</h4>
              {t.ftLinks.map((l, i) => (
                <Link key={i} href={l.href} style={{ display: 'block', fontSize: '14px', color: 'rgba(255,255,255,.48)', textDecoration: 'none', marginBottom: '8px', transition: 'color .2s' }}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,.08)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,.32)' }}>
              <strong style={{ color: 'rgba(255,255,255,.5)' }}>QazTestPrep</strong> · {t.ftCity}
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,.32)' }}>
              © 2025 QazTestPrep. {t.ftRights}
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
