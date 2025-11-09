// Next.js API route: GET /api/health
// Health check endpoint

const PIPELINE_ID = process.env.PIPELINE_ID || 'pip_qpUgXycjWF6YMeSL';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const DAYDREAM_API_KEY = process.env.DAYDREAM_API_KEY?.trim();

  return res.status(200).json({ 
    status: 'ok', 
    hasApiKey: !!DAYDREAM_API_KEY,
    pipelineId: PIPELINE_ID,
    environment: process.env.VERCEL_ENV || 'development'
  });
}

