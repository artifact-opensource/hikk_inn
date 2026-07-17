import { SeasonHero } from '@/components/SeasonHero';

export default function DriverHome() {
  return (
    <main style={{ maxWidth: 860, margin: '0 auto', padding: '32px 24px' }}>
      <SeasonHero title="Driver Companion" subtitle="Availability, nearby requests, live earnings." />
      <div className="card">
        <h3 style={{ marginTop: 0, color: 'var(--teal)' }}>Companion app (PWA / mobile)</h3>
        <ul className="muted" style={{ fontSize: 14, lineHeight: 1.9 }}>
          <li>Toggle availability — server learns you're hireable in vicinity</li>
          <li>Incoming ride requests with pickup ETA & fare</li>
          <li>Accept → live GPS share → completed → payout (minus 12%)</li>
          <li>Works offline; push notifies you of nearby demand</li>
        </ul>
        <p className="muted" style={{ fontSize: 12 }}>Mobile (Android/iOS via Expo) reuses this webapp's API + DO dispatch (workers/dispatch.js).</p>
      </div>
      <a href="/" className="muted" style={{ fontSize: 13, display: 'inline-block', marginTop: 16 }}>← Back</a>
    </main>
  );
}
