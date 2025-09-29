/* Background service worker: context menus, messaging, and side panel control */
/// <reference types="chrome" />
import type { RuntimeMessage } from '../lib/messaging';

function hasTypeKey(msg: unknown): msg is { type?: string } {
  return typeof msg === 'object' && msg !== null && 'type' in (msg as any);
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'ai_analyze_page',
    title: 'AI: Analyze Page',
    contexts: ['all'],
  });
});

chrome.contextMenus.onClicked.addListener(
  async (info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab) => {
    if (info.menuItemId === 'ai_analyze_page' && tab?.id) {
      chrome.tabs.sendMessage(tab.id, { type: 'ANALYZE_PAGE' });
    }
  },
);

// Bidirectional messaging hub
chrome.runtime.onMessage.addListener(
  (
    message: RuntimeMessage | unknown,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: unknown) => void,
  ) => {
    (async () => {
      const m = hasTypeKey(message) ? message : {};
      if (m.type === 'PING') {
        sendResponse({ ok: true, source: 'background' });
        return;
      }
      if (m.type === 'OPEN_SIDEPANEL') {
        if (sender?.tab?.id) {
          await chrome.sidePanel.setOptions({
            tabId: sender.tab.id,
            path: 'sidepanel.html',
            enabled: true,
          });
          await chrome.sidePanel.open({ tabId: sender.tab.id });
        }
        sendResponse({ ok: true });
        return;
      }
    })();
    // Keep message channel open for async
    return true;
  },
);
