import type { TranslationRequest, TranslationResponse, Language } from '../types';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export async function translateCode(
  request: TranslationRequest
): Promise<TranslationResponse> {
  const response = await fetch(`${API_URL}/translate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Translation failed' }));
    throw new Error(error.message || 'Translation failed');
  }

  return response.json();
}

export function getDefaultTargetLanguages(sourceLanguage: Language): Language[] {
  const allLanguages: Language[] = ['csharp', 'python', 'rust', 'java', 'cpp'];
  return allLanguages.filter((lang) => lang !== sourceLanguage).slice(0, 4);
}
