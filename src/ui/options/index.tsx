import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '../../styles/tailwind.css';
import { Button } from '../components/Button';
import { getSettings, saveSettings, type SettingsState } from '@lib/storage';

function Options() {
  const [settings, setSettings] = useState<SettingsState | null>(null);

  useEffect(() => {
    getSettings().then(setSettings);
  }, []);

  const update = (partial: Partial<SettingsState>) =>
    settings && setSettings({ ...settings, ...partial });
  const save = async () => {
    if (settings) await saveSettings(settings);
  };

  if (!settings) return <div className="p-4 text-sm">Loading...</div>;
  return (
    <div className="max-w-xl p-4 space-y-4 text-sm">
      <h1 className="text-lg font-semibold">Settings</h1>
      <div>
        <label className="block text-gray-700 mb-1">Active Provider</label>
        <select
          className="border rounded-md px-2 h-9"
          value={settings.activeProvider}
          onChange={(e) =>
            update({ activeProvider: e.target.value as SettingsState['activeProvider'] })
          }
        >
          <option value="openai">OpenAI</option>
          <option value="anthropic">Anthropic</option>
          <option value="gemini">Google Gemini</option>
        </select>
      </div>
      <div>
        <label className="block text-gray-700 mb-1">OpenAI API Key</label>
        <input
          className="border rounded-md px-2 h-9 w-full"
          type="password"
          value={settings.openaiKey || ''}
          onChange={(e) => update({ openaiKey: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-gray-700 mb-1">Anthropic API Key</label>
        <input
          className="border rounded-md px-2 h-9 w-full"
          type="password"
          value={settings.anthropicKey || ''}
          onChange={(e) => update({ anthropicKey: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-gray-700 mb-1">Gemini API Key</label>
        <input
          className="border rounded-md px-2 h-9 w-full"
          type="password"
          value={settings.geminiKey || ''}
          onChange={(e) => update({ geminiKey: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-gray-700 mb-1">Default Model</label>
        <input
          className="border rounded-md px-2 h-9 w-full"
          value={settings.model || ''}
          onChange={(e) => update({ model: e.target.value })}
        />
      </div>
      <Button onClick={save}>Save</Button>
      <div className="text-gray-500">Keys are stored locally using Chrome storage.</div>
    </div>
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(<Options />);
