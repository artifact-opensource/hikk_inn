// HikkInn AI provider abstraction.
// DEFAULT provider = OpenRouter. Pluggable: Gemini, OpenAI, Anthropic,
// OpenAI-compatible (any /v1/chat/completions), and Ollama (local).
//
// This is the single integration point used by the AI itinerary planner (P4)
// and the agentic admin assistant. Swap via env or runtime config.

export type ProviderId =
  | 'openrouter'
  | 'openai'
  | 'anthropic'
  | 'gemini'
  | 'openai-compatible'
  | 'ollama';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ProviderConfig {
  id: ProviderId;
  label: string;
  apiKey?: string;          // optional (Ollama needs none; OpenRouter needs key)
  baseUrl?: string;         // for openai-compatible / ollama
  model: string;
  default?: boolean;
}

export interface ChatOptions {
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  signal?: AbortSignal;
}

export interface ChatResult {
  text: string;
  provider: ProviderId;
  model: string;
  usage?: { promptTokens?: number; completionTokens?: number };
}

const DEFAULT_MODELS: Record<ProviderId, string> = {
  openrouter: 'openrouter/auto',           // routes to best available
  openai: 'gpt-4o-mini',
  anthropic: 'claude-3-5-haiku-latest',
  gemini: 'gemini-1.5-flash',
  'openai-compatible': 'local-model',
  ollama: 'llama3.1',
};

export function resolveProvider(cfg?: Partial<ProviderConfig> & { id?: ProviderId }): ProviderConfig {
  const id: ProviderId = cfg?.id ?? (process.env.AI_PROVIDER as ProviderId) ?? 'openrouter';
  return {
    id,
    label: id,
    apiKey: cfg?.apiKey ?? process.env[`AI_KEY_${id.toUpperCase().replace('-', '_')}`] ?? process.env.OPENROUTER_API_KEY,
    baseUrl: cfg?.baseUrl ?? (id === 'ollama' ? (process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434') : process.env.OPENAI_COMPAT_BASE_URL),
    model: cfg?.model ?? process.env.AI_MODEL ?? DEFAULT_MODELS[id],
    default: id === 'openrouter',
  };
}

function openAiCompatibleBody(messages: ChatMessage[], model: string, temp?: number, max?: number) {
  return {
    model,
    messages,
    temperature: temp ?? 0.7,
    max_tokens: max ?? 1024,
    stream: false,
  };
}

export async function chat(opts: ChatOptions, config?: Partial<ProviderConfig> & { id?: ProviderId }): Promise<ChatResult> {
  const p = resolveProvider(config);
  const body = openAiCompatibleBody(opts.messages, p.model, opts.temperature, opts.maxTokens);

  switch (p.id) {
    case 'ollama':
      return postJson(`${p.baseUrl ?? 'http://localhost:11434'}/api/chat`, {
        model: p.model, messages: opts.messages, stream: false, options: { temperature: opts.temperature ?? 0.7 },
      }, p, 'ollama');

    case 'anthropic': {
      // Anthropic uses a different shape; normalize here.
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': p.apiKey ?? '',
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: p.model,
          max_tokens: opts.maxTokens ?? 1024,
          system: opts.messages.find((m) => m.role === 'system')?.content ?? '',
          messages: opts.messages.filter((m) => m.role !== 'system'),
        }),
        signal: opts.signal,
      });
      const j = await r.json();
      return { text: (j.content?.[0]?.text) ?? '', provider: p.id, model: p.model };
    }

    case 'gemini': {
      const r = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${p.model}:generateContent?key=${p.apiKey ?? ''}`,
        {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            contents: opts.messages.map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] })),
          }),
          signal: opts.signal,
        });
      const j = await r.json();
      return { text: j.candidates?.[0]?.content?.parts?.[0]?.text ?? '', provider: p.id, model: p.model };
    }

    default: {
      // openrouter, openai, openai-compatible all speak /v1/chat/completions
      const base = p.id === 'openrouter'
        ? 'https://openrouter.ai/api/v1/chat/completions'
        : p.id === 'openai'
          ? 'https://api.openai.com/v1/chat/completions'
          : p.baseUrl ?? 'http://localhost:8080/v1/chat/completions';
      const r = await fetch(base, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          ...(p.apiKey ? { authorization: `Bearer ${p.apiKey}` } : {}),
        },
        body: JSON.stringify(body),
        signal: opts.signal,
      });
      const j = await r.json();
      return {
        text: j.choices?.[0]?.message?.content ?? '',
        provider: p.id,
        model: p.model,
        usage: { promptTokens: j.usage?.prompt_tokens, completionTokens: j.usage?.completion_tokens },
      };
    }
  }
}

async function postJson(url: string, body: unknown, p: ProviderConfig, kind: 'ollama'): Promise<ChatResult> {
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  const j = await r.json();
  // Ollama chat returns { message: { content } }
  const text = kind === 'ollama' ? (j.message?.content ?? '') : (j.choices?.[0]?.message?.content ?? '');
  return { text, provider: p.id, model: p.model };
}

export const PROVIDER_LIST: { id: ProviderId; label: string; needsKey: boolean }[] = [
  { id: 'openrouter', label: 'OpenRouter (default)', needsKey: true },
  { id: 'openai', label: 'OpenAI', needsKey: true },
  { id: 'anthropic', label: 'Anthropic', needsKey: true },
  { id: 'gemini', label: 'Google Gemini', needsKey: true },
  { id: 'openai-compatible', label: 'OpenAI-compatible', needsKey: false },
  { id: 'ollama', label: 'Ollama (local)', needsKey: false },
];
