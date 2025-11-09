# StreamDiffusion Playground - Deployment Guide

This is a web application with a secure backend proxy that keeps your API key safe on the server.

## 🔒 Security

**The API key is stored securely on the server** - never exposed to clients. The frontend makes requests to your backend proxy (`/api/*`), which forwards them to Daydream API with the key.

## Requirements

- **Node.js** (v14 or higher) - for the backend server
- **HTTPS is required** - WebRTC (webcam access) only works over HTTPS or localhost
- **Daydream API key** - stored in `.env` file (never committed to git)

## Quick Start (Development)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up your API key:**
   ```bash
   # Copy the example file
   cp env.example .env
   
   # Edit .env and add your actual API key
   # DAYDREAM_API_KEY=your_actual_key_here
   ```

3. **Start the server:**
   ```bash
   npm start
   # Or for development with auto-reload:
   npm run dev
   ```

4. **Open in browser:**
   ```
   http://localhost:3000
   ```

The server will:
- Serve the `index.html` file
- Proxy API requests to Daydream API with your secure key
- Handle CORS automatically

## Production Deployment Options

### Option 1: Vercel (Recommended - Easiest & Free)

**Quick Deploy:**
```bash
npm i -g vercel
vercel
```

**Important:** Set environment variables in Vercel dashboard:
- `DAYDREAM_API_KEY` - Your Daydream API key
- `PIPELINE_ID` - pip_qpUgXycjWF6YMeSL (optional, has default)

See [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md) for detailed instructions.

**Benefits:**
- ✅ Free HTTPS/SSL
- ✅ Auto-scaling serverless functions
- ✅ Easy GitHub integration
- ✅ No server management needed

**Heroku:**
```bash
heroku create your-app-name
heroku config:set DAYDREAM_API_KEY=your_key_here
git push heroku main
```

**Railway/Render/Fly.io:**
- Deploy the Node.js app
- Set `DAYDREAM_API_KEY` in environment variables
- The app will serve both the frontend and API proxy

**Traditional VPS (PM2):**
```bash
# Install PM2
npm install -g pm2

# Start the app
pm2 start server.js --name streamdiffusion

# Save PM2 configuration
pm2 save
pm2 startup
```

### Option 2: Static Hosting (Less Secure - API Key Exposed)

**Vercel:**
```bash
npm i -g vercel
vercel
```

**Netlify:**
- Drag and drop the `index.html` file to [Netlify Drop](https://app.netlify.com/drop)
- Or use Netlify CLI: `netlify deploy --prod`

**GitHub Pages:**
- Push to a GitHub repository
- Enable GitHub Pages in repository settings
- Note: GitHub Pages provides HTTPS automatically

### Option 3: Traditional Web Server (with Node.js Backend)

**Nginx:**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    root /path/to/your/files;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Apache:**
```apache
<VirtualHost *:80>
    ServerName your-domain.com
    Redirect permanent / https://your-domain.com/
</VirtualHost>

<VirtualHost *:443>
    ServerName your-domain.com
    DocumentRoot /path/to/your/files
    
    SSLEngine on
    SSLCertificateFile /path/to/cert.pem
    SSLCertificateKeyFile /path/to/key.pem
    
    <Directory /path/to/your/files>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

### Option 4: Docker (Node.js Backend)

The included `Dockerfile` runs the Node.js server:

```bash
# Build
docker build -t streamdiffusion-app .

# Run (set API key via environment variable)
docker run -p 3000:3000 -e DAYDREAM_API_KEY=your_key_here streamdiffusion-app

# Or use docker-compose (create docker-compose.yml)
```

**docker-compose.yml example:**
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DAYDREAM_API_KEY=${DAYDREAM_API_KEY}
      - PIPELINE_ID=${PIPELINE_ID:-pip_qpUgXycjWF6YMeSL}
    env_file:
      - .env
```

## SSL Certificate Setup

For production, you'll need an SSL certificate:

1. **Let's Encrypt (Free):**
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

2. **Cloudflare:** Use Cloudflare's free SSL proxy

3. **Cloud Providers:** Most cloud providers offer free SSL certificates

## Important Notes

- **API Key Security:** The API key is stored in `.env` file (server-side only)
- **Never commit `.env`** - it's in `.gitignore` for your protection
- The backend proxy (`server.js`) forwards requests to Daydream API
- The app embeds Livepeer player from `https://lvpr.tv` - works over HTTPS
- WebRTC requires HTTPS (except localhost for development)
- All API calls go through `/api/*` endpoints on your server

## Troubleshooting

**Webcam not working:**
- Ensure you're using HTTPS (or localhost)
- Check browser permissions for camera/microphone
- Some browsers require user interaction before accessing media

**CORS errors:**
- The backend server includes CORS middleware - should work automatically
- Make sure you're accessing via the server URL, not `file://`

**API key not working:**
- Check that `.env` file exists and contains `DAYDREAM_API_KEY=your_key`
- Verify the server started successfully (check console for "API key configured: ✅ Yes")
- Test the health endpoint: `curl http://localhost:3000/api/health`

**Server won't start:**
- Make sure Node.js is installed: `node --version`
- Install dependencies: `npm install`
- Check that port 3000 (or your custom PORT) is available

---

## Credits

**Hacked by [Marlon Barrios Solano](https://github.com/marlonbarrios)**

Built with ❤️ for the StreamDiffusion community.
