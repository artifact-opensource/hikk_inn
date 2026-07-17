'use client';
import { SeasonHero } from '@/components/SeasonHero';

export function DemoBanner() {
  return (
    <div style={{
      background: 'linear-gradient(90deg, rgba(14,116,144,.08), rgba(245,158,11,.08))',
      border: '1px solid var(--line)', borderRadius: 12, padding: '8px 14px',
      fontSize: 12, color: 'var(--muted)', marginBottom: 16, display: 'flex', gap: 8, alignItems: 'center',
    }}>
      <span style={{ background: 'var(--amber)', color: '#fff', padding: '2px 8px', borderRadius: 999, fontWeight: 700, fontSize: 10 }}>DEMO</span>
      <span>Live UI · AI agent runs locally (OpenRouter-ready) · bookings/billing in-browser (IndexedDB). Real Postgres + charge rails = P3.</span>
    </div>
  );
}

export function CapabilityStrip() {
  const caps = [
    { t: 'Two-sided platform', d: 'Admin operations + tourist self-service in one app.' },
    { t: 'Grounded AI (RAG)', d: 'OpenRouter default + Gemini/OpenAI/Anthropic/Ollama. Cited answers.' },
    { t: 'Live dispatch', d: 'Uber-style taxi/charter via Durable Objects WebSocket.' },
    { t: 'Per-meal ordering', d: 'Not "breakfast included" — pick each meal, prepackaged plans.' },
    { t: 'Billing both sides', d: 'Tourist pays; operator payout −12% commission.' },
    { t: 'Seasonal UX', d: 'Auto theming + artwork for N-Pakistan seasons.' },
  ];
  return (
    <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12, marginTop: 4 }}>
      {caps.map((c) => (
        <div key={c.t} className="card">
          <h3 style={{ margin: '0 0 4px', fontSize: 15, color: 'var(--teal)' }}>{c.t}</h3>
          <p className="muted" style={{ fontSize: 12.5, margin: 0, lineHeight: 1.5 }}>{c.d}</p>
        </div>
      ))}
    </section>
  );
}
