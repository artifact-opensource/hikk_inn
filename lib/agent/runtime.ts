// HikkInn agent runtime v2 — RAG-grounded, tool-calling, autonomous-capable.
// Replaces the heuristic-only v1. Used by BOTH admin and tourist chat.
//
// GROUNDING: every answer is built from retrieved KB chunks (cited by id).
// TOOLS: booking.create/cancel/update, billing.invoice/payout, reminder.set.

import { chat, type ChatMessage } from '@/lib/ai/provider';
import { retrieve } from '@/lib/ai/rag';
import { dbPut, dbGetAll } from './db';

export type AgentSide = 'admin' | 'tourist';

export interface ToolCall {
  tool: 'booking.create' | 'booking.cancel' | 'booking.update' | 'billing.invoice' | 'billing.payout' | 'reminder.set' | 'none';
  args: Record<string, any>;
}

const SYSTEM_ADMIN = `You are the HikkInn OPERATIONS agent for a North Pakistan hospitality platform.
You have tools: booking.create, booking.cancel, booking.update, billing.invoice, billing.payout, reminder.set.
Answer the operator using ONLY the provided context chunks (cite chunk ids like [prop_eagle]).
If a tool is implied (e.g. "cancel booking B-12", "invoice operator for 50000"), emit a JSON tool call.
Respond: { "answer": "...", "cites": ["id",...], "tool": {...} } or { "answer": "...", "cites": [...], "tool": {"tool":"none","args":{}} }.`;

const SYSTEM_TOURIST = `You are the HikkInn TRAVELER assistant for North Pakistan.
Help the guest plan: stays, meals (per-day/per-meal), live taxi, charters (ATV/Cessna/Heli), activities.
Use ONLY the provided context chunks (cite ids). If the guest wants to book, emit booking.create.
Respond: { "answer": "...", "cites": ["id",...], "tool": {"tool":"booking.create","args":{...}} } or tool none.`;

export interface AgentTurn {
  answer: string;
  cites: string[];
  tool?: ToolCall;
}

export async function agentTurn(side: AgentSide, userText: string, history: ChatMessage[] = []): Promise<AgentTurn> {
  const hits = await retrieve(userText, 4);
  const ctx = hits.map((h) => `[${h.chunk.id}] ${h.chunk.text}`).join('\n');
  const sys = (side === 'admin' ? SYSTEM_ADMIN : SYSTEM_TOURIST) + `\n\nCONTEXT:\n${ctx}`;
  const messages: ChatMessage[] = [
    { role: 'system', content: sys },
    ...history.slice(-6),
    { role: 'user', content: userText },
  ];
  const out = await chat({ messages, temperature: 0.2, maxTokens: 500 });
  let parsed: any;
  try { parsed = JSON.parse(out.text.replace(/```json|```/g, '').trim()); }
  catch { return { answer: out.text, cites: hits.map((h) => h.chunk.id), tool: { tool: 'none', args: {} } }; }
  const tool: ToolCall = parsed.tool ?? { tool: 'none', args: {} };
  return { answer: parsed.answer ?? out.text, cites: parsed.cites ?? hits.map((h) => h.chunk.id), tool };
}

// Execute a tool call against local stores (IndexedDB). Prod swaps to Postgres/API.
export async function execTool(tool: ToolCall, side: AgentSide): Promise<string> {
  switch (tool.tool) {
    case 'booking.create': {
      const id = `bk_${Date.now()}`;
      await dbPut('bookings', { id, ...tool.args, status: 'confirmed', createdAt: Date.now() });
      return `Created booking ${id}.`;
    }
    case 'booking.cancel': {
      const b = (await dbGetAll('bookings')).find((x) => x.id === tool.args.id);
      if (b) { b.status = 'cancelled'; await dbPut('bookings', b); return `Cancelled ${tool.args.id}.`; }
      return `Booking ${tool.args.id} not found.`;
    }
    case 'booking.update': {
      const b = (await dbGetAll('bookings')).find((x) => x.id === tool.args.id);
      if (b) { await dbPut('bookings', { ...b, ...tool.args.patch, updatedAt: Date.now() }); return `Updated ${tool.args.id}.`; }
      return `Booking ${tool.args.id} not found.`;
    }
    case 'reminder.set': {
      const id = `rem_${Date.now()}`;
      await dbPut('tasks', { id, kind: 'reminder', note: tool.args.note, at: tool.args.at ?? Date.now() + 86400000, status: 'scheduled' });
      return `Reminder set: ${tool.args.note}.`;
    }
    case 'billing.invoice':
      return `Invoice drafted for PKR ${tool.args.amount ?? 0} (gateway ${tool.args.gateway ?? 'jazzcash'}). [demo]`;
    case 'billing.payout':
      return `Payout computed: gross ${tool.args.gross ?? 0} − 12% = net ${Math.round((tool.args.gross ?? 0) * 0.88)}. [demo]`;
    default:
      return 'No action.';
  }
}
