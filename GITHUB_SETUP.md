# 📦 GitHub Setup Guide

## Quick Setup Steps

### 1. Create GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the **+** icon (top right) → **New repository**
3. Fill in:
   - **Repository name:** `streamdiffusion-playground` (or your choice)
   - **Description:** "StreamDiffusion Playground with secure API proxy"
   - **Visibility:** Public or Private (your choice)
   - **DO NOT** check "Initialize with README" (we already have files)
4. Click **Create repository**

### 2. Initialize Git and Push

Run these commands in your terminal:

```bash
# Navigate to your project (if not already there)
cd /Users/mbarriossolano/Desktop/test

# Initialize git repository
git init

# Add all files
git add .

# Make your first commit
git commit -m "Initial commit: StreamDiffusion Playground with Vercel support"

# Add your GitHub repository (replace with YOUR username and repo name)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Replace:**
- `YOUR_USERNAME` with your GitHub username
- `YOUR_REPO_NAME` with the repository name you created

### 3. Verify

- Go to your GitHub repository page
- You should see all your files there
- ✅ `.env` file will NOT be there (it's in `.gitignore` - that's good!)

## Next: Deploy to Vercel

After pushing to GitHub, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for Vercel deployment.

## 🔒 Security Note

Your `.env` file is already in `.gitignore`, so your API key will **never** be committed to GitHub. You'll set it securely in Vercel's environment variables instead.

