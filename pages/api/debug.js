// Debug endpoint to check environment variables (without exposing the key)
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const DAYDREAM_API_KEY = process.env.DAYDREAM_API_KEY;
  const PIPELINE_ID = process.env.PIPELINE_ID;
  
  return res.status(200).json({
    hasApiKey: !!DAYDREAM_API_KEY,
    apiKeyLength: DAYDREAM_API_KEY?.length || 0,
    apiKeyPreview: DAYDREAM_API_KEY ? `${DAYDREAM_API_KEY.substring(0, 8)}...` : 'NOT SET',
    pipelineId: PIPELINE_ID || 'NOT SET',
    nodeVersion: process.version,
    vercelEnv: process.env.VERCEL_ENV || 'not set',
    allEnvKeys: Object.keys(process.env).filter(k => k.includes('DAYDREAM') || k.includes('PIPELINE'))
  });
}

