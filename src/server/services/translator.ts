import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const LANGUAGE_NAMES: Record<string, string> = {
  csharp: 'C#',
  python: 'Python',
  rust: 'Rust',
  java: 'Java',
  cpp: 'C++',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  go: 'Go',
};

interface TranslationResult {
  translations: Record<string, string>;
  errors: Record<string, string>;
}

export async function translateCode(
  code: string,
  sourceLanguage: string,
  targetLanguages: string[]
): Promise<TranslationResult> {
  const sourceName = LANGUAGE_NAMES[sourceLanguage] || sourceLanguage;
  const translations: Record<string, string> = {};
  const errors: Record<string, string> = {};

  // Translate to all target languages in parallel
  const translationPromises = targetLanguages.map(async (targetLang) => {
    const targetName = LANGUAGE_NAMES[targetLang] || targetLang;

    try {
      const translated = await translateSingle(code, sourceName, targetName);
      translations[targetLang] = translated;
    } catch (error) {
      console.error(`Translation to ${targetLang} failed:`, error);
      errors[targetLang] =
        error instanceof Error ? error.message : 'Translation failed';
    }
  });

  await Promise.all(translationPromises);

  return { translations, errors };
}

async function translateSingle(
  code: string,
  sourceLanguage: string,
  targetLanguage: string
): Promise<string> {
  const prompt = `Translate the following ${sourceLanguage} code to ${targetLanguage}.

IMPORTANT RULES:
1. Output ONLY the translated code, no explanations or markdown code blocks
2. Preserve the same functionality and logic
3. Use idiomatic patterns for ${targetLanguage}
4. Include necessary imports/includes
5. The code must be syntactically correct and compilable/runnable
6. Preserve comments, translating them if appropriate
7. Use appropriate naming conventions for ${targetLanguage}

${sourceLanguage} code:
${code}

${targetLanguage} translation:`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  // Extract text from response
  const textContent = response.content.find((block) => block.type === 'text');
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No text response from translation API');
  }

  let translatedCode = textContent.text.trim();

  // Remove markdown code blocks if present
  translatedCode = translatedCode
    .replace(/^```[\w]*\n?/gm, '')
    .replace(/```$/gm, '')
    .trim();

  return translatedCode;
}
