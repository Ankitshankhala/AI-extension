import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '../../styles/tailwind.css';
import { Button } from '../components/Button';
import { sendMessage } from '@lib/messaging';

function Popup() {
  const [status, setStatus] = useState<string>('Ready');
  useEffect(() => {
    setStatus('Ready');
  }, []);
  return (
    <div className="w-[340px] p-3 space-y-3 text-sm">
      <h1 className="text-base font-semibold">AI Automation</h1>
      <div className="text-gray-600">{status}</div>
      <div className="flex gap-2">
        <Button onClick={() => sendMessage({ type: 'OPEN_SIDEPANEL' })}>Open Chat</Button>
        <Button variant="ghost" onClick={() => sendMessage({ type: 'ANALYZE_PAGE' })}>
          Analyze Page
        </Button>
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(<Popup />);
