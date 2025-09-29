// Content script entry: page analysis and automation hooks
/// <reference types="chrome" />

function hasTypeKey(msg: unknown): msg is { type?: string } {
  return typeof msg === 'object' && msg !== null && 'type' in (msg as any);
}

function extractReadableText(): string {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const parts: string[] = [];
  let node: Node | null;
  while ((node = walker.nextNode())) {
    const text = node.textContent?.trim();
    if (text && text.length > 1) parts.push(text);
  }
  return parts.join(' ').replace(/\s+/g, ' ').slice(0, 10000);
}

async function handleAnalyzePage(): Promise<void> {
  const content = extractReadableText();
  chrome.runtime.sendMessage({
    type: 'CONTENT_EXTRACTED',
    payload: { content, url: location.href, title: document.title },
  });
}

chrome.runtime.onMessage.addListener((message: unknown) => {
  const m = hasTypeKey(message) ? message : {};
  if (m.type === 'ANALYZE_PAGE') {
    handleAnalyzePage();
  }
});

// Simple heartbeat
chrome.runtime.sendMessage({ type: 'PING_FROM_CONTENT' });
