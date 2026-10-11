import express, { Request, Response } from 'express';
import cors from 'cors';
import { bypassUrl, bypassBatch } from './engine/universalBypasser.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    engine: 'Universal Safelink & Shortlink Bypasser',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Single bypass endpoint
app.post('/api/bypass', async (req: Request, res: Response): Promise<void> => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string') {
      res.status(400).json({
        success: false,
        error: 'Parameter "url" wajib disertakan dan harus berupa string.'
      });
      return;
    }

    const result = await bypassUrl(url);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Terjadi kesalahan internal saat memproses tautan.'
    });
  }
});

// Batch bypass endpoint
app.post('/api/bypass/batch', async (req: Request, res: Response): Promise<void> => {
  try {
    const { urls } = req.body;
    if (!Array.isArray(urls)) {
      res.status(400).json({
        success: false,
        error: 'Parameter "urls" wajib berupa array of strings.'
      });
      return;
    }

    const cleanUrls = urls
      .filter((u): u is string => typeof u === 'string' && u.trim().length > 0)
      .slice(0, 50); // limit batch to 50 items for safety

    const results = await bypassBatch(cleanUrls, 5);
    res.json({
      success: true,
      count: results.length,
      results
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Terjadi kesalahan saat memproses batch tautan.'
    });
  }
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[Bypass Engine] Server aktif berjalan di http://localhost:${PORT}`);
  });
}

export default app;
