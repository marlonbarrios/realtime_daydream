// Secure backend proxy for Daydream API
// This keeps your API key on the server, never exposed to clients

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files (index.html)

// Get API key from environment variable
const DAYDREAM_API_KEY = process.env.DAYDREAM_API_KEY?.trim();
const PIPELINE_ID = process.env.PIPELINE_ID || 'pip_qpUgXycjWF6YMeSL';

if (!DAYDREAM_API_KEY) {
  console.error('❌ ERROR: DAYDREAM_API_KEY not set in environment variables!');
  console.error('   Create a .env file with: DAYDREAM_API_KEY=your_key_here');
  console.error('   Or set it as an environment variable before starting the server');
} else {
  // Show first 8 chars for verification (not the full key)
  const keyPreview = DAYDREAM_API_KEY.substring(0, 8) + '...';
  console.log(`✅ API key loaded: ${keyPreview}`);
}

// Proxy endpoint: Create stream
app.post('/api/streams', async (req, res) => {
  if (!DAYDREAM_API_KEY) {
    console.error('❌ API key not configured - request rejected');
    return res.status(500).json({ 
      error: 'API key not configured on server',
      message: 'Please set DAYDREAM_API_KEY in .env file or environment variables'
    });
  }

  try {
    const requestBody = {
      pipeline_id: PIPELINE_ID,
      ...req.body, // Allow additional params from client
    };

    console.log('📤 Creating stream with pipeline:', PIPELINE_ID);
    console.log('🔑 API Key length:', DAYDREAM_API_KEY?.length || 0);
    console.log('🔑 API Key preview:', DAYDREAM_API_KEY ? (DAYDREAM_API_KEY.substring(0, 8) + '...' + DAYDREAM_API_KEY.substring(DAYDREAM_API_KEY.length - 4)) : 'NOT SET');
    
    // Verify the key is what we expect
    if (!DAYDREAM_API_KEY || DAYDREAM_API_KEY.includes('your_daydream') || DAYDREAM_API_KEY.includes('REPLACE')) {
      console.error('❌ API key appears to be a placeholder!');
      return res.status(500).json({ 
        error: 'API key is a placeholder',
        message: 'Please set a valid DAYDREAM_API_KEY in your .env file'
      });
    }

    const authHeader = `Bearer ${DAYDREAM_API_KEY}`;
    console.log('🔐 Auth header length:', authHeader.length);
    console.log('📦 Request body:', JSON.stringify(requestBody));

    const response = await fetch('https://api.daydream.live/v1/streams', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
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
          apiKeyLength: DAYDREAM_API_KEY?.length || 0,
        }
      });
    }

    console.log('✅ Stream created successfully:', data.id);
    res.json(data);
  } catch (error) {
    console.error('❌ Error creating stream:', error);
    res.status(500).json({ 
      error: 'Failed to create stream', 
      message: error.message,
      _debug: {
        apiKeyConfigured: !!DAYDREAM_API_KEY,
      }
    });
  }
});

// Proxy endpoint: Update stream parameters
app.patch('/api/streams/:streamId', async (req, res) => {
  if (!DAYDREAM_API_KEY) {
    return res.status(500).json({ error: 'API key not configured on server' });
  }

  const { streamId } = req.params;

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
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error('Error updating stream:', error);
    res.status(500).json({ error: 'Failed to update stream', message: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    hasApiKey: !!DAYDREAM_API_KEY,
    pipelineId: PIPELINE_ID 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 API key configured: ${DAYDREAM_API_KEY ? '✅ Yes' : '❌ No'}`);
  console.log(`🔧 Pipeline ID: ${PIPELINE_ID}`);
});

