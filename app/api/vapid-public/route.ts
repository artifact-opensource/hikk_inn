// VAPID public key endpoint (stub). Real key injected at deploy via env.
// Returns the public key so the client can subscribe to Web Push.
import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET() {
  const key = process.env.VAPID_PUBLIC_KEY ?? 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnf4wuIr8RrZK3T1ghk0d6pz1jXVQ4k';
  return NextResponse.json({ key });
}
