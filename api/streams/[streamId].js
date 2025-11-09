// Vercel serverless function: PATCH /api/streams/:streamId
// Updates stream parameters via Daydream API

module.exports = async function handler(req, res) {
  // Only allow PATCH
  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const DAYDREAM_API_KEY = process.env.DAYDREAM_API_KEY?.trim();

  if (!DAYDREAM_API_KEY) {
    return res.status(500).json({ 
      error: 'API key not configured on server',
      message: 'Please set DAYDREAM_API_KEY in Vercel environment variables'
    });
  }

  const { streamId } = req.query;

  if (!streamId) {
    return res.status(400).json({ error: 'Stream ID is required' });
  }

  try {
    const response = await fetch(`https://api.daydream.live/v1/streams/${streamId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DAYDREAM_API_KEY}`,
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ Daydream API error:', response.status, data);
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('❌ Error updating stream:', error);
    return res.status(500).json({ 
      error: 'Failed to update stream', 
      message: error.message 
    });
  }
}

