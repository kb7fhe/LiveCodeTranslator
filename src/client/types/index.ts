export type Language =
  | 'csharp'
  | 'python'
  | 'rust'
  | 'java'
  | 'cpp'
  | 'javascript'
  | 'typescript'
  | 'go';

export interface LanguageInfo {
  id: Language;
  name: string;
  monacoId: string;
}

export const LANGUAGES: LanguageInfo[] = [
  { id: 'csharp', name: 'C#', monacoId: 'csharp' },
  { id: 'python', name: 'Python', monacoId: 'python' },
  { id: 'rust', name: 'Rust', monacoId: 'rust' },
  { id: 'java', name: 'Java', monacoId: 'java' },
  { id: 'cpp', name: 'C++', monacoId: 'cpp' },
  { id: 'javascript', name: 'JavaScript', monacoId: 'javascript' },
  { id: 'typescript', name: 'TypeScript', monacoId: 'typescript' },
  { id: 'go', name: 'Go', monacoId: 'go' },
];

export interface TranslationRequest {
  code: string;
  sourceLanguage: Language;
  targetLanguages: Language[];
}

export interface TranslationResponse {
  translations: Record<Language, string>;
  errors: Record<Language, string>;
}

export interface TranslationState {
  isLoading: boolean;
  translations: Record<Language, string>;
  errors: Record<Language, string>;
}
