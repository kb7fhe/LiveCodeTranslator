import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from './useDebounce';
import { translateCode, getDefaultTargetLanguages } from '../services/api';
import type { Language, TranslationState } from '../types';

const DEBOUNCE_DELAY = 500;

export function useTranslation(
  code: string,
  sourceLanguage: Language,
  targetLanguages?: Language[]
) {
  const [state, setState] = useState<TranslationState>({
    isLoading: false,
    translations: {} as Record<Language, string>,
    errors: {} as Record<Language, string>,
  });

  const debouncedCode = useDebounce(code, DEBOUNCE_DELAY);
  const targets = targetLanguages || getDefaultTargetLanguages(sourceLanguage);

  const performTranslation = useCallback(async () => {
    if (!debouncedCode.trim()) {
      setState({
        isLoading: false,
        translations: {} as Record<Language, string>,
        errors: {} as Record<Language, string>,
      });
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const response = await translateCode({
        code: debouncedCode,
        sourceLanguage,
        targetLanguages: targets,
      });

      setState({
        isLoading: false,
        translations: response.translations,
        errors: response.errors,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Translation failed';
      const errorState = targets.reduce(
        (acc, lang) => ({ ...acc, [lang]: errorMessage }),
        {} as Record<Language, string>
      );

      setState({
        isLoading: false,
        translations: {} as Record<Language, string>,
        errors: errorState,
      });
    }
  }, [debouncedCode, sourceLanguage, targets]);

  useEffect(() => {
    performTranslation();
  }, [performTranslation]);

  return {
    ...state,
    targetLanguages: targets,
    retry: performTranslation,
  };
}
