import { Router, type Request, type Response } from 'express';
import { translateCode } from '../services/translator.js';

export const translateRouter = Router();

interface TranslateRequestBody {
  code: string;
  sourceLanguage: string;
  targetLanguages: string[];
}

translateRouter.post('/translate', async (req: Request, res: Response) => {
  try {
    const { code, sourceLanguage, targetLanguages } =
      req.body as TranslateRequestBody;

    // Validation
    if (!code || typeof code !== 'string') {
      res.status(400).json({ message: 'Code is required' });
      return;
    }

    if (!sourceLanguage || typeof sourceLanguage !== 'string') {
      res.status(400).json({ message: 'Source language is required' });
      return;
    }

    if (!Array.isArray(targetLanguages) || targetLanguages.length === 0) {
      res.status(400).json({ message: 'Target languages are required' });
      return;
    }

    // Limit code size
    if (code.length > 50000) {
      res.status(400).json({ message: 'Code exceeds maximum length (50KB)' });
      return;
    }

    // Limit number of target languages
    if (targetLanguages.length > 5) {
      res.status(400).json({ message: 'Maximum 5 target languages allowed' });
      return;
    }

    const result = await translateCode(code, sourceLanguage, targetLanguages);
    res.json(result);
  } catch (error) {
    console.error('Translation error:', error);
    const message =
      error instanceof Error ? error.message : 'Translation failed';
    res.status(500).json({ message });
  }
});
