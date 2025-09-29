/// <reference types="chrome" />
export type ApiProvider = 'openai' | 'anthropic' | 'gemini';

export interface SettingsState {
  activeProvider: ApiProvider;
  openaiKey?: string;
  anthropicKey?: string;
  geminiKey?: string;
  model?: string;
}

export const defaultSettings: SettingsState = {
  activeProvider: 'openai',
  model: 'gpt-4o-mini',
};

export async function getSettings(): Promise<SettingsState> {
  return new Promise((resolve) => {
    chrome.storage.local.get(['settings'], (res: { settings?: SettingsState }) => {
      resolve({ ...defaultSettings, ...(res.settings || {}) });
    });
  });
}

export async function saveSettings(next: Partial<SettingsState>): Promise<void> {
  const current = await getSettings();
  const settings = { ...current, ...next };
  return new Promise((resolve) => {
    chrome.storage.local.set({ settings }, () => resolve());
  });
}

export interface ConversationTurn {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ConversationState {
  id: string;
  title?: string;
  history: ConversationTurn[];
}

export async function getConversations(): Promise<ConversationState[]> {
  return new Promise((resolve) => {
    chrome.storage.local.get(['conversations'], (res: { conversations?: ConversationState[] }) =>
      resolve(res.conversations || []),
    );
  });
}

export async function saveConversation(convo: ConversationState): Promise<void> {
  const list = await getConversations();
  const idx = list.findIndex((c) => c.id === convo.id);
  if (idx >= 0) list[idx] = convo;
  else list.push(convo);
  return new Promise((resolve) =>
    chrome.storage.local.set({ conversations: list }, () => resolve()),
  );
}
