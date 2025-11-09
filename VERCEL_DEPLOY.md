# 🚀 Deploy to Vercel

This app is now configured to deploy to Vercel using serverless functions!

## Quick Deploy

### Option 1: Vercel CLI (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```
   
   Follow the prompts. For production:
   ```bash
   vercel --prod
   ```

### Option 2: GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect the configuration

## 🔐 Set Environment Variables

**CRITICAL:** You must set your API key in Vercel's environment variables!

### Via Vercel Dashboard:

1. Go to your project on [vercel.com](https://vercel.com)
2. Click **Settings** → **Environment Variables**
3. Add these variables:

   ```
   DAYDREAM_API_KEY = sk_WqTbhKdqf7HY1avFDw2ByrkAg7gpvRKtq85tHeCnBqQs8LVQtGPYvFcnbMf85szS
   PIPELINE_ID = pip_qpUgXycjWF6YMeSL
   ```

4. Select environments: **Production**, **Preview**, **Development**
5. Click **Save**

### Via Vercel CLI:

```bash
vercel env add DAYDREAM_API_KEY
# Paste your key when prompted
# Select: Production, Preview, Development

vercel env add PIPELINE_ID
# Enter: pip_qpUgXycjWF6YMeSL
# Select: Production, Preview, Development
```

## 📁 Project Structure

```
.
├── api/
│   ├── streams.js          # POST /api/streams
│   ├── streams/
│   │   └── [streamId].js   # PATCH /api/streams/:streamId
│   └── health.js           # GET /api/health
├── index.html              # Frontend app
├── vercel.json             # Vercel configuration
└── package.json
```

## ✅ Verify Deployment

After deploying:

1. **Check health endpoint:**
   ```
   https://your-app.vercel.app/api/health
   ```
   Should return: `{"status":"ok","hasApiKey":true,...}`

2. **Test in browser:**
   - Open your deployed URL
   - Try creating a stream
   - Check browser console for errors

## 🔄 Redeploy After Changes

```bash
# Make your changes, then:
vercel --prod
```

Or push to GitHub if you have auto-deploy enabled.

## 🐛 Troubleshooting

**401 Unauthorized:**
- Check that `DAYDREAM_API_KEY` is set in Vercel environment variables
- Make sure you selected all environments (Production, Preview, Development)
- Redeploy after adding environment variables

**404 on API routes:**
- Check that `api/` directory structure is correct
- Verify `vercel.json` is in the root

**CORS errors:**
- The `vercel.json` includes CORS headers
- Make sure your frontend uses the correct API base URL

## 📝 Notes

- **Serverless functions:** Each API route is a separate serverless function
- **No server needed:** Vercel handles everything automatically
- **HTTPS included:** Vercel provides free SSL certificates
- **Auto-scaling:** Functions scale automatically with traffic
- **Free tier:** Vercel's free tier is generous for most use cases

## 🔗 Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Serverless Functions Guide](https://vercel.com/docs/functions)
- [Environment Variables](https://vercel.com/docs/environment-variables)

