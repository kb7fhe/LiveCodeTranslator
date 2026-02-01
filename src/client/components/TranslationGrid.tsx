import { TranslationPanel } from './TranslationPanel';
import type { Language } from '../types';

interface TranslationGridProps {
  targetLanguages: Language[];
  translations: Record<Language, string>;
  errors: Record<Language, string>;
  isLoading: boolean;
}

export function TranslationGrid({
  targetLanguages,
  translations,
  errors,
  isLoading,
}: TranslationGridProps) {
  return (
    <div className="translation-grid">
      {targetLanguages.map((language) => (
        <TranslationPanel
          key={language}
          language={language}
          code={translations[language] || ''}
          isLoading={isLoading}
          error={errors[language]}
        />
      ))}
    </div>
  );
}
