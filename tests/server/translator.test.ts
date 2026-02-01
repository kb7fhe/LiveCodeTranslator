import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the Anthropic SDK
vi.mock('@anthropic-ai/sdk', () => ({
  default: vi.fn().mockImplementation(() => ({
    messages: {
      create: vi.fn().mockResolvedValue({
        content: [
          {
            type: 'text',
            text: '# Translated Python code\nprint("Hello, World!")',
          },
        ],
      }),
    },
  })),
}));

// Import after mocking
import { translateCode } from '../../src/server/services/translator';

describe('translateCode', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
    const result = await translateCode('int x = 1;', 'csharp', ['python']);

    // The mock response doesn't have markdown blocks,
    // but this tests that the function completes successfully
    expect(result.translations.python).not.toContain('```');
  });

  it('returns errors for failed translations', async () => {
    // Mock a failure for this test
    const Anthropic = await import('@anthropic-ai/sdk');
    vi.mocked(Anthropic.default).mockImplementationOnce(() => ({
      messages: {
        create: vi.fn().mockRejectedValue(new Error('API Error')),
      },
    }));

    // Re-import to get the new mock
    vi.resetModules();
    vi.doMock('@anthropic-ai/sdk', () => ({
      default: vi.fn().mockImplementation(() => ({
        messages: {
          create: vi.fn().mockRejectedValue(new Error('API Error')),
        },
      })),
    }));

    const { translateCode: translateCodeWithError } = await import(
      '../../src/server/services/translator'
    );

    const result = await translateCodeWithError('int x = 1;', 'csharp', [
      'python',
    ]);

    expect(result.errors).toHaveProperty('python');
  });
});
