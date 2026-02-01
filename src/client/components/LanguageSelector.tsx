import { LANGUAGES, type Language } from '../types';

interface LanguageSelectorProps {
  value: Language;
  onChange: (language: Language) => void;
  label?: string;
  excludeLanguages?: Language[];
}

export function LanguageSelector({
  value,
  onChange,
  label = 'Language',
  excludeLanguages = [],
}: LanguageSelectorProps) {
  const availableLanguages = LANGUAGES.filter(
    (lang) => !excludeLanguages.includes(lang.id)
  );

  return (
    <div className="language-selector">
      <label htmlFor="language-select">{label}:</label>
      <select
        id="language-select"
        value={value}
        onChange={(e) => onChange(e.target.value as Language)}
      >
        {availableLanguages.map((lang) => (
          <option key={lang.id} value={lang.id}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}
