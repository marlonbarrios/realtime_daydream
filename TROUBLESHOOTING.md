# 🔧 Troubleshooting Guide

## Error: "Invalid access token" (401)

This means your API key is either:
1. **Not set** - The `.env` file doesn't have a valid key
2. **Incorrect** - The key in `.env` is wrong or expired
3. **Placeholder value** - Still using `your_daydream_api_key_here`

### Fix Steps:

1. **Check your .env file:**
   ```bash
   cat .env
   ```

2. **Make sure it looks like this (with YOUR actual key):**
   ```
   DAYDREAM_API_KEY=sk_live_abc123xyz789...
   PIPELINE_ID=pip_qpUgXycjWF6YMeSL
   PORT=3000
   ```

3. **Common mistakes to avoid:**
   - ❌ `DAYDREAM_API_KEY="sk_live_..."` (no quotes needed)
   - ❌ `DAYDREAM_API_KEY = sk_live_...` (no spaces around =)
   - ❌ `DAYDREAM_API_KEY=your_daydream_api_key_here` (placeholder value)
   - ✅ `DAYDREAM_API_KEY=sk_live_abc123xyz789` (correct format)

4. **After updating .env, restart your server:**
   ```bash
   # Stop the server (Ctrl+C)
   # Then start it again
   npm start
   ```

5. **Verify the key is loaded:**
   ```bash
   node check-env.js
   ```
   Should show: `API Key configured: ✅ YES` with your actual key preview

6. **Test the server:**
   ```bash
   curl http://localhost:3000/api/health
   ```
   Should return: `{"status":"ok","hasApiKey":true,...}`

## Where to Get Your API Key

1. Go to [Daydream Dashboard](https://daydream.live) (or your API provider)
2. Navigate to API Keys / Settings
3. Copy your API key
4. Paste it into the `.env` file (no quotes, no spaces)

## Still Not Working?

1. **Check server logs** - Look for error messages when starting the server
2. **Verify the key format** - Daydream keys usually start with `sk_` or similar
3. **Test the key directly:**
   ```bash
   curl -X POST https://api.daydream.live/v1/streams \
     -H "Authorization: Bearer YOUR_KEY_HERE" \
     -H "Content-Type: application/json" \
     -d '{"pipeline_id":"pip_qpUgXycjWF6YMeSL"}'
   ```
4. **Check if the key has expired** - Generate a new one if needed

