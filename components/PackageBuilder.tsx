'use client';
import { useState } from 'react';
import { SEED_PROPERTIES, SEED_DRIVERS } from '@/lib/seed';

interface Item { id: string; cat: string; label: string; price: number; }

export function PackageBuilder() {
  const [items, setItems] = useState<Item[]>([]);
  const [days, setDays] = useState(2);
  const toggle = (it: Item) => setItems((cur) => cur.some((x) => x.id === it.id) ? cur.filter((x) => x.id !== it.id) : [...cur, it]);
  const total = items.reduce((s, i) => s + i.price, 0) * (items.some((i) => i.cat === 'stay') ? days : 1);

  return (
    <div className="card" style={{ marginTop: 18 }}>
      <h3 style={{ marginTop: 0, color: 'var(--teal)' }}>Build your package (manual)</h3>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 240 }}>
          <b style={{ fontSize: 13 }}>Stay (× {days} nights)</b>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '4px 0' }}>
            <button className="btn" style={{ padding: '2px 10px' }} onClick={() => setDays((d) => Math.max(1, d - 1))}>−</button>
            <span>{days}</span>
            <button className="btn" style={{ padding: '2px 10px' }} onClick={() => setDays((d) => d + 1)}>+</button>
          </div>
          {SEED_PROPERTIES.map((p) => p.rooms.map((r) => (
            <label key={p.id + r.name} style={{ display: 'block', fontSize: 12, padding: '3px 0' }}>
              <input type="checkbox" onChange={() => toggle({ id: p.id + r.name, cat: 'stay', label: `${p.name} — ${r.name}`, price: r.price })} />
              {' '}{p.name} · {r.name} — PKR {r.price}/nt
            </label>
          )))}
        </div>
        <div style={{ flex: 1, minWidth: 240 }}>
          <b style={{ fontSize: 13 }}>Meals</b>
          {SEED_PROPERTIES.flatMap((p) => p.menu.map((m) => (
            <label key={p.id + m.name} style={{ display: 'block', fontSize: 12, padding: '3px 0' }}>
              <input type="checkbox" onChange={() => toggle({ id: p.id + m.name, cat: 'meal', label: `${p.name}: ${m.name} (${m.meal_type})`, price: m.price })} />
              {' '}{m.meal_type}: {m.name} — PKR {m.price}
            </label>
          )))}
          <b style={{ fontSize: 13, display: 'block', marginTop: 8 }}>Charter / Ride</b>
          {['Car (live taxi)', 'ATV', 'Cessna', 'Helicopter'].map((v, i) => (
            <label key={v} style={{ display: 'block', fontSize: 12, padding: '3px 0' }}>
              <input type="checkbox" onChange={() => toggle({ id: 'veh' + i, cat: 'charter', label: v, price: [1500, 3000, 45000, 120000][i] })} />
              {' '}{v}
            </label>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 12, padding: 12, background: 'var(--bg)', borderRadius: 10, fontSize: 13 }}>
        <b>Selected ({items.length}):</b> {items.map((i) => i.label).join(' · ') || 'none'}
        <div style={{ marginTop: 6, fontSize: 16, color: 'var(--teal)' }}>Estimated total: PKR {total.toLocaleString()}</div>
      </div>
      <button className="btn green" style={{ marginTop: 10 }} onClick={() => alert('Package handed to AI agent / booking flow (demo)')}>Send to AI / Book</button>
    </div>
  );
}
