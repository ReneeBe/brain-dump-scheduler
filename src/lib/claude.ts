import type { ParsedTask } from '../types/task';

const ANTHROPIC_URL = import.meta.env.DEV
  ? '/api/anthropic/v1/messages'
  : 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-opus-4-6';
const MAGICLINK_URL = 'https://magiclink.reneebe.workers.dev';

function buildPrompt(today: string, text: string): string {
  return `You are a task extraction and scheduling assistant.

The user has written a free-form "brain dump" of everything on their mind.
Your job is to extract every actionable task from this text and return them as a JSON array.

Rules:
- Extract ONLY concrete, actionable tasks (not vague worries or observations).
- For each task, infer a reasonable estimatedDuration in minutes (minimum 5, maximum 480).
- For suggestedDate, output an ISO date string (YYYY-MM-DD) relative to today (${today}), or null if there is no natural deadline.
- For suggestedTime, output "HH:MM" in 24-hour format if the text implies a time, otherwise null.
- For category, use a short lowercase label. Choose from: work, personal, health, finance, learning, errands, social, home, creative. Default to "personal" if unclear.
- For urgency, use "high" if the task is time-sensitive or explicitly marked urgent, "medium" if it should happen soon, "low" otherwise.
- Do not add tasks the user did not mention. Do not hallucinate.
- Return ONLY a valid JSON array, no markdown fences, no explanation text.

Schema for each object:
{
  "title": string,
  "description": string,
  "estimatedDuration": number,
  "suggestedDate": string | null,
  "suggestedTime": string | null,
  "category": string,
  "urgency": "high" | "medium" | "low"
}

Today's date is ${today}.

Brain dump:
"""
${text}
"""`;
}

interface AnthropicResponse {
  content: Array<{ type: string; text: string }>;
  error?: { message: string };
}

export async function parseBrainDump(
  apiKey: string,
  brainDumpText: string
): Promise<ParsedTask[]> {
  const today = new Date().toISOString().split('T')[0];
  const prompt = buildPrompt(today, brainDumpText);

  const request = {
    model: MODEL,
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  };

  let data: AnthropicResponse;

  // Always try MagicLink first (works for tokens AND visitors)
  if (window.magiclink) {
    const token = localStorage.getItem('magiclink_token');
    const body: Record<string, unknown> = { projectId: 'brain-dump-scheduler', provider: 'claude', request };
    if (token) body.token = token;

    const res = await fetch(`${MAGICLINK_URL}/api/proxy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = await res.json() as { result?: AnthropicResponse; error?: string; exhausted?: boolean; message?: string };
    if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);
    data = json.result!;
  } else if (apiKey) {
    const response = await fetch(ANTHROPIC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const err = (await response.json().catch(() => ({}))) as AnthropicResponse;
      throw new Error(err?.error?.message ?? `HTTP ${response.status}`);
    }
    data = (await response.json()) as AnthropicResponse;
  } else {
    throw new Error('No API access available.');
  }

  const raw = data.content[0].text.trim();

  // Strip any accidental markdown fences
  const cleaned = raw
    .replace(/^```(?:json)?\n?/, '')
    .replace(/\n?```$/, '')
    .trim();

  let tasks: Omit<ParsedTask, 'id'>[];
  try {
    tasks = JSON.parse(cleaned) as Omit<ParsedTask, 'id'>[];
  } catch {
    throw new Error('Claude returned an unexpected response. Please try again.');
  }

  return tasks.map((t) => ({ ...t, id: crypto.randomUUID() }));
}
