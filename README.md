## AI Browser Automation (Chrome Extension MV3)

React 18 + TypeScript + Webpack + Tailwind. Supports OpenAI/Anthropic/Gemini with local key storage.

### Install
```bash
npm install
```

### Develop
```bash
npm run dev
```
This builds into `dist/` with watch. Load the `dist` directory as an unpacked extension in Chrome.

### Build
```bash
npm run build
```

### Load in Chrome
1. Open chrome://extensions
2. Enable Developer mode
3. Load unpacked → select `dist` folder

### Configure API Keys
Open the extension Options page. Enter your API keys (stored locally via chrome.storage).

### Project Structure
- `src/background/` service worker (context menu, side panel, messaging)
- `src/content/` content script (extraction & automation hooks)
- `src/ui/` React UIs for popup/sidepanel/options
- `src/lib/` shared libs (storage, messaging, ai clients, prompt)

### Features (Phase 1)
- Side panel chat with stubbed assistant echo
- Analyze Page quick action from popup/context menu
- Local settings & API key storage

### Roadmap
Phase 2: Automation primitives (click/type/scroll), smart page summary
Phase 3: Workflow templates, form filling, tab organization
Phase 4: Performance, testing coverage, error states
Phase 5: Advanced AI features (tools, memory)

### Testing
```bash
npm test
```

### Security
- Keys stored locally only
- HTTPS-only API calls
- No analytics

# AI-extension