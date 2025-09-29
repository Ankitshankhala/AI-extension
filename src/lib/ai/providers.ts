import type { ConversationTurn } from '../storage';

export interface AiRequestOptions {
  model: string;
  apiKey: string;
  system?: string;
}

export interface AiProviderClient {
  name: string;
  chat(messages: ConversationTurn[], options: AiRequestOptions): Promise<string>;
}

export class OpenAIClient implements AiProviderClient {
  name = 'openai';
  async chat(messages: ConversationTurn[], options: AiRequestOptions): Promise<string> {
    const payload = {
      model: options.model || 'gpt-4o-mini',
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    };
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${options.apiKey}`,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`OpenAI error ${res.status}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content || '';
  }
}

export class AnthropicClient implements AiProviderClient {
  name = 'anthropic';
  async chat(messages: ConversationTurn[], options: AiRequestOptions): Promise<string> {
    const payload: {
      model: string;
      max_tokens: number;
      messages: Array<{ role: 'assistant' | 'user'; content: string }>;
    } = {
      model: options.model || 'claude-3-5-sonnet-latest',
      max_tokens: 1024,
      messages: messages.map((m) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content,
      })),
    };
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': options.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Anthropic error ${res.status}`);
    const data = await res.json();
    const content = data.content?.[0]?.text || '';
    return content;
  }
}

export class GeminiClient implements AiProviderClient {
  name = 'gemini';
  async chat(messages: ConversationTurn[], options: AiRequestOptions): Promise<string> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(options.model || 'gemini-1.5-flash')}:generateContent?key=${encodeURIComponent(options.apiKey)}`;
    const payload = {
      contents: [
        {
          role: 'user',
          parts: [{ text: messages.map((m) => `${m.role}: ${m.content}`).join('\n') }],
        },
      ],
    };
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Gemini error ${res.status}`);
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }
}

export function getProviderClient(provider: 'openai' | 'anthropic' | 'gemini'): AiProviderClient {
  switch (provider) {
    case 'openai':
      return new OpenAIClient();
    case 'anthropic':
      return new AnthropicClient();
    case 'gemini':
      return new GeminiClient();
  }
}
