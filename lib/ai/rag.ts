// HikkInn RAG layer — grounded retrieval over the platform knowledge base.
//
// In production this backs Cloudflare Vectorize (see wrangler.toml bindings).
// For local/demo runs (no CF creds) we use a deterministic local embedding
// (hashing bag-of-words + cosine) so retrieval + grounding work offline.
//
// GROUNDING INVARIANT: the agent must cite returned chunk ids; it may not
// answer from parametric memory alone. Enforced in lib/agent/runtime.ts.

export interface Chunk {
  id: string;
  text: string;
  meta: { source: string; kind: 'property' | 'menu' | 'vehicle' | 'policy' | 'doc' };
}

// ---- Knowledge base (seeded from catalog + product docs) ----
export const KB: Chunk[] = [
  { id: 'prop_eagle', text: 'Eagle Nest Guest House, Hunza. Guest house with Deluxe King (PKR 6500, 2pax, x8) and Family Suite (PKR 11000, 4pax, x3). Amenities: wifi, heating, mountain-view. Local breakfast platter PKR 500, Hunza trout dinner PKR 1200.', meta: { source: 'seed', kind: 'property' } },
  { id: 'prop_altit', text: 'Altit View Homestay, Hunza. Twin Room PKR 4000 (2pax, x6). Home-cooking, garden, wifi. Walnut & apricot bowl lunch PKR 700.', meta: { source: 'seed', kind: 'property' } },
  { id: 'prop_shangrila', text: 'Shangrila Resort, Skardu. Lake-view resort. Lake View PKR 18000 (2pax, x12), Premium Suite PKR 28000 (3pax, x4). Continental breakfast PKR 1500, grilled trout & greens dinner PKR 2200.', meta: { source: 'seed', kind: 'property' } },
  { id: 'prop_k2', text: 'K2 Motel, Skardu. Standard Double PKR 7000 (2pax, x20). Parking, wifi, 24x7 reception. Local thali dinner PKR 900.', meta: { source: 'seed', kind: 'property' } },
  { id: 'veh_car', text: 'Car class: sedan/SUV, up to 4 pax. Used for live taxi (Uber-style) and charters within valley. Base fare metered, surge by demand.', meta: { source: 'seed', kind: 'vehicle' } },
  { id: 'veh_atv', text: 'ATV class: 2pax off-road. Adventure + short charters on rough terrain (Hunza/Skardu trails).', meta: { source: 'seed', kind: 'vehicle' } },
  { id: 'veh_cessna', text: 'Cessna charter: scenic flight, up to 4 pax. Skardu–Gilgit–Islamabad hops. Weather-dependent, advance booking.', meta: { source: 'seed', kind: 'vehicle' } },
  { id: 'veh_heli', text: 'Helicopter charter: up to 5 pax, point-to-point. Premium, weather-dependent, advance booking + permit.', meta: { source: 'seed', kind: 'vehicle' } },
  { id: 'pol_meals', text: 'Meals are per-day / per-meal, not "breakfast included". Guest selects each meal; prepackaged plans available; operator sets daily caps.', meta: { source: 'doc', kind: 'policy' } },
  { id: 'pol_billing', text: 'Billing both sides. Tourist pays stay+meals+rides+charters+activities via JazzCash/Easypaisa/Stripe (PKR). Operator payout = gross minus 12% platform commission. Operators pay SaaS plan (Starter free / Growth 15k / Scale 45k PKR/mo).', meta: { source: 'doc', kind: 'policy' } },
  { id: 'pol_dispatch', text: 'Live dispatch: tourist requests ride/charter; Durable Object matches nearest available driver (haversine + ETA); surge by demand; driver companion app shows nearby demand.', meta: { source: 'doc', kind: 'policy' } },
  { id: 'pol_season', text: 'North Pakistan seasons: Spring (Mar–May, blossoms), Summer (Jun–Aug, peak, Babusar open), Autumn (Sep–Nov, chinar gold), Winter (Dec–Feb, snow). UI theming auto-switches.', meta: { source: 'doc', kind: 'policy' } },
];

// ---- Local deterministic embedding (hashing bag-of-words) ----
const STOP = new Set(['the', 'a', 'an', 'and', 'or', 'to', 'of', 'in', 'for', 'with', 'is', 'are', 'up', 'on', 'at']);
function tokenize(s: string): string[] {
  return s.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter((t) => t && !STOP.has(t));
}
function embed(text: string): number[] {
  const vec: Record<string, number> = {};
  for (const t of tokenize(text)) vec[t] = (vec[t] ?? 0) + 1;
  return Object.values(vec); // sparse; cosine below uses keys
}
function cosine(aText: string, bText: string): number {
  const ta = tokenize(aText), tb = tokenize(bText);
  const sa = new Map<string, number>(), sb = new Map<string, number>();
  ta.forEach((t) => sa.set(t, (sa.get(t) ?? 0) + 1));
  tb.forEach((t) => sb.set(t, (sb.get(t) ?? 0) + 1));
  let dot = 0, na = 0, nb = 0;
  const keys = new Set([...sa.keys(), ...sb.keys()]);
  for (const k of keys) {
    const x = sa.get(k) ?? 0, y = sb.get(k) ?? 0;
    dot += x * y; na += x * x; nb += y * y;
  }
  return na && nb ? dot / (Math.sqrt(na) * Math.sqrt(nb)) : 0;
}

export interface Retrieval {
  chunk: Chunk;
  score: number;
}

// Vectorize-shaped retrieval. Local impl = cosine over KB.
// Swap body for `await env.CATALOG_INDEX.query(embed(query), { topK })` in prod.
export async function retrieve(query: string, topK = 4): Promise<Retrieval[]> {
  return KB.map((chunk) => ({ chunk, score: cosine(query, chunk.text) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

// In production: upsert into Vectorize. Local: no-op (KB static).
export async function indexChunk(chunk: Chunk): Promise<void> {
  // prod: await env.CATALOG_INDEX.upsert([{ id: chunk.id, values: embed(chunk.text), metadata: chunk.meta }]);
  KB.push(chunk);
}
