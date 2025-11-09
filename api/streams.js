// Vercel serverless function: POST /api/streams
// Creates a new stream via Daydream API

const PIPELINE_ID = process.env.PIPELINE_ID || 'pip_qpUgXycjWF6YMeSL';

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const DAYDREAM_API_KEY = process.env.DAYDREAM_API_KEY?.trim();

  if (!DAYDREAM_API_KEY) {
    console.error('❌ API key not configured - request rejected');
    return res.status(500).json({ 
      error: 'API key not configured on server',
      message: 'Please set DAYDREAM_API_KEY in Vercel environment variables'
    });
  }

  // Verify the key is not a placeholder
  if (DAYDREAM_API_KEY.includes('your_daydream') || DAYDREAM_API_KEY.includes('REPLACE')) {
    console.error('❌ API key appears to be a placeholder!');
    return res.status(500).json({ 
      error: 'API key is a placeholder',
      message: 'Please set a valid DAYDREAM_API_KEY in Vercel environment variables'
    });
  }

  try {
    const requestBody = {
      pipeline_id: PIPELINE_ID,
      ...req.body, // Allow additional params from client
    };

    console.log('📤 Creating stream with pipeline:', PIPELINE_ID);

    const response = await fetch('https://api.daydream.live/v1/streams', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DAYDREAM_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ Daydream API error:', response.status, data);
      return res.status(response.status).json({
        ...data,
        _debug: {
          message: 'Request forwarded to Daydream API',
          status: response.status,
          apiKeyConfigured: !!DAYDREAM_API_KEY,
        }
      });
    }

    console.log('✅ Stream created successfully:', data.id);
    return res.status(200).json(data);
  } catch (error) {
    console.error('❌ Error creating stream:', error);
    return res.status(500).json({ 
      error: 'Failed to create stream', 
      message: error.message,
      _debug: {
        apiKeyConfigured: !!DAYDREAM_API_KEY,
      }
    });
  }
}

