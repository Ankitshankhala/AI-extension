/// <reference types="chrome" />
export type RuntimeMessage =
  | { type: 'PING' }
  | { type: 'OPEN_SIDEPANEL' }
  | { type: 'ANALYZE_PAGE' }
  | { type: 'CONTENT_EXTRACTED'; payload: { content: string; url: string; title: string } };

export function sendMessage<T = unknown>(message: RuntimeMessage): Promise<T> {
  return new Promise((resolve) => chrome.runtime.sendMessage(message, (res: T) => resolve(res)));
}
