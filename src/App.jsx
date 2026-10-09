import { Fragment, useEffect, useRef, useState } from 'react';
import { projects, jobs, stack, wins, certs, education, roles } from './data.js';

const GH = 'shivsaxena2005';
const NAV = [
  ['work', 'Work'],
  ['stack', 'Tools'],
  ['path', 'Experience'],
  ['edu', 'Education'],
  ['certs', 'Certificates'],
  ['contact', 'Contact'],
];

/* Local time in Jodhpur, refreshed while the page is open */
function useJodhpurTime() {
  const get = () => new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: '2-digit', hour12: true });
  const [t, setT] = useState(get);
  useEffect(() => {
    const id = setInterval(() => setT(get()), 15000);
    return () => clearInterval(id);
  }, []);
  return t;
}

/* Highlights the nav link of the section currently on screen */
function useActiveSection(ids) {
  const [active, setActive] = useState('');
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-40% 0px -55% 0px' }
    );
    ids.forEach((id) => { const el = document.getElementById(id); el && io.observe(el); });
    return () => io.disconnect();
  }, []);
  return active;
}

/* Page scroll progress, exposed as --p (0 to 1) for the top bar */
function useScrollProgress() {
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - innerHeight;
      document.documentElement.style.setProperty('--p', max > 0 ? Math.min(1, scrollY / max) : 0);
    };
    const onScroll = () => { raf ||= requestAnimationFrame(update); };
    update();
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    return () => { removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll); cancelAnimationFrame(raf); };
  }, []);
}

/* Cycles through the role words from data.js */
function useRotate(list, ms = 2400) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setI((n) => (n + 1) % list.length), ms);
    return () => clearInterval(id);
  }, [list.length, ms]);
  return list[i];
}

/* The name: every letter widens and thickens as the pointer gets close (Archivo is a variable font) */
function Name() {
  const ref = useRef(null);
  useEffect(() => {
    const root = ref.current;
    if (!root || matchMedia('(pointer: coarse), (prefers-reduced-motion: reduce)').matches) return;
    const letters = [...root.querySelectorAll('.ch')];
    const REACH = 320;
    let px = -9999, py = -9999, raf = 0;
    const paint = () => {
      raf = 0;
      const prox = letters.map((el) => {
        const r = el.getBoundingClientRect();
        return Math.max(0, 1 - Math.hypot(px - (r.left + r.width / 2), py - (r.top + r.height / 2)) / REACH);
      });
      letters.forEach((el, i) => { el.style.fontVariationSettings = `"wdth" ${82 + prox[i] * 43}, "wght" ${700 + prox[i] * 200}`; });
    };
    const queue = () => { raf ||= requestAnimationFrame(paint); };
    const move = (e) => { px = e.clientX; py = e.clientY; queue(); };
    const leave = () => { px = py = -9999; queue(); };
    window.addEventListener('pointermove', move);
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', leave);
      cancelAnimationFrame(raf);
    };
  }, []);

  const word = (w, offset) => (
    <span className="line" aria-hidden="true">
      {[...w].map((c, i) => <span key={i} className="ch" style={{ '--i': offset + i }}>{c}</span>)}
    </span>
  );
  return <h1 ref={ref} aria-label="Shiv Saxena">{word('Shiv', 0)}{word('Saxena', 4)}</h1>;
}

/* A section that slides in the first time it scrolls into view */
function Section({ id, title, tone = 'paper', children }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { rootMargin: '0px 0px -12% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <section id={id} ref={ref} className={`sec ${tone} ${seen ? 'in' : ''}`}>
      <h2>{title}</h2>
      <div className="sec-body">{children}</div>
    </section>
  );
}

function Projects() {
  const [f, setF] = useState('All');
  const [open, setOpen] = useState(null);
  const list = projects.filter((p) => f === 'All' || p.tag === f);
  return (
    <>
      <div className="filters" role="group" aria-label="Filter projects">
        {['All', 'AI / ML', 'Web'].map((t) => (
          <button key={t} className={f === t ? 'on' : ''} aria-pressed={f === t} onClick={() => { setF(t); setOpen(null); }}>{t}</button>
        ))}
      </div>
      <div className="projects">
        {list.map((p) => {
          const isOpen = open === p.title;
          return (
            <article key={p.title} className={`proj ${isOpen ? 'open' : ''}`}>
              <button className="head" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : p.title)}>
                <span className="n">{p.n}</span>
                <h3>{p.title}</h3>
                <span className="meta">{p.tag}, {p.year}</span>
                <span className="plus" aria-hidden="true" />
              </button>
              <div className="body"><div>
                <p className="desc">{p.desc}</p>
                <h4>How it works</h4>
                <p className="theory">{p.theory}</p>
                <p className="built"><b>Built with</b> {p.stack.join(', ')}</p>
                <a className="src" href={p.link} target="_blank" rel="noreferrer">View source on GitHub</a>
              </div></div>
            </article>
          );
        })}
      </div>
    </>
  );
}

function Stack() {
  return (
    <dl className="stack">
      {Object.entries(stack).map(([group, items]) => (
        <div className="grp" key={group}>
          <dt>{group}</dt>
          <dd>{items.map((x, i) => (
            <Fragment key={x}><span>{x}</span>{i < items.length - 1 ? ', ' : ''}</Fragment>
          ))}</dd>
        </div>
      ))}
    </dl>
  );
}

function Experience() {
  return (
    <>
      <div className="jobs">
        {jobs.map((j) => (
          <div className="job" key={j.role}>
            <span className="when">{j.when}</span>
            <h3>{j.role}</h3>
            <p>{j.note}</p>
          </div>
        ))}
      </div>
      <h3 className="sub">Achievements</h3>
      <ul className="wins">{wins.map((w) => <li key={w}>{w}</li>)}</ul>
    </>
  );
}

function Education() {
  return (
    <ol className="edu">
      {education.map((e, i) => (
        <li className="edu-item" key={e.title} style={{ '--k': i }}>
          <span className="yr">{e.when}</span>
          <div className="what">
            <h3>{e.title}</h3>
            <p className="place">{e.place}</p>
            {e.note && <p className="edu-note">{e.note}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}

function Certs() {
  const [view, setView] = useState(null);
  useEffect(() => {
    if (!view) return;
    const esc = (e) => e.key === 'Escape' && setView(null);
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [view]);

  return (
    <>
      <div className="tickets">
        {certs.map((c) => {
          const src = encodeURI(`/certs/${c.file}`);
          const isImg = /\.(png|jpe?g|webp)$/i.test(c.file);
          const inner = (
            <>
              <div className="main">
                <span className="issuer">{c.issuer}{c.year ? `, ${c.year}` : ''}</span>
                <h3>{c.title}</h3>
                <span className="go">{isImg ? 'View certificate' : 'Open PDF'}</span>
              </div>
              <div className="stub"><span>{isImg ? 'Image' : 'PDF'}</span></div>
            </>
          );
          return isImg ? (
            <button key={c.file} className="ticket" onClick={() => setView({ src, title: c.title })}>{inner}</button>
          ) : (
            <a key={c.file} className="ticket" href={src} target="_blank" rel="noreferrer">{inner}</a>
          );
        })}
      </div>
      {view && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={view.title} onClick={() => setView(null)}>
          <img src={view.src} alt={view.title} onClick={(e) => e.stopPropagation()} />
          <button aria-label="Close" onClick={() => setView(null)}>Close</button>
        </div>
      )}
    </>
  );
}

function Repos() {
  const [repos, setRepos] = useState(null);
  useEffect(() => {
    fetch(`https://api.github.com/users/${GH}/repos?sort=updated&per_page=6`)
      .then((r) => r.json()).then((d) => setRepos(Array.isArray(d) ? d.filter((_, i) => i === 2 || i === 5) : [])).catch(() => setRepos([]));
  }, []);
  if (!repos) return <p className="note">Loading repositories from GitHub.</p>;
  if (!repos.length) return <p className="note">GitHub didn't respond. Try again in a minute, or open github.com/{GH}.</p>;
  return (
    <div className="repos">
      {repos.map((r) => (
        <a key={r.id} className="repo" href={r.html_url} target="_blank" rel="noreferrer">
          <b>{r.name}</b>
          <span>{r.language || 'Mixed'}, updated {new Date(r.pushed_at).toLocaleDateString('en', { month: 'short', year: 'numeric' })}</span>
        </a>
      ))}
    </div>
  );
}

function Contact() {
  const [s, setS] = useState('idle');
  const send = async (e) => {
    e.preventDefault();
    setS('sending');
    const data = Object.fromEntries(new FormData(e.target));
    try {
      const r = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!r.ok) throw 0;
      setS('ok'); e.target.reset();
    } catch { setS('err'); }
  };
  return (
    <>
      <p className="big">Got a project, an internship or a question? Write to me and I'll reply by email.</p>
      <form onSubmit={send} className="form">
        <input name="name" placeholder="Your name" aria-label="Your name" required />
        <input name="email" type="email" placeholder="Your email" aria-label="Your email" required />
        <textarea name="message" rows="4" placeholder="What are you building?" aria-label="Message" required />
        <button disabled={s === 'sending'}>{s === 'sending' ? 'Sending' : 'Send message'}</button>
        {s === 'ok' && <p className="msg" role="status">Message sent. I'll reply by email.</p>}
        {s === 'err' && <p className="msg" role="alert">The message didn't send. Email me at shivsaxena2878@gmail.com instead.</p>}
      </form>
      <ul className="links">
        <li><a href="mailto:shivsaxena2878@gmail.com">Email</a></li>
        <li><a href="https://linkedin.com/in/shiv-saxena48b817309" target="_blank" rel="noreferrer">LinkedIn</a></li>
        <li><a href={`https://github.com/${GH}`} target="_blank" rel="noreferrer">GitHub</a></li>
        <li><a href="https://leetcode.com/u/shivsaxena2878/" target="_blank" rel="noreferrer">LeetCode</a></li>
        <li><a href="https://www.hackerrank.com/profile/Shivsaxena2878" target="_blank" rel="noreferrer">HackerRank</a></li>
      </ul>
    </>
  );
}

const TICKER = ['AI / ML', 'React', 'Node.js', 'FastAPI', 'TensorFlow', 'Flask', 'GATE DA 2026', 'Jodhpur'];
const fine = () => !matchMedia('(pointer: coarse), (prefers-reduced-motion: reduce)').matches;

/* Pointer effects: hero glow, photo tilt, buttons that lean toward the cursor */
function usePointerFX() {
  useEffect(() => {
    if (!fine()) return;
    const root = document.documentElement;
    const arch = document.querySelector('.arch');
    const magnets = [...document.querySelectorAll('.btn, .theme')];
    const move = (e) => {
      root.style.setProperty('--mx', `${e.clientX}px`);
      root.style.setProperty('--my', `${e.clientY}px`);
      if (arch) {
        const r = arch.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        arch.style.transform = Math.abs(x) < 1 && Math.abs(y) < 1 ? `perspective(700px) rotateY(${x * 16}deg) rotateX(${-y * 16}deg)` : '';
      }
      magnets.forEach((el) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        el.style.translate = Math.hypot(dx, dy) < 110 ? `${dx * .25}px ${dy * .25}px` : '';
      });
    };
    addEventListener('pointermove', move);
    return () => removeEventListener('pointermove', move);
  }, []);
}

/* Ring that eases after the pointer and swells over links and buttons */
function Cursor() {
  const ref = useRef(null);
  useEffect(() => {
    if (!fine()) return;
    const el = ref.current;
    let x = 0, y = 0, tx = 0, ty = 0, raf = 0;
    const move = (e) => {
      tx = e.clientX; ty = e.clientY;
      el.classList.add('on');
      el.classList.toggle('hot', !!e.target.closest?.('a, button, input, textarea'));
    };
    const loop = () => { x += (tx - x) * .2; y += (ty - y) * .2; el.style.transform = `translate(${x}px, ${y}px)`; raf = requestAnimationFrame(loop); };
    addEventListener('pointermove', move);
    document.documentElement.addEventListener('pointerleave', () => el.classList.remove('on'));
    loop();
    return () => { removeEventListener('pointermove', move); cancelAnimationFrame(raf); };
  }, []);
  return <div ref={ref} className="ring" aria-hidden="true" />;
}

/* Ticker strip that leans with scroll speed */
function Marquee() {
  const ref = useRef(null);
  useEffect(() => {
    if (!fine()) return;
    let last = scrollY, sk = 0, raf = 0;
    const tick = () => {
      const d = scrollY - last; last = scrollY;
      sk += (Math.max(-6, Math.min(6, d * -.25)) - sk) * .12;
      ref.current?.style.setProperty('--sk', `${sk.toFixed(2)}deg`);
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div className="marquee" ref={ref} aria-hidden="true">
      <div className="track">
        {[...TICKER, ...TICKER, ...TICKER, ...TICKER].map((t, i) => <span key={i}>{t}<b>✦</b></span>)}
      </div>
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const time = useJodhpurTime();
  const active = useActiveSection(NAV.map(([id]) => id));
  const role = useRotate(roles);
  useScrollProgress();
  usePointerFX();
  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem('theme', theme); }, [theme]);

  return (
    <>
      <div className="progress" aria-hidden="true" />
      <Cursor />
      <nav className="top">
        <a href="#top" className="logo">Shiv Saxena</a>
        <div className="nav-links">
          {NAV.map(([id, label]) => <a key={id} href={`#${id}`} aria-current={active === id ? 'true' : undefined}>{label}</a>)}
          <button className="theme" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
            {theme === 'light' ? 'Dark mode' : 'Light mode'}
          </button>
        </div>
      </nav>

      <header id="top" className="hero">
        <div className="hero-main">
          <div className="hero-copy">
            <p className="status"><i aria-hidden="true" />Open to work. Based in Jodhpur, where it's <b>{time}</b>.</p>
            <Name />
            <p className="role">Currently a <span key={role}>{role}</span></p>
            <p className="lede">Final-year B.Tech student (AI &amp; ML) interning at SpanIdea Systems. I train models, but lately I'm happiest shipping React interfaces and Node backends around them.</p>
            <div className="actions">
              <a className="btn solid" href="/Resume.pdf" target="_blank" rel="noreferrer">Download résumé</a>
              <a className="btn" href="mailto:shivsaxena2878@gmail.com">Email me</a>
            </div>
          </div>
          <figure className="arch">
            <img src="/image.jpeg" alt="Shiv Saxena" />
            <figcaption lang="hi">शिव सक्सेना</figcaption>
            <span className="hand" aria-hidden="true">yep, that's me</span>
          </figure>
        </div>
      </header>

      <Marquee />

      <main>
        <Section id="work" title="Work"><Projects /></Section>
        <Section id="stack" title="Tools" tone="soft"><Stack /></Section>
        <Section id="path" title="Experience"><Experience /></Section>
        <Section id="edu" title="Education" tone="soft"><Education /></Section>
        <Section id="certs" title="Certificates" tone="wall"><Certs /></Section>
        <Section id="code" title="Recent code"><Repos /></Section>
        <Section id="contact" title="Get in touch" tone="wall"><Contact /></Section>
      </main>

      <footer className="foot">
        <span>Shiv Saxena, Jodhpur. {new Date().getFullYear()}</span>
        <a href="#top">Back to top</a>
      </footer>
    </>
  );
}
