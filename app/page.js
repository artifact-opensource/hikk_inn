export default function Home() {
  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 760, margin: '40px auto', padding: 24 }}>
      <h1 style={{ color: '#0e7490' }}>HikkInn — P0 Foundation</h1>
      <p>Two-sided hospitality & travel platform for North Pakistan.</p>
      <h3>Tourist</h3>
      <ul>
        <li><a href="/stay">Browse stays</a></li>
        <li><a href="/meals">Plan meals (per day / per meal)</a></li>
        <li><a href="/dispatch">Live taxi (Uber-style)</a></li>
        <li><a href="/charter">Charter (ATV / Cessna / Heli)</a></li>
      </ul>
      <h3>Operator</h3>
      <ul>
        <li><a href="/admin">Console (inventory + dispatch board)</a></li>
      </ul>
      <h3>Driver</h3>
      <ul>
        <li><a href="/driver">Companion app</a></li>
      </ul>
      <p style={{ marginTop: 24, color: '#64748b', fontSize: 13 }}>
        API health: <a href="/api/health">/api/health</a>
      </p>
    </main>
  );
}
