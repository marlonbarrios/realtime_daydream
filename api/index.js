// Root handler to serve index.html
const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  // Only handle GET requests for root
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const htmlPath = path.join(process.cwd(), 'index.html');
    const html = fs.readFileSync(htmlPath, 'utf8');
    
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  } catch (error) {
    console.error('Error serving index.html:', error);
    res.status(500).json({ error: 'Failed to serve page', message: error.message });
  }
};

