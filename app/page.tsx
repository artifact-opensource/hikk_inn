import Link from 'next/link';
import { SeasonHero } from '@/components/SeasonHero';

const roles = [
  { href: '/tourist', title: 'Tourist', desc: 'Plan your trip — stay, meals, live taxi, charter & activities in one session.', cta: 'Enter as Traveler' },
  { href: '/operator', title: 'Operator / Admin', desc: 'Manage property, rooms, menus, fleet, drivers & live dispatch board.', cta: 'Open Console' },
  { href: '/driver', title: 'Driver', desc: 'Companion app — availability, nearby requests, earnings.', cta: 'Driver App' },
];

export default function Home() {
  return (
    <main style={{ maxWidth: 980, margin: '0 auto', padding: '32px 24px' }}>
      <SeasonHero title="HikkInn" subtitle="AI-powered, web-hosted hospitality & travel platform for North Pakistan. One app, one session — stay, eat, move, fly." />
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
        {roles.map((r) => (
          <Link key={r.href} href={r.href} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ height: '100%' }}>
              <h2 style={{ margin: '0 0 8px', fontSize: 19 }}>{r.title}</h2>
              <p className="muted" style={{ fontSize: 13, lineHeight: 1.55, minHeight: 56 }}>{r.desc}</p>
              <span className="btn">{r.cta}</span>
            </div>
          </Link>
        ))}
      </section>
      <footer style={{ marginTop: 32, color: 'var(--muted)', fontSize: 12 }}>
        MVP scope: Hunza + Skardu · Webapp first, Android/iOS (Expo) to follow · AI via OpenRouter (pluggable)
      </footer>
    </main>
  );
}
