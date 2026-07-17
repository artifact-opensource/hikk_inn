import { SeasonHero } from '@/components/SeasonHero';

export default function TouristHome() {
  const features = [
    { icon: '🏔️', t: 'Stay', d: 'Browse Hunza & Skardu properties, pick rooms per night.' },
    { icon: '🍽️', t: 'Meals', d: 'Per day & per meal selection, prepackaged plans.' },
    { icon: '🚕', t: 'Move', d: 'Live taxi with driver ETA (Uber-style).' },
    { icon: '🚁', t: 'Fly & play', d: 'Charter ATV/Cessna/Heli + adventure activities.' },
    { icon: '🤖', t: 'AI planner', d: 'Natural-language itinerary across all of the above.' },
    { icon: '🔔', t: 'Push alerts', d: 'Booking conf, driver ETA, order ready.' },
  ];
  return (
    <main style={{ maxWidth: 860, margin: '0 auto', padding: '32px 24px' }}>
      <SeasonHero title="Plan your trip" subtitle="Stay, eat, move and fly — customized for North Pakistan." />
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
        {features.map((f) => (
          <div key={f.t} className="card">
            <div style={{ fontSize: 26 }}>{f.icon}</div>
            <h3 style={{ margin: '6px 0 4px', fontSize: 16 }}>{f.t}</h3>
            <p className="muted" style={{ fontSize: 13, margin: 0 }}>{f.d}</p>
          </div>
        ))}
      </section>
      <div className="card" style={{ marginTop: 18 }}>
        <h3 style={{ marginTop: 0, color: 'var(--teal)' }}>Billing</h3>
        <p className="muted" style={{ fontSize: 13 }}>Pay for stays, meals, rides & activities via JazzCash, Easypaisa or Stripe (PKR). Platform fee 12% is borne by operators.</p>
      </div>
      <a href="/" className="muted" style={{ fontSize: 13, display: 'inline-block', marginTop: 16 }}>← Back</a>
    </main>
  );
}
