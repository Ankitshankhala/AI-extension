import { buildSystemPrompt, seedConversation } from '../src/lib/prompt';

describe('prompt builder', () => {
  test('buildSystemPrompt includes context', () => {
    const p = buildSystemPrompt({ url: 'https://example.com', title: 'Hello' });
    expect(p).toContain('https://example.com');
    expect(p).toContain('Hello');
  });

  test('seedConversation builds initial history', () => {
    const hist = seedConversation('sys', 'hi');
    expect(hist[0].role).toBe('system');
    expect(hist[1].role).toBe('user');
  });
});

