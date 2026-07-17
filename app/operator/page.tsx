import { SeasonHero } from '@/components/SeasonHero';
import { AdminAssistant } from '@/components/AdminAssistant';

export default function OperatorHome() {
  return (
    <main style={{ maxWidth: 860, margin: '0 auto', padding: '32px 24px' }}>
      <SeasonHero title="Operator Console" subtitle="Manage inventory, menus, fleet, drivers and run agentic operations." />
      <div className="card">
        <h3 style={{ marginTop: 0, color: 'var(--teal)' }}>Inventory & Operations</h3>
        <ul className="muted" style={{ fontSize: 14, lineHeight: 1.9 }}>
          <li>Properties &amp; room types — Hunza (2) · Skardu (2)</li>
          <li>Menus — per day &amp; per meal, prepackaged plans, daily caps</li>
          <li>Fleet &amp; drivers — cars, ATVs, charter (Cessna/Heli)</li>
          <li>Food order board + live dispatch board (P2/P3)</li>
          <li>Billing — payouts (minus 12% commission) + SaaS plans</li>
        </ul>
        <p className="muted" style={{ fontSize: 12 }}>P1–P3 wire these to Postgres (lib/schema.ts + lib/seed.ts).</p>
      </div>
      <AdminAssistant />
      <a href="/" className="muted" style={{ fontSize: 13, display: 'inline-block', marginTop: 16 }}>← Back</a>
    </main>
  );
}
