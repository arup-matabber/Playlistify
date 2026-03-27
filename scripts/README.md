# 🔧 Spotify Authentication Scripts

This directory contains helper scripts to troubleshoot and fix Spotify authentication issues.

## 📁 Scripts

### 1. `spotify-auth-helper.js` - Get Refresh Token

**Purpose:** Generate a valid refresh token for your Spotify app.

**Usage:**
```bash
# Install dependencies first (from project root)
npm install express spotify-web-api-node

# Run the helper
node scripts/spotify-auth-helper.js

# Or with credentials as environment variables
SPOTIFY_CLIENT_ID=your_id SPOTIFY_CLIENT_SECRET=your_secret node scripts/spotify-auth-helper.js
```

**Steps:**
1. Open `http://localhost:8888/login` in your browser
2. Log in with your Spotify account
3. Authorize the app
4. Copy the refresh token from the terminal or browser
5. Use it in your Apify actor configuration

**⚠️ Important:**
- Add `http://localhost:8888/callback` to your Spotify app's redirect URIs
- The refresh token will be displayed in both terminal and browser
- Save the refresh token securely - you'll need it for your Apify actor

---

### 2. `test-spotify-auth.js` - Test Credentials

**Purpose:** Verify that your Spotify credentials are valid and working.

**Usage:**
```bash
# Set environment variables and run
SPOTIFY_CLIENT_ID=your_id \
SPOTIFY_CLIENT_SECRET=your_secret \
SPOTIFY_REFRESH_TOKEN=your_token \
node scripts/test-spotify-auth.js
```

**What it tests:**
1. ✅ Refresh token validity
2. ✅ Access token generation
3. ✅ API access (user profile)
4. ✅ Search functionality
5. ✅ Recommendations

**Success output:**
```
🎉 ALL TESTS PASSED!
✅ Your Spotify credentials are valid and working correctly!
```

**Failure output:**
```
❌ TEST FAILED!
[Detailed error message and troubleshooting steps]
```

---

## 🚀 Quick Start Guide

### If you're getting "invalid_client" error:

**Step 1: Get Fresh Credentials**
```bash
# 1. Go to https://developer.spotify.com/dashboard
# 2. Open your app (or create a new one)
# 3. Copy Client ID
# 4. Show and copy Client Secret
# 5. Add redirect URI: http://localhost:8888/callback
```

**Step 2: Generate Refresh Token**
```bash
# Edit scripts/spotify-auth-helper.js and add your credentials
# OR set environment variables:
SPOTIFY_CLIENT_ID=your_id SPOTIFY_CLIENT_SECRET=your_secret node scripts/spotify-auth-helper.js

# Follow the browser prompts
# Copy the refresh token
```

**Step 3: Test Credentials**
```bash
SPOTIFY_CLIENT_ID=your_id \
SPOTIFY_CLIENT_SECRET=your_secret \
SPOTIFY_REFRESH_TOKEN=your_token \
node scripts/test-spotify-auth.js
```

**Step 4: Update Apify**
```
1. Go to Apify Console → Your Actor → Settings → Environment Variables
2. Add/update:
   - SPOTIFY_CLIENT_ID = your_id
   - SPOTIFY_CLIENT_SECRET = your_secret
   - SPOTIFY_REFRESH_TOKEN = your_token
3. Mark all as "Secret"
4. Rebuild actor
```

---

## 🐛 Common Issues

### Issue: "Cannot find module 'express'" or "Cannot find module 'spotify-web-api-node'"

**Solution:**
```bash
npm install express spotify-web-api-node
```

### Issue: "YOUR_CLIENT_ID_HERE"

**Solution:**
Either:
- Edit the script and replace placeholders with actual credentials
- Or use environment variables when running the script

### Issue: Authorization fails immediately

**Solution:**
- Check that redirect URI matches: `http://localhost:8888/callback`
- Make sure port 8888 is not in use
- Try using a different port (edit the script)

### Issue: "invalid_client" in test script

**Solution:**
- Client ID or Secret is incorrect
- Copy credentials again from Spotify Dashboard
- Make sure no extra spaces or newlines

### Issue: "invalid_grant" in test script

**Solution:**
- Refresh token doesn't match the Client ID/Secret
- Generate a new refresh token using the auth helper
- Make sure you're using the same Spotify app

---

## 📝 Example Workflow

Complete example from start to finish:

```bash
# 1. Install dependencies (from project root)
npm install

# 2. Set your credentials (or edit the script)
export SPOTIFY_CLIENT_ID="abc123..."
export SPOTIFY_CLIENT_SECRET="xyz789..."

# 3. Get refresh token
node scripts/spotify-auth-helper.js
# Open browser → http://localhost:8888/login
# Authorize → Copy refresh token

# 4. Test all credentials
export SPOTIFY_REFRESH_TOKEN="AQC5xG7..."
node scripts/test-spotify-auth.js
# Should show: 🎉 ALL TESTS PASSED!

# 5. Add to Apify
# - Go to Apify Console
# - Add environment variables
# - Mark as secret
# - Rebuild actor

# 6. Verify in Apify logs
# Should see: "Spotify access token refreshed"
```

---

## 🔐 Security Notes

**⚠️ NEVER commit credentials to git!**

- Scripts use environment variables by default
- If you edit scripts with real credentials, don't commit them
- Use `.env` file (already in `.gitignore`)
- In Apify, always mark credentials as "Secret"

**Best Practices:**
- Rotate credentials periodically
- Use separate Spotify apps for dev/prod
- Don't share refresh tokens
- Store credentials in secure password manager

---

## 📚 Additional Resources

- [Spotify Web API Documentation](https://developer.spotify.com/documentation/web-api)
- [Spotify Authorization Guide](https://developer.spotify.com/documentation/general/guides/authorization-guide/)
- [Main Troubleshooting Guide](../SPOTIFY_AUTH_FIX.md)

---

## ✅ Success Checklist

Before deploying to Apify, verify:

- [ ] Ran auth helper and got refresh token
- [ ] Test script shows "ALL TESTS PASSED"
- [ ] All 4 tests passed (refresh, profile, search, recommendations)
- [ ] Credentials added to Apify environment variables
- [ ] All credentials marked as "Secret" in Apify
- [ ] Actor rebuilt with new credentials
- [ ] Checked actor logs for successful authentication

---

## 🆘 Need Help?

If scripts aren't working:

1. **Check Node.js version**: `node --version` (should be 18+)
2. **Check npm packages**: `npm list spotify-web-api-node express`
3. **Enable debug mode**: Add `console.log` statements
4. **Check Spotify Dashboard**: Verify app settings
5. **Try curl**: Test credentials directly with Spotify API

See the main [SPOTIFY_AUTH_FIX.md](../SPOTIFY_AUTH_FIX.md) guide for detailed troubleshooting steps.
