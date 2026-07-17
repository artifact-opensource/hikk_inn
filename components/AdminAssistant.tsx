'use client';
import { useState } from 'react';
import { runAgent } from '@/lib/agent/runtime';
import { subscribePush, unsubscribePush } from '@/lib/push';

export function AdminAssistant() {
  const [cmd, setCmd] = useState('');
  const [log, setLog] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  async function run() {
    if (!cmd.trim()) return;
    setBusy(true);
    setLog((l) => [...l, `› ${cmd}`]);
    try {
      const res = await runAgent(cmd);
      setLog((l) => [...l, `✓ ${res.message}`]);
    } catch (e: any) {
      setLog((l) => [...l, `✗ ${e.message}`]);
    }
    setBusy(false);
    setCmd('');
  }

  return (
    <div className="card" style={{ marginTop: 20 }}>
      <h3 style={{ margin: '0 0 6px', color: 'var(--teal)' }}>AI Operations Assistant</h3>
      <p className="muted" style={{ fontSize: 12, marginTop: 0 }}>
        Natural-language control of bookings, orders & tasks (IndexedDB-backed, offline-capable).
      </p>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={cmd}
          onChange={(e) => setCmd(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && run()}
          placeholder="e.g. Cancel booking B-12 / Schedule deep clean tomorrow 9am"
          style={{ flex: 1, padding: 10, borderRadius: 10, border: '1px solid var(--line)', fontSize: 13 }}
        />
        <button className="btn" onClick={run} disabled={busy}>{busy ? '…' : 'Run'}</button>
      </div>
      <div style={{ marginTop: 12, fontFamily: 'monospace', fontSize: 12, background: 'var(--bg)', borderRadius: 10, padding: 12, maxHeight: 180, overflowY: 'auto' }}>
        {log.length === 0 ? <span className="muted">No commands yet.</span> : log.map((l, i) => <div key={i}>{l}</div>)}
      </div>
      <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
        <button className="btn amber" onClick={() => subscribePush().then(() => setLog((l) => [...l, '✓ Push subscribed']))}>Enable push</button>
        <button className="btn" onClick={() => unsubscribePush().then(() => setLog((l) => [...l, '✓ Push off']))}>Disable push</button>
      </div>
    </div>
  );
}
