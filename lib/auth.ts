// P0 auth scaffold — role context only. Real provider (Cloudflare Access /
// Auth0 / Supabase) is an open decision (see docs/stakeholder/04-architecture.md).
//
// This module defines the three platform roles and a minimal server-side
// session shape. It does NOT implement a full auth flow yet — P0 gate is
// "deployable skeleton + role routing", not production auth.

export type Role = 'tourist' | 'operator' | 'driver';

export interface SessionUser {
  id: string;
  role: Role;
  name?: string;
  region?: string; // operator/driver: assigned region
}

// Placeholder resolver. In P1+ this reads a real session/JWT.
export function roleFromPath(pathname: string): Role | null {
  if (pathname.startsWith('/tourist')) return 'tourist';
  if (pathname.startsWith('/operator')) return 'operator';
  if (pathname.startsWith('/driver')) return 'driver';
  return null;
}

export const ROLE_LABELS: Record<Role, string> = {
  tourist: 'Traveler',
  operator: 'Operator / Admin',
  driver: 'Driver',
};
