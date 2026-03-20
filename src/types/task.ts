export type Bucket = 'today' | 'this-week' | 'later';
export type Urgency = 'high' | 'medium' | 'low';
export type Phase = 'dump' | 'prioritize' | 'timeline';

export interface ParsedTask {
  id: string;
  title: string;
  description: string;
  estimatedDuration: number; // minutes
  suggestedDate: string | null; // YYYY-MM-DD
  suggestedTime: string | null; // HH:MM 24h
  category: string;
  urgency: Urgency;
}

export interface ScheduledTask extends ParsedTask {
  bucket: Bucket;
  order: number;
}
