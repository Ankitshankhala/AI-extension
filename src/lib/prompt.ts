import type { ConversationTurn } from './storage';

export function buildSystemPrompt(context?: {
  url?: string;
  title?: string;
  pageSummary?: string;
}): string {
  const parts = [
    'You are an AI assistant embedded in a Chrome extension.',
    'Be concise, accurate, and avoid hallucinations.',
    'If asked to automate actions, outline the steps clearly.',
  ];
  if (context?.url) parts.push(`Current URL: ${context.url}`);
  if (context?.title) parts.push(`Title: ${context.title}`);
  if (context?.pageSummary) parts.push(`Page summary: ${context.pageSummary}`);
  return parts.join('\n');
}

export function seedConversation(system: string, user?: string): ConversationTurn[] {
  const history: ConversationTurn[] = [{ role: 'system', content: system, timestamp: Date.now() }];
  if (user) history.push({ role: 'user', content: user, timestamp: Date.now() });
  return history;
}
