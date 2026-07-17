// HikkInn agentic admin — local durable store (IndexedDB) + AI automation.
// The admin assistant persists ops state in IndexedDB (works offline, PWA),
// and an AI provider (lib/ai/provider) interprets natural-language commands to
// schedule / cancel / update platform operations end-to-end.
//
// This is the agent runtime used by the operator console's "AI Assistant" panel.

'use client';

const DB_NAME = 'hikkInn-agent';
const DB_VERSION = 1;
export const STORES = ['tasks', 'bookings', 'orders', 'audit'] as const;
export type Store = (typeof STORES)[number];

export function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') return reject(new Error('IndexedDB unavailable'));
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      for (const s of STORES) if (!db.objectStoreNames.contains(s)) db.createObjectStore(s, { keyPath: 'id' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function dbPut(store: Store, value: any): Promise<void> {
  const db = await openDB();
  return new Promise((res, rej) => {
    const tx = db.transaction(store, 'readwrite');
    tx.objectStore(store).put({ ...value, updatedAt: Date.now() });
    tx.oncomplete = () => res();
    tx.onerror = () => rej(tx.error);
  });
}

export async function dbGetAll(store: Store): Promise<any[]> {
  const db = await openDB();
  return new Promise((res, rej) => {
    const tx = db.transaction(store, 'readonly');
    const r = tx.objectStore(store).getAll();
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}

export async function dbGet(store: Store, id: string): Promise<any> {
  const db = await openDB();
  return new Promise((res, rej) => {
    const tx = db.transaction(store, 'readonly');
    const r = tx.objectStore(store).get(id);
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}

export async function dbDelete(store: Store, id: string): Promise<void> {
  const db = await openDB();
  return new Promise((res, rej) => {
    const tx = db.transaction(store, 'readwrite');
    tx.objectStore(store).delete(id);
    tx.oncomplete = () => res();
    tx.onerror = () => rej(tx.error);
  });
}
