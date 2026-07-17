export async function GET() {
  return Response.json({ ok: true, service: 'hikkInn', phase: 'P0', ts: Date.now() });
}
