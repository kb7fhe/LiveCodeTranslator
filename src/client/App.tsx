import { useState } from 'react';
import { CodeEditor } from './components/CodeEditor';
import { LanguageSelector } from './components/LanguageSelector';
import { TranslationGrid } from './components/TranslationGrid';
import { useTranslation } from './hooks/useTranslation';
import type { Language } from './types';

const DEFAULT_CODE = `// Type or paste your code here
// Translation will happen automatically

public class HelloWorld
{
    public static void Main(string[] args)
    {
        Console.WriteLine("Hello, World!");
    }
}`;

export default function App() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [sourceLanguage, setSourceLanguage] = useState<Language>('csharp');

  const { isLoading, translations, errors, targetLanguages } = useTranslation(
    code,
    sourceLanguage
  );

  return (
    <div className="app">
      <header className="header">
        <h1>
          <span>{'</>'}</span> LiveCodeTranslator
        </h1>
        <div className="header-controls">
          <LanguageSelector
            value={sourceLanguage}
            onChange={setSourceLanguage}
            label="Source"
          />
        </div>
      </header>

      <main className="main-content">
        <section className="source-section">
          <div className="section-header">
            <span className="section-title">Source Code</span>
            <span className="status-indicator">
              <span className={`status-dot ${isLoading ? 'loading' : ''}`} />
              {isLoading ? 'Translating...' : 'Ready'}
            </span>
          </div>
          <div className="code-panel source">
            <div className="code-panel-body">
              <CodeEditor
                value={code}
                onChange={setCode}
                language={sourceLanguage}
              />
            </div>
          </div>
        </section>

        <section style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div className="section-header">
            <span className="section-title">Translations</span>
          </div>
          <TranslationGrid
            targetLanguages={targetLanguages}
            translations={translations}
            errors={errors}
            isLoading={isLoading}
          />
        </section>
      </main>
    </div>
  );
}
