// HikkInn agent runtime — turns natural-language admin commands into actions.
// Executes against the IndexedDB store (lib/agent/db) and a thin server API.
// Uses the AI provider abstraction (OpenRouter default) to parse intent.

import { chat, type ChatMessage } from '@/lib/ai/provider';
import { dbPut, dbGetAll, dbDelete, type Store } from './db';

export type AgentOp =
  | { type: 'schedule'; entity: Store; payload: any; at: number }
  | { type: 'cancel'; entity: Store; id: string }
  | { type: 'update'; entity: Store; id: string; patch: any }
  | { type: 'query'; entity: Store; filter?: any };

export interface AgentResult {
  ok: boolean;
  op?: AgentOp;
  message: string;
  data?: any;
}

const SYSTEM = `You are the HikkInn operations agent for a hospitality platform in North Pakistan.
Given an admin's request, emit a JSON plan with one of: schedule, cancel, update, query.
Entities: bookings, orders, tasks, audit.
Example: "Cancel booking B-12" -> {"type":"cancel","entity":"bookings","id":"B-12"}.
Respond ONLY with the JSON plan.`;

export async function planFromText(text: string): Promise<AgentOp> {
  const msgs: ChatMessage[] = [
    { role: 'system', content: SYSTEM },
    { role: 'user', content: text },
  ];
  const out = await chat({ messages: msgs, temperature: 0.1, maxTokens: 300 });
  try {
    return JSON.parse(out.text.replace(/```json|```/g, '').trim()) as AgentOp;
  } catch {
    // fallback heuristic if model didn't return clean JSON
    return heuristicPlan(text);
  }
}

function heuristicPlan(text: string): AgentOp {
  const t = text.toLowerCase();
  const idMatch = t.match(/(b-\w+|\w+-\d+)/);
  const id = idMatch?.[0] ?? `auto-${Date.now()}`;
  if (t.includes('cancel')) return { type: 'cancel', entity: 'bookings', id };
  if (t.includes('schedule') || t.includes('book')) return { type: 'schedule', entity: 'tasks', payload: { note: text }, at: Date.now() + 3600_000 };
  if (t.includes('update') || t.includes('change')) return { type: 'update', entity: 'bookings', id, patch: { note: text } };
  return { type: 'query', entity: 'bookings' };
}

export async function execute(op: AgentOp): Promise<AgentResult> {
  switch (op.type) {
    case 'schedule':
      await dbPut(op.entity, { id: `task-${Date.now()}`, ...op.payload, at: op.at, status: 'scheduled' });
      return { ok: true, op, message: `Scheduled ${op.entity} at ${new Date(op.at).toLocaleString()}` };
    case 'cancel':
      await dbDelete(op.entity, op.id);
      return { ok: true, op, message: `Cancelled ${op.entity} ${op.id}` };
    case 'update':
      await dbPut(op.entity, { id: op.id, ...op.patch });
      return { ok: true, op, message: `Updated ${op.entity} ${op.id}` };
    case 'query':
      return { ok: true, op, message: `Queried ${op.entity}`, data: await dbGetAll(op.entity) };
  }
}

export async function runAgent(text: string): Promise<AgentResult> {
  const plan = await planFromText(text);
  return execute(plan);
}
