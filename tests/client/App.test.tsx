import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../../src/client/App';

// Mock Monaco Editor
vi.mock('@monaco-editor/react', () => ({
  default: ({ value, onChange }: { value: string; onChange?: (v: string) => void }) => (
    <textarea
      data-testid="mock-editor"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
    />
  ),
}));

// Mock the translation hook
vi.mock('../../src/client/hooks/useTranslation', () => ({
  useTranslation: () => ({
    isLoading: false,
    translations: {
      python: '# Python translation',
      rust: '// Rust translation',
      java: '// Java translation',
      cpp: '// C++ translation',
    },
    errors: {},
    targetLanguages: ['python', 'rust', 'java', 'cpp'],
    retry: vi.fn(),
  }),
}));

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the header with title', () => {
    render(<App />);
    expect(screen.getByText('LiveCodeTranslator')).toBeDefined();
  });

  it('renders the source code section', () => {
    render(<App />);
    expect(screen.getByText('Source Code')).toBeDefined();
  });

  it('renders the translations section', () => {
    render(<App />);
    expect(screen.getByText('Translations')).toBeDefined();
  });

  it('renders language badges for all target languages', () => {
    render(<App />);
    // Use getAllByText since languages appear in both selector and badges
    const pythonElements = screen.getAllByText('Python');
    const rustElements = screen.getAllByText('Rust');
    const javaElements = screen.getAllByText('Java');
    const cppElements = screen.getAllByText('C++');

    // Each language should appear at least twice (selector option + badge)
    expect(pythonElements.length).toBeGreaterThanOrEqual(2);
    expect(rustElements.length).toBeGreaterThanOrEqual(2);
    expect(javaElements.length).toBeGreaterThanOrEqual(2);
    expect(cppElements.length).toBeGreaterThanOrEqual(2);
  });

  it('renders a language selector', () => {
    render(<App />);
    const selector = screen.getByRole('combobox');
    expect(selector).toBeDefined();
  });
});
