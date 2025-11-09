// Root handler - serves index.html
const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Try to read index.html from the project root
    // In Vercel, files are in /var/task or relative to the function
    const htmlPath = path.join(__dirname, '..', 'index.html');
    const html = fs.readFileSync(htmlPath, 'utf8');
    
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(html);
  } catch (error) {
    console.error('Error reading index.html:', error);
    console.error('__dirname:', __dirname);
    console.error('process.cwd():', process.cwd());
    
    // Fallback: return a simple error page
    res.status(500).send(`
      <!DOCTYPE html>
      <html>
      <head><title>Error</title></head>
      <body>
        <h1>Error loading page</h1>
        <p>Could not find index.html</p>
        <pre>${error.message}</pre>
        <p>__dirname: ${__dirname}</p>
        <p>cwd: ${process.cwd()}</p>
      </body>
      </html>
    `);
  }
};

