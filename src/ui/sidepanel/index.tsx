import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '../../styles/tailwind.css';
import { Button } from '../components/Button';
import { getSettings, type ConversationTurn, saveConversation } from '@lib/storage';
import type { RuntimeMessage } from '@lib/messaging';
import { chatWithActiveProvider } from '@lib/ai/client';
import { buildSystemPrompt } from '@lib/prompt';

function useConversation(): [
  ConversationTurn[],
  React.Dispatch<React.SetStateAction<ConversationTurn[]>>,
] {
  const [history, setHistory] = useState<ConversationTurn[]>([]);
  return [history, setHistory];
}

function SidePanel() {
  const [, setSettings] = useState<unknown>(null);
  const [history, setHistory] = useConversation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [pageCtx, setPageCtx] = useState<{ url?: string; title?: string } | null>(null);

  useEffect(() => {
    getSettings().then(setSettings);
    const onMsg = async (message: RuntimeMessage) => {
      if (message?.type === 'CONTENT_EXTRACTED') {
        setPageCtx({ url: message.payload.url, title: message.payload.title });
        const system = buildSystemPrompt({
          url: message.payload.url,
          title: message.payload.title,
        });
        const prompt: ConversationTurn[] = [
          { role: 'system', content: system, timestamp: Date.now() },
          {
            role: 'user',
            content: `Summarize this page succinctly in bullet points:\n\n${message.payload.content}`,
            timestamp: Date.now(),
          },
        ];
        setBusy(true);
        try {
          const reply = await chatWithActiveProvider(prompt);
          setHistory((prev) => [
            ...prev,
            ...prompt.slice(1),
            { role: 'assistant', content: reply, timestamp: Date.now() },
          ]);
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : String(e);
          setHistory((prev: ConversationTurn[]) => [
            ...prev,
            { role: 'assistant', content: `Error: ${msg}`, timestamp: Date.now() },
          ]);
        } finally {
          setBusy(false);
        }
      }
    };
    chrome.runtime.onMessage.addListener(onMsg);
    return () => chrome.runtime.onMessage.removeListener(onMsg);
  }, [setHistory]);

  const send = async () => {
    const text = inputRef.current?.value?.trim();
    if (!text) return;
    const nextHistory: ConversationTurn[] =
      history.length === 0
        ? [
            {
              role: 'system',
              content: buildSystemPrompt(pageCtx || undefined),
              timestamp: Date.now(),
            },
          ]
        : [...history];
    nextHistory.push({ role: 'user', content: text, timestamp: Date.now() });
    if (inputRef.current) inputRef.current.value = '';
    setBusy(true);
    try {
      const reply = await chatWithActiveProvider(nextHistory);
      nextHistory.push({ role: 'assistant', content: reply, timestamp: Date.now() });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      nextHistory.push({ role: 'assistant', content: `Error: ${msg}`, timestamp: Date.now() });
    } finally {
      setBusy(false);
    }
    setHistory(nextHistory);
    // Persist basic conversation (single thread)
    await saveConversation({ id: 'default', title: 'Default', history: nextHistory });
  };

  return (
    <div className="w-[360px] h-[600px] flex flex-col">
      <div className="p-3 border-b flex items-center justify-between">
        <div className="font-semibold">AI Chat</div>
        <Button
          variant="ghost"
          onClick={() => chrome.runtime.sendMessage({ type: 'ANALYZE_PAGE' })}
        >
          Analyze
        </Button>
      </div>
      <div className="flex-1 overflow-auto p-3 space-y-2">
        {history.map((t, i) => (
          <div key={i} className={t.role === 'user' ? 'text-right' : 'text-left'}>
            <div
              className={`inline-block px-3 py-2 rounded-md ${t.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
            >
              {t.content}
            </div>
          </div>
        ))}
        {busy && <div className="text-gray-500 text-xs">Thinking...</div>}
      </div>
      <div className="p-3 border-t flex gap-2">
        <input
          ref={inputRef}
          className="flex-1 border rounded-md px-2 h-9"
          placeholder="Type a message"
        />
        <Button onClick={send}>Send</Button>
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(<SidePanel />);
