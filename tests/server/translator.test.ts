import { describe, it, expect, vi, beforeEach } from 'vitest';

// Hoist the mock creation so it's available before the mock factory runs
const mockCreate = vi.hoisted(() => vi.fn());

// Mock the Anthropic SDK
vi.mock('@anthropic-ai/sdk', () => ({
  default: vi.fn().mockImplementation(() => ({
    messages: {
      create: mockCreate,
    },
  })),
}));

// Import after mocking
import { translateCode } from '../../src/server/services/translator';

describe('translateCode', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default successful response
    mockCreate.mockResolvedValue({
      content: [
        {
          type: 'text',
          text: '# Translated Python code\nprint("Hello, World!")',
        },
      ],
    });
  });

  it('translates code to target languages', async () => {
    const result = await translateCode(
      'Console.WriteLine("Hello");',
      'csharp',
      ['python']
    );

    expect(result.translations).toHaveProperty('python');
    expect(result.errors).toEqual({});
  });

  it('handles multiple target languages in parallel', async () => {
    const result = await translateCode(
      'Console.WriteLine("Hello");',
      'csharp',
      ['python', 'rust', 'java']
    );

    expect(Object.keys(result.translations)).toHaveLength(3);
    expect(result.translations).toHaveProperty('python');
    expect(result.translations).toHaveProperty('rust');
    expect(result.translations).toHaveProperty('java');
  });

  it('removes markdown code blocks from response', async () => {
    mockCreate.mockResolvedValue({
      content: [
        {
          type: 'text',
          text: '```python\nprint("Hello")\n```',
        },
      ],
    });

    const result = await translateCode('int x = 1;', 'csharp', ['python']);

    expect(result.translations.python).not.toContain('```');
    expect(result.translations.python).toContain('print("Hello")');
  });

  it('returns errors for failed translations', async () => {
    mockCreate.mockRejectedValue(new Error('API Error'));

    const result = await translateCode('int x = 1;', 'csharp', ['python']);

    expect(result.errors).toHaveProperty('python');
    expect(result.errors.python).toBe('API Error');
    expect(result.translations).toEqual({});
  });

  it('handles partial failures gracefully', async () => {
    // First call succeeds, second fails
    mockCreate
      .mockResolvedValueOnce({
        content: [{ type: 'text', text: 'print("Hello")' }],
      })
      .mockRejectedValueOnce(new Error('Rust translation failed'));

    const result = await translateCode('Console.WriteLine("Hello");', 'csharp', [
      'python',
      'rust',
    ]);

    expect(result.translations).toHaveProperty('python');
    expect(result.errors).toHaveProperty('rust');
  });
});
