'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { SEASONS, currentSeason, type Season } from '@/lib/theme';

interface ThemeCtx {
  season: Season;
  setSeason: (s: Season) => void;
  auto: boolean;
  setAuto: (b: boolean) => void;
}
const Ctx = createContext<ThemeCtx>({ season: 'summer', setSeason: () => {}, auto: true, setAuto: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [auto, setAuto] = useState(true);
  const [season, setSeason] = useState<Season>('summer');

  useEffect(() => {
    if (auto) setSeason(currentSeason());
  }, [auto]);

  useEffect(() => {
    const t = SEASONS[season];
    const root = document.documentElement;
    root.setAttribute('data-season', season);
    for (const [k, v] of Object.entries(t.vars)) root.style.setProperty(k, v);
  }, [season]);

  return <Ctx.Provider value={{ season, setSeason, auto, setAuto }}>{children}</Ctx.Provider>;
}
export const useTheme = () => useContext(Ctx);
