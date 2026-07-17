export default function Page() {
  return (
    <main style={{ fontFamily: 'sans-serif', padding: 24 }}>
      <h1>HikkInn — Spike B (Next 14) smoke test</h1>
      <p>If you see this, Next.js builds and renders. Deploy target: Cloudflare Pages.</p>
      <button onClick={async () => {
        const r = await fetch('/api/health');
        const j = await r.json();
        alert('API /api/health -> ' + JSON.stringify(j));
      }}>Ping API route</button>
    </main>
  );
}
