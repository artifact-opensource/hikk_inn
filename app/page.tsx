import Link from 'next/link';

const roles = [
  {
    href: '/tourist',
    title: 'Tourist',
    desc: 'Plan your trip — stay, meals, live taxi, charter & activities in one session.',
    cta: 'Enter as Traveler',
  },
  {
    href: '/operator',
    title: 'Operator / Admin',
    desc: 'Manage property, rooms, menus, fleet, drivers & live dispatch board.',
    cta: 'Open Console',
  },
  {
    href: '/driver',
    title: 'Driver',
    desc: 'Companion app — availability, nearby requests, earnings.',
    cta: 'Driver App',
  },
];

export default function Home() {
  return (
    <main style={{ maxWidth: 980, margin: '0 auto', padding: '48px 24px' }}>
      <header style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 34, color: 'var(--teal)', margin: 0 }}>HikkInn</h1>
        <p style={{ color: 'var(--muted)', fontSize: 15, maxWidth: 620 }}>
          AI-powered, web-hosted hospitality &amp; travel platform for North Pakistan.
          One app, one session — <strong>stay, eat, move, fly</strong>.
        </p>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
        {roles.map((r) => (
          <Link key={r.href} href={r.href} style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 16,
              padding: 22, height: '100%', transition: 'transform .12s',
            }}>
              <h2 style={{ margin: '0 0 8px', fontSize: 19 }}>{r.title}</h2>
              <p style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.55, minHeight: 56 }}>{r.desc}</p>
              <span style={{
                display: 'inline-block', background: 'var(--teal)', color: '#fff',
                padding: '9px 14px', borderRadius: 10, fontSize: 13, fontWeight: 700,
              }}>{r.cta}</span>
            </div>
          </Link>
        ))}
      </section>

      <footer style={{ marginTop: 40, color: 'var(--muted)', fontSize: 12 }}>
        P0 Foundation · Next.js + Cloudflare Pages · MVP scope: Hunza + Skardu
      </footer>
    </main>
  );
}
