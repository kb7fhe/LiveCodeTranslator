import { CodeEditor } from './CodeEditor';
import { LANGUAGES, type Language } from '../types';

interface TranslationPanelProps {
  language: Language;
  code: string;
  isLoading: boolean;
  error?: string;
}

export function TranslationPanel({
  language,
  code,
  isLoading,
  error,
}: TranslationPanelProps) {
  const languageInfo = LANGUAGES.find((l) => l.id === language);
  const displayName = languageInfo?.name || language;

  return (
    <div className="code-panel">
      <div className="code-panel-header">
        <div className="code-panel-title">
          <span className="language-badge">{displayName}</span>
          <span className="status-indicator">
            <span
              className={`status-dot ${isLoading ? 'loading' : error ? 'error' : ''}`}
            />
            {isLoading ? 'Translating...' : error ? 'Error' : 'Ready'}
          </span>
        </div>
      </div>
      <div className="code-panel-body" style={{ position: 'relative' }}>
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner" />
          </div>
        )}
        {error ? (
          <div className="error-message">{error}</div>
        ) : code ? (
          <CodeEditor value={code} language={language} readOnly />
        ) : (
          <div className="placeholder-text">
            Translation will appear here...
          </div>
        )}
      </div>
    </div>
  );
}
