// HikkInn billing — BOTH sides of the platform.
//
// TOURIST side: pays for bookings, meals, rides, charters, activities.
// OPERATOR side: receives payouts (booking/meal/ride revenue) minus platform
// commission; can also be billed SaaS subscription fees.
//
// Gateways: JazzCash / Easypaisa (PKR, local), Stripe (cards/intl).
// This module models the money flows + commission; real charge/payout is a
// later integration (P3+). Charges are simulated here for the demo.

export type Gateway = 'jazzcash' | 'easypaisa' | 'stripe';

export interface ChargeLine {
  kind: 'stay' | 'meal' | 'ride' | 'charter' | 'activity';
  label: string;
  amountPkr: number;
}

export interface Invoice {
  id: string;
  touristId: string;
  lines: ChargeLine[];
  gateway: Gateway;
  currency: 'PKR';
  subtotalPkr: number;
  platformFeePkr: number; // commission collected from operator, passed through
  totalPkr: number;
  status: 'pending' | 'paid' | 'refunded';
}

export const PLATFORM_COMMISSION_PCT = 0.12; // 12% on operator side

export function buildInvoice(id: string, touristId: string, lines: ChargeLine[], gateway: Gateway): Invoice {
  const subtotal = lines.reduce((s, l) => s + l.amountPkr, 0);
  const fee = Math.round(subtotal * PLATFORM_COMMISSION_PCT);
  return {
    id, touristId, lines, gateway, currency: 'PKR',
    subtotalPkr: subtotal, platformFeePkr: fee, totalPkr: subtotal, status: 'pending',
  };
}

// Operator payout = gross booking value minus platform commission.
export interface Payout {
  id: string;
  operatorId: string;
  grossPkr: number;
  commissionPkr: number;
  netPkr: number;
  status: 'pending' | 'cleared' | 'onhold';
}

export function computePayout(id: string, operatorId: string, grossPkr: number): Payout {
  const commission = Math.round(grossPkr * PLATFORM_COMMISSION_PCT);
  return { id, operatorId, grossPkr, commissionPkr: commission, netPkr: grossPkr - commission, status: 'pending' };
}

export const GATEWAYS: { id: Gateway; label: string; currency: 'PKR'; note: string }[] = [
  { id: 'jazzcash', label: 'JazzCash', currency: 'PKR', note: 'Local mobile wallet (PK)' },
  { id: 'easypaisa', label: 'Easypaisa', currency: 'PKR', note: 'Local mobile wallet (PK)' },
  { id: 'stripe', label: 'Stripe', currency: 'PKR', note: 'Cards / international' },
];

// Operator SaaS subscription tiers (platform bills operator).
export const OPERATOR_PLANS = [
  { id: 'starter', label: 'Starter', pkrPerMonth: 0, properties: 1, note: 'Free pilot' },
  { id: 'growth', label: 'Growth', pkrPerMonth: 15000, properties: 5, note: 'Most SMEs' },
  { id: 'scale', label: 'Scale', pkrPerMonth: 45000, properties: 25, note: 'Chains' },
];
