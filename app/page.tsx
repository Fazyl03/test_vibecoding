'use client'
import Link from 'next/link'
import { useState } from 'react'

const t = {
  kz: {
    langLabel: 'Тіл:',
    navLinks: ['Басты бет','Квиздер','Бейнесабақтар','Тауарлар','Біз туралы'],
    login: 'Кіру',
    register: 'Тіркелу',
    heroBadge: 'ҰБТ 2025 дайындығы',
    heroTitle: 'ҰБТ-ны 140+ балмен тапсыр',
    heroSub: 'Мыңдаған нақты тест сұрақтары, үздік мұғалімдердің бейнесабақтары және прогрессті бақылау. Өз қарқыныңда дайындал.',
    heroCta: 'Тегін бастау',
    heroSub2: 'Карта жоқ. Мәңгілік тегін.',
    statLabels: ['Тест сұрағы','Оқушы','ҰБТ-ны сәтті тапсырды'],
    aboutLabel: 'ПЛАТФОРМА ТУРАЛЫ',
    aboutTitle: 'Мақсаттарыңа жол ашыңыз — бүгін бастаңыз!',
    aboutSub: 'Біздің онлайн платформа кез келген уақытта және кез келген жерде ҰБТ-ға дайындалу мүмкіндігін береді. Қай жерде болсаңыз да, білімге қол жетімділік әрқашан сізбен.',
    feats: [
      {icon:'📱', t:'Кез келген жерде', d:'Телефон, планшет немесе компьютерден кіре аласың.'},
      {icon:'⚡', t:'Нәтижені бірден көр', d:'Квиз өткеннен кейін бірден нәтиже мен қате талдауын аласың.'},
      {icon:'🎯', t:'Нақты ҰБТ форматы', d:'Барлық сұрақтар нақты емтихан форматында.'},
    ],
    coursesLabel: 'КВИЗДЕР МЕН КУРСТАР',
    coursesTitle: 'Пәнді таңдаңыз және бірден бастаңыз!',
    warnText: 'Тіркелгеннен кейін барлық тегін квиздерге қол жетімді болады.',
    tabs: ['Барлығы','ҰБТ','Видео','Кітаптар'],
    stepsLabel: 'ҚАЛАЙ ЖҰМЫС ІСТЕЙДІ',
    stepsTitle: '3 қадамда жоғары балл',
    steps: [
      {t:'Тіркелу', d:'30 секундта аккаунт жасаңыз. Тек email мен пароль керек.'},
      {t:'Пән таңдау', d:'Қажетті пәнді ашыңыз және тесттерді өз қарқыныңда орындаңыз.'},
      {t:'Прогрессті бақыла', d:'Нәтижелеріңді, әлсіз тақырыптарыңды және өсуіңді бақылайсың.'},
    ],
    reviewsLabel: 'ПІКІРЛЕР',
    reviewsTitle: 'Біздің платформа туралы пікірлер',
    reviews: [
      {name:'Айгерім С. — ҰБТ 138 балл', sub:'«Бұл платформа арқылы 3 ай дайындалдым»', bg:'linear-gradient(135deg,#1a1a2e,#2563EB)'},
      {name:'Дамир А. — ҰБТ 131 балл', sub:'«Грантқа ие болдым, рахмет QazTestPrep!»', bg:'linear-gradient(135deg,#064e3b,#16A34A)'},
      {name:'Зарина М. — ҰБТ 125 балл', sub:'«Телефоннан оқу өте ыңғайлы болды»', bg:'linear-gradient(135deg,#4c1d95,#7C3AED)'},
      {name:'Нұрай Б. — ҰБТ 118 балл', sub:'«Қате талдауы өте пайдалы!»', bg:'linear-gradient(135deg,#78350f,#D97706)'},
    ],
    contactTitle: 'Байланыс',
    contactSub: 'Сұрақтарыңыз бар ма? Бізбен хабарласыңыз — жауап беруге дайынбыз.',
    namePh: 'Аты-жөніңіз',
    msgPh: 'Сұрағыңыз...',
    send: 'Жіберу',
    ftDesc: 'ҰБТ емтиханына дайындалуға арналған №1 онлайн платформа.',
    ftCol: 'ПЛАТФОРМА',
    ftLinks: ['Басты бет','Квиздер','Бейнесабақтар','Тауарлар'],
    ftRights: 'Барлық құқықтар қорғалған.',
    ftCity: 'Қазақстан, Алматы',
  },
  ru: {
    langLabel: 'Язык:',
    navLinks: ['Главная','Квизы','Видеоуроки','Товары','О нас'],
    login: 'Войти',
    register: 'Регистрация',
    heroBadge: 'Подготовка к ЕНТ 2025',
    heroTitle: 'Сдай ЕНТ на 140+ баллов',
    heroSub: 'Тысячи реальных тестовых вопросов, видеоуроки от лучших учителей и умная аналитика прогресса. Готовься эффективно — в своём темпе.',
    heroCta: 'Начать бесплатно',
    heroSub2: 'Без карты. Бесплатно навсегда.',
    statLabels: ['Тестовых вопросов','Учеников','Сдали ЕНТ успешно'],
    aboutLabel: 'О ПЛАТФОРМЕ',
    aboutTitle: 'Откройте путь к своим целям — начните сегодня!',
    aboutSub: 'Наша онлайн платформа даёт возможность готовиться к ЕНТ в любое время и в любом месте. Где бы вы ни находились, знания всегда с вами.',
    feats: [
      {icon:'📱', t:'Везде и всегда', d:'Заходи с телефона, планшета или компьютера.'},
      {icon:'⚡', t:'Результат сразу', d:'После квиза сразу получаешь результат и разбор ошибок.'},
      {icon:'🎯', t:'Реальный формат ЕНТ', d:'Все вопросы в формате реального экзамена.'},
    ],
    coursesLabel: 'КВИЗЫ И КУРСЫ',
    coursesTitle: 'Выберите предмет и начинайте прямо сейчас!',
    warnText: 'После регистрации открывается доступ ко всем бесплатным квизам.',
    tabs: ['Все','ЕНТ','Видео','Книги'],
    stepsLabel: 'КАК ЭТО РАБОТАЕТ',
    stepsTitle: 'Высокий балл за 3 шага',
    steps: [
      {t:'Зарегистрируйся', d:'Создай аккаунт за 30 секунд. Нужны только email и пароль.'},
      {t:'Выбери предмет', d:'Открой нужный предмет и начни решать тесты в своём темпе.'},
      {t:'Следи за прогрессом', d:'Видишь свои результаты, слабые темы и динамику роста.'},
    ],
    reviewsLabel: 'ОТЗЫВЫ',
    reviewsTitle: 'Отзывы о нашей платформе',
    reviews: [
      {name:'Айгерим С. — ЕНТ 138 баллов', sub:'«Готовилась через эту платформу 3 месяца»', bg:'linear-gradient(135deg,#1a1a2e,#2563EB)'},
      {name:'Дамир А. — ЕНТ 131 балл', sub:'«Получил грант, спасибо QazTestPrep!»', bg:'linear-gradient(135deg,#064e3b,#16A34A)'},
      {name:'Зарина М. — ЕНТ 125 баллов', sub:'«Учиться с телефона было очень удобно»', bg:'linear-gradient(135deg,#4c1d95,#7C3AED)'},
      {name:'Нурай Б. — ЕНТ 118 баллов', sub:'«Разбор ошибок очень полезен!»', bg:'linear-gradient(135deg,#78350f,#D97706)'},
    ],
    contactTitle: 'Контакты',
    contactSub: 'Есть вопросы? Свяжитесь с нами — мы готовы ответить.',
    namePh: 'Ваше имя',
    msgPh: 'Ваш вопрос...',
    send: 'Отправить',
    ftDesc: '№1 онлайн платформа для подготовки к ЕНТ.',
    ftCol: 'ПЛАТФОРМА',
    ftLinks: ['Главная','Квизы','Видеоуроки','Товары'],
    ftRights: 'Все права защищены.',
    ftCity: 'Казахстан, Алматы',
  },
}

const stats = [
  { value: '50 000+' },
  { value: '10 000+' },
  { value: '94%' },
]

const courses = [
  { emoji:'📐', tag:'ЕНТ', tagColor:'#2563EB', bg:'linear-gradient(135deg,#1E3A8A,#2563EB)',
    typeKz:'МАТЕМАТИКА', typeRu:'МАТЕМАТИКА', nameKz:'Алгебра + Геометрия', nameRu:'Алгебра + Геометрия', price:'3 500' },
  { emoji:'📜', tag:'ЕНТ', tagColor:'#16A34A', bg:'linear-gradient(135deg,#064e3b,#16A34A)',
    typeKz:'ТАРИХ', typeRu:'ИСТОРИЯ', nameKz:'Қазақстан тарихы — толық курс', nameRu:'История Казахстана — полный курс', price:'3 500' },
  { emoji:'⭐', tag:'PREMIUM', tagColor:'#7C3AED', bg:'linear-gradient(135deg,#4c1d95,#7C3AED)',
    typeKz:'ТОЛЫҚ ПАКЕТ', typeRu:'ПОЛНЫЙ ПАКЕТ', nameKz:'ҰБТ барлық пәндер', nameRu:'ЕНТ все предметы', price:'12 000' },
]

const navHrefs = ['/', '/quizzes', '/videos', '/shop', '/about']

export default function HomePage() {
  const [lang, setLang] = useState<'kz'|'ru'>('ru')
  const [activeTab, setActiveTab] = useState(0)
  const T = t[lang]

  const inputStyle = {
    width:'100%', fontFamily:'Inter,sans-serif', fontSize:'14px',
    padding:'11px 14px', border:'1.5px solid #E2E8F0', borderRadius:'9px',
    background:'#F8FAFC', color:'#0F172A', outline:'none',
  }

  return (
    <div style={{fontFamily:'Inter,sans-serif', background:'#fff', color:'#0F172A', lineHeight:1.6, overflowX:'hidden'}}>

      {/* LANG BANNER */}
      <div style={{background:'#1E3A8A', padding:'7px 24px', display:'flex', alignItems:'center', justifyContent:'flex-end', gap:'8px'}}>
        <span style={{fontSize:'12px', color:'rgba(255,255,255,.45)', fontWeight:500}}>{T.langLabel}</span>
        <div style={{display:'flex', background:'rgba(255,255,255,.1)', borderRadius:'6px', overflow:'hidden'}}>
          {(['kz','ru'] as const).map(l => (
            <button key={l} onClick={() => setLang(l)} style={{
              fontFamily:'Inter,sans-serif', fontSize:'12px', fontWeight:700,
              padding:'5px 14px', border:'none', cursor:'pointer', letterSpacing:'.5px',
              background: lang===l ? '#2563EB' : 'transparent',
              color: lang===l ? '#fff' : 'rgba(255,255,255,.5)',
              borderRadius: lang===l ? '5px' : '0',
              transition:'all .2s',
            }}>
              {l === 'kz' ? 'ҚАЗ' : 'РУС'}
            </button>
          ))}
        </div>
      </div>

      {/* NAV */}
      <nav style={{position:'sticky', top:0, zIndex:100, background:'rgba(255,255,255,.96)', backdropFilter:'blur(12px)', borderBottom:'1px solid #E2E8F0', height:'68px', padding:'0 24px'}}>
        <div style={{maxWidth:'1200px', margin:'0 auto', height:'100%', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
          <Link href="/" style={{display:'flex', alignItems:'center', gap:'10px', textDecoration:'none'}}>
            <div style={{width:'38px', height:'38px', background:'#2563EB', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px', fontWeight:900, color:'#fff', fontStyle:'italic'}}>Q</div>
            <span style={{fontSize:'18px', fontWeight:800, color:'#0F172A'}}>Qaz<span style={{color:'#2563EB'}}>TestPrep</span></span>
          </Link>

          <ul style={{display:'flex', alignItems:'center', gap:'4px', listStyle:'none', margin:0, padding:0}}>
            {T.navLinks.map((label, i) => (
              <li key={i}>
                <Link href={navHrefs[i]} style={{
                  fontSize:'14px', fontWeight:500, color: i===0 ? '#fff' : '#475569',
                  textDecoration:'none', padding:'8px 14px', borderRadius:'8px',
                  background: i===0 ? '#2563EB' : 'transparent', transition:'all .2s',
                }}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
            <Link href="/auth/login" style={{
              fontFamily:'Inter,sans-serif', fontSize:'14px', fontWeight:600,
              padding:'9px 20px', border:'1.5px solid #E2E8F0', borderRadius:'8px',
              background:'#fff', color:'#475569', textDecoration:'none', transition:'all .2s',
            }}>
              {T.login}
            </Link>
            <Link href="/auth/register" style={{
              fontFamily:'Inter,sans-serif', fontSize:'14px', fontWeight:600,
              padding:'9px 20px', border:'none', borderRadius:'8px',
              background:'#2563EB', color:'#fff', textDecoration:'none', transition:'background .2s',
            }}>
              {T.register}
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div style={{background:'#fff', padding:'56px 24px 72px', borderBottom:'1px solid #E2E8F0'}}>
        <div style={{maxWidth:'1100px', margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'48px', alignItems:'center'}}>
          <div>
            <div style={{display:'inline-flex', alignItems:'center', gap:'8px', background:'#EEF3FF', color:'#2563EB', fontSize:'12px', fontWeight:700, padding:'6px 14px', borderRadius:'50px', marginBottom:'20px', border:'1px solid #BFCFFF'}}>
              <span style={{width:'6px', height:'6px', background:'#2563EB', borderRadius:'50%', display:'inline-block'}}/>
              {T.heroBadge}
            </div>
            <h1 style={{fontSize:'38px', fontWeight:900, color:'#0F172A', lineHeight:1.2, marginBottom:'20px'}}>
              {T.heroTitle}
            </h1>
            <p style={{fontSize:'15px', color:'#475569', lineHeight:1.85, maxWidth:'480px', marginBottom:'36px', fontFamily:'Courier New,monospace'}}>
              {T.heroSub}
            </p>
            <div style={{display:'flex', alignItems:'center', gap:'16px'}}>
              <Link href="/auth/register" style={{
                fontFamily:'Inter,sans-serif', fontSize:'16px', fontWeight:700,
                padding:'16px 36px', border:'none', borderRadius:'50px',
                background:'#2563EB', color:'#fff', cursor:'pointer', textDecoration:'none',
                display:'inline-flex', alignItems:'center', gap:'10px',
                boxShadow:'0 4px 20px rgba(37,99,235,.35)',
              }}>
                {T.heroCta}
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 9H14M14 9L10 5M14 9L10 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
              <span style={{fontSize:'13px', color:'#94A3B8'}}>{T.heroSub2}</span>
            </div>

            {/* Stats */}
            <div style={{marginTop:'40px', paddingTop:'32px', borderTop:'1px solid #E2E8F0', display:'flex', gap:'40px', flexWrap:'wrap'}}>
              {stats.map((s, i) => (
                <div key={i}>
                  <p style={{fontSize:'26px', fontWeight:900, color:'#0F172A', lineHeight:1}}>{s.value}</p>
                  <p style={{fontSize:'12px', color:'#94A3B8', marginTop:'4px', fontWeight:500}}>{T.statLabels[i]}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero visual */}
          <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
            <div style={{width:'100%', maxWidth:'500px'}}>
              <img src="/hero-student.png" alt="student studying" style={{width:'100%', height:'auto', display:'block'}}/>
            </div>
          </div>
        </div>
      </div>

      {/* ABOUT */}
      <section style={{padding:'80px 24px'}}>
        <div style={{maxWidth:'1200px', margin:'0 auto'}}>
          <div style={{maxWidth:'760px', margin:'0 auto'}}>
            <div style={{fontSize:'11px', fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:'#2563EB', marginBottom:'10px'}}>{T.aboutLabel}</div>
            <h2 style={{fontSize:'36px', fontWeight:800, color:'#0F172A', letterSpacing:'-.5px', lineHeight:1.2, marginBottom:'12px'}}>{T.aboutTitle}</h2>
            <p style={{fontSize:'16px', color:'#475569', lineHeight:1.7, maxWidth:'560px', marginBottom:'28px'}}>{T.aboutSub}</p>
            <div style={{display:'flex', flexDirection:'column', gap:'20px'}}>
              {T.feats.map((f, i) => (
                <div key={i} style={{display:'flex', gap:'16px', alignItems:'flex-start'}}>
                  <div style={{width:'44px', height:'44px', flexShrink:0, borderRadius:'12px', background:'#EEF3FF', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px'}}>{f.icon}</div>
                  <div>
                    <div style={{fontSize:'15px', fontWeight:700, color:'#0F172A', marginBottom:'4px'}}>{f.t}</div>
                    <div style={{fontSize:'14px', color:'#475569', lineHeight:1.6}}>{f.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* COURSES */}
      <section style={{padding:'80px 24px', background:'#F8FAFC'}}>
        <div style={{maxWidth:'1200px', margin:'0 auto'}}>
          <div style={{marginBottom:'48px'}}>
            <div style={{fontSize:'11px', fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:'#2563EB', marginBottom:'10px'}}>{T.coursesLabel}</div>
            <h2 style={{fontSize:'36px', fontWeight:800, color:'#0F172A', letterSpacing:'-.5px', lineHeight:1.2}}>{T.coursesTitle}</h2>
          </div>

          {/* Warn */}
          <div style={{background:'#FFFBEB', border:'1.5px solid #FDE68A', borderRadius:'12px', padding:'14px 18px', display:'flex', gap:'12px', alignItems:'flex-start', fontSize:'14px', color:'#78350F', marginBottom:'12px'}}>
            <span style={{fontSize:'18px', flexShrink:0}}>⚠️</span>
            <div>{T.warnText}</div>
          </div>

          {/* Tabs */}
          <div style={{display:'flex', gap:'6px', marginBottom:'36px', background:'#E2E8F0', padding:'4px', borderRadius:'12px', width:'fit-content'}}>
            {T.tabs.map((tab, i) => (
              <button key={i} onClick={() => setActiveTab(i)} style={{
                fontFamily:'Inter,sans-serif', fontSize:'14px', fontWeight:600,
                padding:'10px 24px', borderRadius:'9px', border:'none', cursor:'pointer',
                background: activeTab===i ? '#fff' : 'transparent',
                color: activeTab===i ? '#2563EB' : '#475569',
                boxShadow: activeTab===i ? '0 2px 8px rgba(0,0,0,.06)' : 'none',
                transition:'all .2s',
              }}>
                {tab}
              </button>
            ))}
          </div>

          {/* Cards */}
          <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'20px'}}>
            {courses.map((c, i) => (
              <div key={i} style={{background:'#fff', borderRadius:'16px', overflow:'hidden', border:'1px solid #E2E8F0', transition:'all .2s', cursor:'pointer'}}>
                <div style={{aspectRatio:'16/9', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden', fontSize:'44px', background:c.bg}}>
                  {c.emoji}
                  <span style={{position:'absolute', top:'12px', right:'12px', background:'#fff', fontSize:'12px', fontWeight:700, padding:'4px 10px', borderRadius:'6px', color:c.tagColor}}>{c.tag}</span>
                </div>
                <div style={{padding:'18px 20px'}}>
                  <div style={{fontSize:'11px', fontWeight:700, textTransform:'uppercase', letterSpacing:'.5px', color:c.tagColor, marginBottom:'6px'}}>
                    {lang==='kz' ? c.typeKz : c.typeRu}
                  </div>
                  <div style={{fontSize:'16px', fontWeight:700, color:'#0F172A', marginBottom:'8px', lineHeight:1.3}}>
                    {lang==='kz' ? c.nameKz : c.nameRu}
                  </div>
                  <div style={{fontSize:'13px', color:'#94A3B8'}}>
                    📖 {lang==='kz' ? '2 ай қол жетімді' : '2 месяца доступа'}
                  </div>
                </div>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 20px', borderTop:'1px solid #E2E8F0', background:'#F8FAFC'}}>
                  <div style={{fontSize:'20px', fontWeight:800, color:'#0F172A'}}>
                    {c.price} <span style={{fontSize:'13px', fontWeight:500, color:'#94A3B8'}}>тг</span>
                  </div>
                  <Link href="/auth/register" style={{
                    fontFamily:'Inter,sans-serif', fontSize:'13px', fontWeight:700,
                    padding:'9px 18px', border:'none', borderRadius:'8px',
                    background:'#2563EB', color:'#fff', cursor:'pointer', textDecoration:'none',
                    transition:'background .2s',
                  }}>
                    {lang==='kz' ? 'Сатып алу' : 'Купить'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{padding:'80px 24px'}}>
        <div style={{maxWidth:'1200px', margin:'0 auto'}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'48px', flexWrap:'wrap', gap:'20px'}}>
            <div>
              <div style={{fontSize:'11px', fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:'#2563EB', marginBottom:'10px'}}>{T.stepsLabel}</div>
              <h2 style={{fontSize:'36px', fontWeight:800, color:'#0F172A', letterSpacing:'-.5px', lineHeight:1.2}}>{T.stepsTitle}</h2>
            </div>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'24px'}}>
            {T.steps.map((s, i) => (
              <div key={i} style={{background:'#fff', border:'1px solid #E2E8F0', borderRadius:'16px', padding:'28px', position:'relative'}}>
                {i < 2 && <div style={{position:'absolute', top:'42px', right:'-28px', width:'32px', height:'2px', background:'#BFCFFF', zIndex:1}}>
                  <div style={{position:'absolute', right:'-5px', top:'-4px', width:'10px', height:'10px', borderTop:'2px solid #BFCFFF', borderRight:'2px solid #BFCFFF', transform:'rotate(45deg)'}}/>
                </div>}
                <div style={{width:'42px', height:'42px', borderRadius:'12px', background:'#2563EB', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px', fontWeight:800, marginBottom:'18px'}}>
                  {i+1}
                </div>
                <div style={{fontSize:'16px', fontWeight:700, color:'#0F172A', marginBottom:'8px'}}>{s.t}</div>
                <div style={{fontSize:'14px', color:'#475569', lineHeight:1.65}}>{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section style={{padding:'80px 24px', background:'#F8FAFC'}}>
        <div style={{maxWidth:'1200px', margin:'0 auto'}}>
          <div style={{marginBottom:'48px'}}>
            <div style={{fontSize:'11px', fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:'#2563EB', marginBottom:'10px'}}>{T.reviewsLabel}</div>
            <h2 style={{fontSize:'36px', fontWeight:800, color:'#0F172A', letterSpacing:'-.5px', lineHeight:1.2}}>{T.reviewsTitle}</h2>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'20px'}}>
            {T.reviews.map((r, i) => (
              <div key={i} style={{background:'#fff', borderRadius:'16px', overflow:'hidden', border:'1px solid #E2E8F0', cursor:'pointer', transition:'all .2s'}}>
                <div style={{aspectRatio:'16/9', display:'flex', alignItems:'center', justifyContent:'center', background:r.bg}}>
                  <div style={{width:'52px', height:'52px', background:'rgba(255,255,255,.9)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px'}}>▶</div>
                </div>
                <div style={{padding:'14px 16px', fontSize:'14px', fontWeight:600, color:'#0F172A'}}>{r.name}</div>
                <div style={{padding:'0 16px 14px', fontSize:'12px', color:'#94A3B8'}}>{r.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section style={{padding:'80px 24px', background:'#1E3A8A'}}>
        <div style={{maxWidth:'1200px', margin:'0 auto'}}>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'48px', alignItems:'start'}}>
            <div>
              <h2 style={{fontSize:'34px', fontWeight:800, color:'#fff', letterSpacing:'-.5px', marginBottom:'12px'}}>{T.contactTitle}</h2>
              <p style={{fontSize:'15px', color:'rgba(255,255,255,.62)', lineHeight:1.7, marginBottom:'32px'}}>{T.contactSub}</p>
              <div style={{display:'flex', flexDirection:'column', gap:'16px'}}>
                {[
                  {icon:'📞', lbl:'Телефон', val:'+7 705 805 42 72'},
                  {icon:'📸', lbl:'Instagram', val:'@qaztestprep'},
                  {icon:'✈️', lbl:'Telegram', val:'@qaztestprep'},
                  {icon:'▶️', lbl:'YouTube', val:'@qaztestprep'},
                ].map((c, i) => (
                  <div key={i} style={{display:'flex', alignItems:'center', gap:'14px'}}>
                    <div style={{width:'44px', height:'44px', borderRadius:'12px', background:'rgba(255,255,255,.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', flexShrink:0}}>{c.icon}</div>
                    <div>
                      <div style={{fontSize:'12px', color:'rgba(255,255,255,.48)', fontWeight:500, marginBottom:'2px'}}>{c.lbl}</div>
                      <div style={{fontSize:'15px', fontWeight:600, color:'#fff'}}>{c.val}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{background:'#fff', borderRadius:'20px', padding:'32px'}}>
              <h3 style={{fontSize:'18px', fontWeight:700, color:'#0F172A', marginBottom:'20px'}}>
                {lang==='kz' ? 'Хабарлама жіберу' : 'Отправить сообщение'}
              </h3>
              <div style={{marginBottom:'14px'}}>
                <label style={{fontSize:'13px', fontWeight:600, color:'#475569', display:'block', marginBottom:'6px'}}>
                  {lang==='kz' ? 'Атыңыз' : 'Ваше имя'}
                </label>
                <input type="text" placeholder={T.namePh} style={inputStyle}/>
              </div>
              <div style={{marginBottom:'14px'}}>
                <label style={{fontSize:'13px', fontWeight:600, color:'#475569', display:'block', marginBottom:'6px'}}>
                  {lang==='kz' ? 'Телефон' : 'Телефон'}
                </label>
                <input type="tel" placeholder="+7 7XX XXX XX XX" style={inputStyle}/>
              </div>
              <div style={{marginBottom:'14px'}}>
                <label style={{fontSize:'13px', fontWeight:600, color:'#475569', display:'block', marginBottom:'6px'}}>
                  {lang==='kz' ? 'Хабарлама' : 'Сообщение'}
                </label>
                <textarea placeholder={T.msgPh} style={{...inputStyle, resize:'vertical', minHeight:'100px'}}/>
              </div>
              <button style={{
                width:'100%', fontFamily:'Inter,sans-serif', fontSize:'15px', fontWeight:700,
                padding:'13px', border:'none', borderRadius:'10px',
                background:'#2563EB', color:'#fff', cursor:'pointer', marginTop:'4px',
              }}>
                {T.send}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{background:'#0F172A', padding:'40px 24px 24px'}}>
        <div style={{maxWidth:'1200px', margin:'0 auto'}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'32px', flexWrap:'wrap', marginBottom:'32px'}}>
            <div style={{maxWidth:'280px'}}>
              <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'12px'}}>
                <div style={{width:'34px', height:'34px', background:'#2563EB', borderRadius:'9px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px', fontWeight:900, color:'#fff', fontStyle:'italic'}}>Q</div>
                <span style={{fontSize:'16px', fontWeight:800, color:'#fff'}}>Qaz<span style={{color:'#60A5FA'}}>TestPrep</span></span>
              </div>
              <p style={{fontSize:'13px', color:'rgba(255,255,255,.42)', lineHeight:1.6}}>{T.ftDesc}</p>
            </div>
            <div>
              <h4 style={{fontSize:'13px', fontWeight:700, color:'#fff', textTransform:'uppercase', letterSpacing:'.5px', marginBottom:'14px'}}>{T.ftCol}</h4>
              {T.ftLinks.map((l, i) => (
                <Link key={i} href={navHrefs[i]} style={{display:'block', fontSize:'14px', color:'rgba(255,255,255,.48)', textDecoration:'none', marginBottom:'8px'}}>
                  {l}
                </Link>
              ))}
            </div>
          </div>
          <div style={{borderTop:'1px solid rgba(255,255,255,.08)', paddingTop:'20px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'12px'}}>
            <div style={{fontSize:'13px', color:'rgba(255,255,255,.32)'}}>
              <strong style={{color:'rgba(255,255,255,.5)'}}>QazTestPrep</strong> · {T.ftCity}
            </div>
            <div style={{fontSize:'13px', color:'rgba(255,255,255,.32)'}}>
              © 2025 QazTestPrep. {T.ftRights}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
