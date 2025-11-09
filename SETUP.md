# 🔒 Secure API Key Setup

## Where to Put Your API Key

**✅ SECURE (Recommended):** Store it in a `.env` file on your server

1. Copy the example file:
   ```bash
   cp env.example .env
   ```

2. Edit `.env` and add your actual API key:
   ```
   DAYDREAM_API_KEY=your_actual_api_key_here
   PIPELINE_ID=pip_qpUgXycjWF6YMeSL
   PORT=3000
   ```

3. **IMPORTANT:** The `.env` file is in `.gitignore` - it will NEVER be committed to git

4. Start the server:
   ```bash
   npm install
   npm start
   ```

## How It Works

- ✅ **API key stays on the server** - stored in `.env` file
- ✅ **Frontend never sees the key** - all API calls go through `/api/*` proxy
- ✅ **Backend adds the key** - `server.js` adds the Authorization header server-side
- ✅ **Secure by default** - key is never exposed to browser/client code

## Security Best Practices

1. **Never commit `.env`** - it's already in `.gitignore`
2. **Use environment variables in production** - set them in your hosting platform
3. **Rotate keys regularly** - if a key is exposed, generate a new one
4. **Use different keys for dev/prod** - separate environments

## Production Deployment

When deploying to production (Vercel, Heroku, Railway, etc.):

1. Set `DAYDREAM_API_KEY` in your platform's environment variables dashboard
2. The server will automatically use it (no `.env` file needed in production)
3. Example for Vercel:
   ```bash
   vercel env add DAYDREAM_API_KEY
   # Then paste your key when prompted
   ```

## Testing

Check if your API key is configured:
```bash
curl http://localhost:3000/api/health
```

Should return:
```json
{
  "status": "ok",
  "hasApiKey": true,
  "pipelineId": "pip_qpUgXycjWF6YMeSL"
}
```

