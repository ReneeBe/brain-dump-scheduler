import type { ParsedTask } from '../types/task';

const ANTHROPIC_URL = import.meta.env.DEV
  ? '/api/anthropic/v1/messages'
  : 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-opus-4-6';

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

  const response = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    const err = (await response.json().catch(() => ({}))) as AnthropicResponse;
    throw new Error(err?.error?.message ?? `HTTP ${response.status}`);
  }

  const data = (await response.json()) as AnthropicResponse;
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
