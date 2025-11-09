# 🔧 Quick Fix for 401 Error

## The Problem
Your server is running with an old/cached API key. It needs to be restarted to load the updated `.env` file.

## Solution

### Step 1: Stop the current server
```bash
# Find the process
ps aux | grep "node server.js"

# Kill it (replace PID with your actual process ID)
kill <PID>

# Or if you started it in a terminal, just press Ctrl+C
```

### Step 2: Restart the server
```bash
npm start
```

### Step 3: Verify it loaded the key
Look for this in the server output:
```
✅ API key loaded: sk_WqTbh...
📝 API key configured: ✅ Yes
```

### Step 4: Test
```bash
curl http://localhost:3000/api/health
```

Should return: `"hasApiKey":true`

Then try creating a stream in the browser again.

## Alternative: Use environment variable directly

If restarting doesn't work, you can also set the API key as an environment variable:

```bash
# Stop the server first, then:
DAYDREAM_API_KEY=sk_WqTbhKdqf7HY1avFDw2ByrkAg7gpvRKtq85tHeCnBqQs8LVQtGPYvFcnbMf85szS npm start
```

## Still not working?

1. Check server logs when you make a request - look for the API key preview
2. Verify the key works: `node check-env.js`
3. Test the key directly: See TROUBLESHOOTING.md

