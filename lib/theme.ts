// Seasonal theming for HikkInn. North Pakistan has distinct visual seasons;
// the UI adapts palette + hero artwork to the current season automatically,
// with manual override.

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export interface SeasonTheme {
  id: Season;
  label: string;
  // CSS custom properties applied to :root via data-season attribute
  vars: Record<string, string>;
  // hero gradient (CSS) + accent art reference
  hero: string;
  blurb: string;
}

export const SEASONS: Record<Season, SeasonTheme> = {
  spring: {
    id: 'spring',
    label: 'Spring · Blossom',
    hero: 'linear-gradient(135deg,#fbcfe8 0%,#a7f3d0 50%,#67e8f9 100%)',
    blurb: 'Apricot blossoms across Hunza — valleys awake.',
    vars: {
      '--teal': '#0e7490', '--teal-light': '#22d3ee', '--ink': '#1e293b',
      '--muted': '#64748b', '--bg': '#fdf2f8', '--card': '#ffffff',
      '--line': '#fbcfe8', '--amber': '#db2777', '--green': '#059669',
      '--accent': '#ec4899',
    },
  },
  summer: {
    id: 'summer',
    label: 'Summer · Peak',
    hero: 'linear-gradient(135deg,#0e7490 0%,#22d3ee 50%,#34d399 100%)',
    blurb: 'High season — Babusar Pass open, skies electric blue.',
    vars: {
      '--teal': '#0e7490', '--teal-light': '#22d3ee', '--ink': '#0f172a',
      '--muted': '#64748b', '--bg': '#eef2f7', '--card': '#ffffff',
      '--line': '#e2e8f0', '--amber': '#f59e0b', '--green': '#16a34a',
      '--accent': '#06b6d4',
    },
  },
  autumn: {
    id: 'autumn',
    label: 'Autumn · Gold',
    hero: 'linear-gradient(135deg,#f59e0b 0%,#fb7185 50%,#a855f7 100%)',
    blurb: 'Chinar leaves turn gold and crimson over Skardu.',
    vars: {
      '--teal': '#b45309', '--teal-light': '#f59e0b', '--ink': '#292524',
      '--muted': '#78716c', '--bg': '#fffbeb', '--card': '#ffffff',
      '--line': '#fde68a', '--amber': '#d97706', '--green': '#65a30d',
      '--accent': '#ea580c',
    },
  },
  winter: {
    id: 'winter',
    label: 'Winter · Snow',
    hero: 'linear-gradient(135deg,#1e3a8a 0%,#7dd3fc 50%,#e0f2fe 100%)',
    blurb: 'Snowbound valleys, frozen lakes, quiet peaks.',
    vars: {
      '--teal': '#1d4ed8', '--teal-light': '#7dd3fc', '--ink': '#0f172a',
      '--muted': '#64748b', '--bg': '#eff6ff', '--card': '#ffffff',
      '--line': '#bfdbfe', '--amber': '#0ea5e9', '--green': '#10b981',
      '--accent': '#3b82f6',
    },
  },
};

// Northern Pakistan season by month (rough, valley-weighted).
export function seasonForMonth(month1to12: number): Season {
  if (month1to12 >= 3 && month1to12 <= 5) return 'spring';
  if (month1to12 >= 6 && month1to12 <= 8) return 'summer';
  if (month1to12 >= 9 && month1to12 <= 11) return 'autumn';
  return 'winter';
}

export function currentSeason(now = new Date()): Season {
  return seasonForMonth(now.getMonth() + 1);
}
