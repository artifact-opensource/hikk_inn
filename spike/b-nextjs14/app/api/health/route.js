export async function GET() {
  return Response.json({ ok: true, service: 'hikkInn-spike-b14', ts: Date.now() });
}
