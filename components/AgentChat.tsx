'use client';
import { useState } from 'react';
import { agentTurn, execTool, type AgentSide } from '@/lib/agent/runtime';
import { listBookings, createBooking, cancelBooking, type Booking } from '@/lib/booking';
import { subscribePush } from '@/lib/push';

interface Msg { role: 'user' | 'agent'; text: string; cites?: string[]; }

export function AgentChat({ side }: { side: AgentSide }) {
  const [msgs, setMsgs] = useState<Msg[]>([{ role: 'agent', text: side === 'admin'
    ? 'Operations agent ready. Ask me to manage bookings, draft invoices, set reminders, or query the catalog.'
    : 'Travel assistant ready. Ask about stays, meals, rides, charters, or build a package.' }]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);

  async function send() {
    if (!input.trim()) return;
    const u = input.trim();
    setMsgs((m) => [...m, { role: 'user', text: u }]);
    setInput(''); setBusy(true);
    const turn = await agentTurn(side, u);
    let extra = '';
    if (turn.tool && turn.tool.tool !== 'none') extra = ' → ' + (await execTool(turn.tool, side));
    setMsgs((m) => [...m, { role: 'agent', text: turn.answer + extra, cites: turn.cites }]);
    setBusy(false);
  }

  return (
    <div className="card" style={{ marginTop: 18 }}>
      <h3 style={{ marginTop: 0, color: 'var(--teal)' }}>{side === 'admin' ? 'AI Operations Agent' : 'AI Travel Assistant'}</h3>
      <div style={{ fontFamily: 'monospace', fontSize: 12, background: 'var(--bg)', borderRadius: 10, padding: 12, maxHeight: 240, overflowY: 'auto' }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            <b style={{ color: m.role === 'user' ? 'var(--teal)' : 'var(--accent)' }}>{m.role === 'user' ? 'You' : 'AI'}:</b> {m.text}
            {m.cites && m.cites.length > 0 && <span className="muted"> {'[' + m.cites.join(', ') + ']'}</span>}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder={side === 'admin' ? 'e.g. Cancel booking bk_123 / Invoice operator for 50000' : 'e.g. 2 nights Eagle Nest + trout dinner + ATV'}
          style={{ flex: 1, padding: 10, borderRadius: 10, border: '1px solid var(--line)', fontSize: 13 }} />
        <button className="btn" onClick={send} disabled={busy}>{busy ? '…' : 'Send'}</button>
      </div>
    </div>
  );
}

export function BookingManager() {
  const [list, setList] = useState<Booking[]>([]);
  const [loaded, setLoaded] = useState(false);
  async function refresh() { setList(await listBookings()); setLoaded(true); }
  return (
    <div className="card" style={{ marginTop: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, color: 'var(--teal)' }}>Booking Management</h3>
        <button className="btn amber" onClick={refresh}>{loaded ? 'Refresh' : 'Load'}</button>
      </div>
      {loaded && (
        list.length === 0
          ? <p className="muted" style={{ fontSize: 13 }}>No bookings yet.</p>
          : <table style={{ width: '100%', fontSize: 12, marginTop: 10, borderCollapse: 'collapse' }}>
              <thead><tr className="muted"><th align="left">ID</th><th align="left">Kind</th><th align="left">Label</th><th align="left">Status</th><th></th></tr></thead>
              <tbody>
                {list.map((b) => (
                  <tr key={b.id} style={{ borderTop: '1px solid var(--line)' }}>
                    <td>{b.id.slice(0, 10)}</td><td>{b.kind}</td><td>{b.label}</td>
                    <td style={{ color: b.status === 'cancelled' ? 'var(--amber)' : 'var(--green)' }}>{b.status}</td>
                    <td><button className="btn" style={{ padding: '4px 8px' }} onClick={async () => { await cancelBooking(b.id); refresh(); }}>Cancel</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
      )}
      <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button className="btn green" onClick={async () => { await createBooking({ id: `bk_${Date.now()}`, kind: 'stay', touristId: 'demo', propertyId: 'prop_eagle', roomTypeId: 'deluxe', label: 'Eagle Nest — Deluxe King (sample)', totalPkr: 6500, guests: 2 }); refresh(); }}>+ Sample booking</button>
        <button className="btn" onClick={() => subscribePush().then(() => alert('Push enabled'))}>Enable push</button>
      </div>
    </div>
  );
}

export function BillingPanel() {
  return (
    <div className="card" style={{ marginTop: 18 }}>
      <h3 style={{ marginTop: 0, color: 'var(--teal)' }}>Billing · Accounting · Invoicing</h3>
      <ul className="muted" style={{ fontSize: 13, lineHeight: 1.9 }}>
        <li>Tourist charges: JazzCash / Easypaisa / Stripe (PKR)</li>
        <li>Operator payout = gross − 12% commission</li>
        <li>SaaS tiers: Starter (free) · Growth (15k) · Scale (45k) PKR/mo</li>
        <li>Invoicing + reminders automated via AI agent (chat above)</li>
      </ul>
      <p className="muted" style={{ fontSize: 11 }}>Demo mode — real charge rails scoped to P3.</p>
    </div>
  );
}
