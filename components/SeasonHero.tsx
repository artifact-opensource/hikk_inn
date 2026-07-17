'use client';
import { useTheme } from './ThemeProvider';
import { SEASONS } from '@/lib/theme';

export function SeasonHero({ title, subtitle }: { title: string; subtitle?: string }) {
  const { season } = useTheme();
  const t = SEASONS[season];
  return (
    <div style={{ position: 'relative', borderRadius: 18, overflow: 'hidden', marginBottom: 24, boxShadow: '0 10px 30px rgba(0,0,0,.12)' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/art/season-${season}.png`} alt={t.label} style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 28px', background: 'linear-gradient(90deg,rgba(0,0,0,.45),transparent)' }}>
        <h1 style={{ color: '#fff', margin: 0, fontSize: 30, textShadow: '0 2px 8px rgba(0,0,0,.4)' }}>{title}</h1>
        {subtitle && <p style={{ color: '#e2e8f0', fontSize: 14, maxWidth: 560, marginTop: 6 }}>{subtitle}</p>}
        <span style={{ position: 'absolute', top: 14, right: 16, fontSize: 11, color: '#fff', background: 'rgba(0,0,0,.35)', padding: '3px 9px', borderRadius: 999 }}>{t.label}</span>
      </div>
    </div>
  );
}
