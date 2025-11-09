# 🚀 Complete Deployment Guide

## Step-by-Step: GitHub → Vercel

### Step 1: Create GitHub Repository

1. **Go to GitHub:**
   - Visit [github.com](https://github.com)
   - Click the **+** icon → **New repository**

2. **Repository settings:**
   - Name: `streamdiffusion-playground` (or your choice)
   - Description: "StreamDiffusion Playground with secure API proxy"
   - Visibility: **Public** (or Private if you prefer)
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
   - Click **Create repository**

3. **Copy the repository URL** (you'll need it in Step 2)

### Step 2: Initialize Git and Push

**If you haven't initialized git yet:**

```bash
# Initialize git repository
git init

# Add all files
git add .

# Make your first commit
git commit -m "Initial commit: StreamDiffusion Playground"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**If git is already initialized:**

```bash
# Check status
git status

# Add all files
git add .

# Commit
git commit -m "Add Vercel serverless functions and deployment config"

# Push to GitHub
git push
```

### Step 3: Deploy to Vercel

**Option A: Via GitHub (Recommended - Auto-deploy)**

1. **Go to Vercel:**
   - Visit [vercel.com](https://vercel.com)
   - Sign up/Login (use GitHub to connect)

2. **Import Project:**
   - Click **Add New...** → **Project**
   - Find your GitHub repository
   - Click **Import**

3. **Configure Project:**
   - Framework Preset: **Other** (or leave as auto-detected)
   - Root Directory: `./` (default)
   - Build Command: (leave empty - no build needed)
   - Output Directory: (leave empty)

4. **Set Environment Variables:**
   - Click **Environment Variables**
   - Add:
     - `DAYDREAM_API_KEY` = `your_actual_api_key_here`
     - `PIPELINE_ID` = `pip_qpUgXycjWF6YMeSL` (optional)
   - Select: **Production**, **Preview**, **Development**
   - Click **Save**

5. **Deploy:**
   - Click **Deploy**
   - Wait for deployment to complete
   - Your app will be live at `https://your-app.vercel.app`

**Option B: Via CLI (Manual deploy)**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Set environment variables
vercel env add DAYDREAM_API_KEY
# Paste your key, select all environments

# Deploy to production
vercel --prod
```

### Step 4: Verify Deployment

1. **Check health endpoint:**
   ```
   https://your-app.vercel.app/api/health
   ```
   Should return: `{"status":"ok","hasApiKey":true}`

2. **Test the app:**
   - Open your Vercel URL in browser
   - Try creating a stream
   - Check browser console for errors

### Step 5: Auto-Deploy (If using GitHub)

Every time you push to GitHub:
- Vercel automatically deploys your changes
- Preview deployments for pull requests
- Production deployments for main branch

## 🔄 Making Updates

1. **Make changes locally**
2. **Commit and push:**
   ```bash
   git add .
   git commit -m "Your update message"
   git push
   ```
3. **Vercel auto-deploys** (if connected to GitHub)

## 📝 Important Notes

- ✅ `.env` is in `.gitignore` - your API key won't be committed
- ✅ Environment variables are set in Vercel dashboard (secure)
- ✅ HTTPS is automatic (free SSL)
- ✅ No server management needed

## 🐛 Troubleshooting

**401 Unauthorized:**
- Check environment variables in Vercel dashboard
- Make sure `DAYDREAM_API_KEY` is set for all environments
- Redeploy after adding environment variables

**404 on API routes:**
- Check that `api/` folder structure is correct
- Verify `vercel.json` exists

**Changes not deploying:**
- Make sure you pushed to GitHub
- Check Vercel deployment logs
- Try manual redeploy: `vercel --prod`

