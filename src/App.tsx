import { useEffect, useMemo, useRef, useState } from 'react'
import { Camera, Check, ChevronLeft, Clock3, Headphones, MapPin, Menu, Phone, ShieldCheck, Sparkles, Star, Volume2, VolumeX, X, Zap } from 'lucide-react'
import { cases, categories, places } from './data/cases'

const sfx = { chime: '/audio/chime.mp3', notification: '/audio/notification.mp3', click: '/audio/click-soft.mp3', whoosh: '/audio/whoosh-short.mp3' }
const chatter = ['נועה: קיבלנו דיווח נעים מהגן.', 'אורי: אני נשאר עם המבוגר ליד השביל.', 'המוקד: תודה על הקשבה ועזרה בטוחה.', 'נועה: המצלמה מסתובבת — הכול רגוע.']

function App() {
  const [active, setActive] = useState(0), [score, setScore] = useState(0), [streak, setStreak] = useState(0), [answered, setAnswered] = useState<number | null>(null)
  const [filter, setFilter] = useState('הכול'), [menu, setMenu] = useState(false), [sound, setSound] = useState(true)
  const [seconds, setSeconds] = useState(45), [camera, setCamera] = useState(0), [queueOffset, setQueueOffset] = useState(0), [urgent, setUrgent] = useState(false), [message, setMessage] = useState(chatter[0])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const filtered = useMemo(() => filter === 'הכול' ? cases : cases.filter(c => c.category === filter), [filter])
  const current = filtered[active % filtered.length]

  const play = (name: keyof typeof sfx) => {
    if (!sound) return
    audioRef.current?.pause()
    const audio = new Audio(sfx[name])
    audio.volume = name === 'notification' ? .34 : .22
    audioRef.current = audio
    void audio.play().catch(() => undefined)
  }
  useEffect(() => {
    const timer = window.setInterval(() => setSeconds(value => value <= 1 ? 45 : value - 1), 1000)
    const rotate = window.setInterval(() => setCamera(value => (value + 1) % places.length), 5000)
    const queue = window.setInterval(() => { setQueueOffset(value => value + 1); play('notification') }, 9000)
    const event = window.setInterval(() => { setUrgent(true); play('chime') }, 22000)
    const radio = window.setInterval(() => setMessage(value => chatter[(chatter.indexOf(value) + 1) % chatter.length]), 7000)
    return () => { window.clearInterval(timer); window.clearInterval(rotate); window.clearInterval(queue); window.clearInterval(event); window.clearInterval(radio) }
  }, [sound])
  const choose = (correct: boolean) => {
    if (answered !== null) return
    setAnswered(correct ? 1 : 0)
    setScore(value => value + (correct ? 100 + streak * 10 : 20))
    setStreak(value => correct ? value + 1 : 0)
    play(correct ? 'chime' : 'click')
  }
  const next = () => { setAnswered(null); setSeconds(45); setActive(value => value + 1); setUrgent(false); play('whoosh') }
  const select = (index: number) => { setActive(index); setAnswered(null); setSeconds(45); setUrgent(false); play('click') }
  return <div className="app">
    <a className="skip-link" href="#main-content">דלגו לתוכן הראשי</a>
    <header className="topbar"><div className="brand"><span className="brand-mark"><ShieldCheck size={25} aria-hidden="true" /></span><div><strong>גיבורי המוקד</strong><small>מרכז המשימות של השכונה</small></div></div><div className="top-actions"><div className="live"><span /> המוקד פעיל</div><button className="icon-btn" aria-label="פתיחת תפריט" aria-expanded={menu} onClick={() => setMenu(!menu)}><Menu aria-hidden="true" /></button><button className="sound-btn" aria-label={sound ? 'כיבוי צלילים' : 'הפעלת צלילים'} onClick={() => setSound(value => !value)}>{sound ? <Volume2 aria-hidden="true" /> : <VolumeX aria-hidden="true" />}</button><div className="avatar" aria-label="הפרופיל של נועה">נ</div></div></header>
    {menu && <div className="mobile-menu"><b>שלום, נועה 👋</b><span>היום במשמרת: 12 משימות</span><span>צלילים: {sound ? 'פעילים' : 'כבויים'}</span></div>}
    <div className="radio-chatter" role="status" aria-live="polite"><Volume2 size={14} aria-hidden="true" /> {message}</div>
    <main id="main-content">
      <section className="hero"><div><p className="eyebrow"><Sparkles size={15} aria-hidden="true" /> משמרת חדשה מחכה לך</p><h1>עיניים חדות.<br /><em>לב גדול.</em></h1><p className="intro">עוזרים לשכונה הדמיונית שלנו, משימה אחת בכל פעם. מקשיבים, בוחרים נכון ולומדים לשמור על כולם.</p><div className="hero-meta"><span><Star size={16} fill="currentColor" aria-hidden="true" /> {score.toLocaleString()} נקודות</span><span><span className="streak-dot" /> רצף {streak}{streak > 1 && <b className="combo">קומבו!</b>}</span><span><Clock3 size={16} aria-hidden="true" /> זמן משחק רגוע</span></div></div><div className="hero-art"><img src="/media/neighborhood.svg" alt="איור מקורי של שכונה ידידותית" /><div className="hero-card"><span>משימה #{String(current.id).padStart(2, '0')}</span><b>הגיע דיווח חדש</b><small>{current.location} · {current.time}</small></div></div></section>
      <div className="section-heading"><div><p className="eyebrow">לוח המוקד</p><h2>מה קורה בשכונה?</h2></div><button className="outline-btn" onClick={() => setMessage('הסבר: מקשיבים, עוצרים, ופונים למבוגר שסומכים עליו.')}><Headphones size={17} aria-hidden="true" /> הסבר קולי</button></div>
      <section className="dashboard-grid">
        <article className="panel calls"><div className="panel-head"><div><span className="live-label"><span /> נכנס עכשיו</span><h3>תור דיווחים</h3></div><span className="count" aria-label={`${cases.length} דיווחים`}>{cases.length}</span></div><div className="call-list">{cases.slice(0, 4).map((c, i) => <button className={`call-row ${i === queueOffset % 4 ? 'selected' : ''}`} key={c.id} onClick={() => select(i)}><span className="call-icon" style={{ background: c.color }}><Phone size={16} aria-hidden="true" /></span><span><b>{c.title}</b><small><MapPin size={12} aria-hidden="true" />{c.location}</small></span><span className="call-time">{i === queueOffset % 4 ? 'עכשיו' : `${i * 3} ד׳`}</span></button>)}</div><button className="text-btn" onClick={() => setMessage('כל הדיווחים בטוחים, דמיוניים ומתאימים ללמידה.')} >לכל הדיווחים <ChevronLeft size={16} aria-hidden="true" /></button></article>
        <article className="panel cameras"><div className="panel-head"><div><span className="live-label"><span /> מצלמות חיות</span><h3>קיר השכונה</h3></div><Camera size={20} aria-hidden="true" /></div><div className="camera-grid">{places.slice(camera, camera + 4).concat(places).slice(0, 4).map((p, i) => <div className="camera-tile" key={`${p}-${i}`}><div className={`cam-scene scene-${i}`}><span className="scanline" /><span className="cam-label"><span /> סריקה · {p}</span><span className="scene-object" aria-hidden="true">{['☀', '🌳', '🚲', '☂'][i]}</span></div></div>)}</div><div className="camera-footer"><span>סריקה מסתובבת אוטומטית</span><button className="text-btn" onClick={() => setCamera(value => (value + 1) % places.length)}>לסיבוב הבא <ChevronLeft size={16} aria-hidden="true" /></button></div></article>
      </section>
      {urgent && <aside className="urgent-event" role="alert"><Zap size={18} aria-hidden="true" /><span><b>אירוע קשב קטן:</b> מישהו מצא צעצוע ליד השביל — נשארים עם מבוגר ומדווחים.</span><button onClick={() => setUrgent(false)} aria-label="סגירת האירוע">×</button></aside>}
      <section className="mission" aria-labelledby="mission-title"><div className="mission-top"><div><p className="eyebrow">החלטה שלך</p><h2 id="mission-title">מה עושים עכשיו?</h2></div><div className={`mission-number ${seconds < 10 ? 'countdown' : ''}`}><span>זמן רגוע</span><b>{seconds} שנ׳</b></div></div><div className="mission-body"><div className="case-illustration" style={{ background: current.color }}><div className="case-sun" /><div className="case-building" /><div className="case-sticker" aria-hidden="true">🔎</div><small>איור המחשה בטוח</small></div><div className="case-content"><div className="case-tags"><span>{current.category}</span><span><MapPin size={13} aria-hidden="true" />{current.location}</span></div><h3>{current.title}</h3><p className="clue">“{current.clue} — מה הבחירה הכי טובה שלך?”</p><div className="choices">{current.choices.map((choice, i) => <button key={choice.label} className={`choice ${answered !== null ? (choice.correct ? 'right' : i === 0 ? 'wrong' : 'muted') : ''}`} onClick={() => choose(choice.correct)} aria-pressed={answered !== null && choice.correct}><span className="choice-key">{['א', 'ב', 'ג'][i]}</span><span>{choice.label}</span>{answered !== null && choice.correct && <Check size={18} aria-hidden="true" />}</button>)}</div>{answered !== null && <div className={`feedback ${answered ? 'success' : 'try'}`} role="status"><span>{answered ? <Check size={17} aria-hidden="true" /> : <X size={17} aria-hidden="true" />}</span><b>{answered ? `בחירה מצוינת! רצף ${streak}` : 'כמעט!'}</b> {current.choices[answered ? 0 : 1].feedback}<button onClick={next}>למשימה הבאה <ChevronLeft size={15} aria-hidden="true" /></button></div>}</div></div><div className="safety"><ShieldCheck size={17} aria-hidden="true" /><span><b>זוכרים:</b> במשחק ובחיים האמיתיים משתפים מבוגר שסומכים עליו. במקרה חירום אמיתי פונים לשירותי החירום.</span></div></section>
      <div className="section-heading filters"><div><p className="eyebrow">ספר המשימות</p><h2>עוד סיפורים מהשכונה</h2></div><div className="filter-tabs" role="group" aria-label="סינון לפי קטגוריה">{['הכול', ...categories].map(f => <button className={filter === f ? 'active' : ''} aria-pressed={filter === f} onClick={() => { setFilter(f); setActive(0) }} key={f}>{f}</button>)}</div></div><div className="case-strip">{filtered.slice(0, 6).map(c => <button className="mini-case" key={c.id} onClick={() => select(filtered.indexOf(c))}><span style={{ background: c.color }} aria-hidden="true">{c.title.slice(0, 1)}</span><b>{c.title}</b><small>{c.location}</small></button>)}</div>
    </main><footer><span>גיבורי המוקד · משחק דמיוני ללמידה ולכיף</span><span>אין כאן תחליף לעזרה אמיתית של מבוגר או שירותי חירום</span></footer>
  </div>
}
export default App
