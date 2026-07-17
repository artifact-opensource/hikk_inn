// HikkInn Spike C — RAG itinerary stub (no external LLM call; proves the
// grounding invariant: every generated item MUST map to a real catalog entity).
// In production this swaps the fake generator for Workers AI + Vectorize retrieve.

// Seed catalog (what Vectorize would index). Each item has a stable id.
const CATALOG = [
  { id: 'stay_hunza_eagle', type: 'stay', name: 'Eagle Nest Guest House', region: 'Hunza', room: 'Deluxe King', pricePKR: 6500 },
  { id: 'stay_skardu_shangrila', type: 'stay', name: 'Shangrila Resort', region: 'Skardu', room: 'Lake View', pricePKR: 18000 },
  { id: 'meal_hunza_d1', type: 'meal', name: 'Hunza trout dinner', meal: 'dinner', pricePKR: 1200, prepackaged: true },
  { id: 'meal_hunza_b1', type: 'meal', name: 'Local breakfast platter', meal: 'breakfast', pricePKR: 500, prepackaged: true },
  { id: 'act_hunza_para', type: 'activity', name: 'Paragliding tandem', region: 'Hunza', pricePKR: 9000, durationHrs: 1 },
  { id: 'act_skardu_heli', type: 'charter', name: 'Skardu–K2 heli sightseeing', region: 'Skardu', pricePKR: 45000, durationHrs: 2 },
  { id: 'trans_hunza_atv', type: 'vehicle', name: 'ATV trail excursion', region: 'Hunza', pricePKR: 3500, vehicleClass: 'atv' },
];

// "Retrieve" — in prod this is Vectorize semantic search; here, filter by region+type.
function retrieve(region, types) {
  return CATALOG.filter((c) => c.region === region && types.includes(c.type));
}

// Fake LLM planner: builds a day plan from retrieved items, tags each with its
// source catalog id (the grounding proof).
function planItinerary(region, intent) {
  const want = [];
  if (/paraglid|fly|sky/.test(intent)) want.push('activity');
  if (/heli|scenic|flight/.test(intent)) want.push('charter');
  if (/atv|jeep|ride/.test(intent)) want.push('vehicle');
  if (/food|meal|eat/.test(intent)) want.push('meal');
  want.push('stay'); // always need a stay
  const items = retrieve(region, [...new Set(want)]);
  return {
    region,
    days: [
      {
        day: 1,
        blocks: items.map((i) => ({
          type: i.type,
          label: i.name,
          pricePKR: i.pricePKR,
          sourceId: i.id, // <-- grounding: resolves to real catalog entity
        })),
      },
    ],
    totalPKR: items.reduce((s, i) => s + i.pricePKR, 0),
  };
}

// Invariant check: every block.sourceId must exist in CATALOG. No hallucination.
function verifyGrounded(plan) {
  const ids = new Set(CATALOG.map((c) => c.id));
  const bad = [];
  for (const d of plan.days)
    for (const b of d.blocks)
      if (!ids.has(b.sourceId)) bad.push(b);
  return { ok: bad.length === 0, bad };
}

module.exports = { CATALOG, planItinerary, verifyGrounded };

// --- self test ---
if (require.main === module) {
  const plan = planItinerary('Hunza', 'paragliding + local food + ATV ride');
  const v = verifyGrounded(plan);
  console.log('Plan:', JSON.stringify(plan, null, 2));
  console.log('\nGrounded check:', v.ok ? 'PASS (all blocks resolve to catalog)' : 'FAIL: ' + JSON.stringify(v.bad));
  process.exit(v.ok ? 0 : 1);
}
