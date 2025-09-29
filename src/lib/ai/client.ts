import { getSettings, type ConversationTurn } from '../storage';
import { getProviderClient } from './providers';

export async function chatWithActiveProvider(history: ConversationTurn[]): Promise<string> {
  const settings = await getSettings();
  const provider = getProviderClient(settings.activeProvider);
  const apiKey =
    settings.activeProvider === 'openai'
      ? settings.openaiKey
      : settings.activeProvider === 'anthropic'
        ? settings.anthropicKey
        : settings.geminiKey;
  if (!apiKey) throw new Error('Missing API key for selected provider');
  return provider.chat(history, { apiKey, model: settings.model || '' });
}
