export default function Page() {
  return (
    <main style={{ fontFamily: 'sans-serif', padding: 24 }}>
      <h1>HikkInn — Spike B smoke test</h1>
      <p>Next.js on Cloudflare Pages target. If you see this, the app builds and renders.</p>
      <button onClick={async () => {
        const r = await fetch('/api/health');
        const j = await r.json();
        alert('API /api/health -> ' + JSON.stringify(j));
      }}>Ping API route</button>
    </main>
  );
}
