// Next.js API route: GET /api/health
// Health check endpoint

const PIPELINE_ID = process.env.PIPELINE_ID || 'pip_qpUgXycjWF6YMeSL';

export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

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

