export default function TouristHome() {
  return (
    <main style={{ maxWidth: 820, margin: '0 auto', padding: '40px 24px' }}>
      <h1 style={{ color: 'var(--teal)' }}>Tourist — plan your trip</h1>
      <p style={{ color: 'var(--muted)' }}>
        P1 will add: property browse &amp; room booking, per-day/per-meal selection,
        live taxi (Uber-style), charter (ATV/Cessna/Heli), activities, and the AI
        itinerary builder.
      </p>
      <ul style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.8 }}>
        <li>Stay — browse Hunza &amp; Skardu properties</li>
        <li>Meals — per day &amp; per meal, prepackaged plans</li>
        <li>Move — live taxi with driver ETA</li>
        <li>Fly &amp; play — charter &amp; adventure activities</li>
      </ul>
      <a href="/" style={{ fontSize: 13 }}>← Back</a>
    </main>
  );
}
