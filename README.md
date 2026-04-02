# Brain Dump Scheduler

Paste a free-form brain dump and Claude extracts, prioritizes, and schedules your tasks into a timeline view. Day 8 of my [50 projects challenge](https://reneebe.github.io).

**[Try it →](https://reneebe.github.io/brain-dump-scheduler)**

## How it works

1. Paste anything — a wall of text, bullet points, stream of consciousness
2. Claude extracts every actionable task with estimated duration, suggested date, urgency, and category
3. Review the tasks sorted into **Today / This Week / Later** buckets, drag them around if needed
4. Hit "Build Schedule" to see a clean timeline view

## Stack

- Vite + React + TypeScript
- Tailwind CSS
- Claude API (`claude-opus-4-6`) — direct browser access via `anthropic-dangerous-direct-browser-access`

## Running locally

```bash
npm install
npm run dev
```

You'll need a Claude API key — paste it into the app when prompted.
