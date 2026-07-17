export async function GET() {
  return Response.json({ ok: true, service: 'hikkInn-spike-b', ts: Date.now() });
}
