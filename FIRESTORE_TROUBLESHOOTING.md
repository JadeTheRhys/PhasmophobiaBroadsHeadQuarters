# Firestore Access Troubleshooting Guide

This guide helps diagnose and fix common Firestore access issues when using Phasmophobia HQ Command Center.

## Quick Diagnosis Checklist

When experiencing Firestore access issues (chat messages not showing, real-time updates not working), check the following in order:

### 1. ✅ Verify Firestore Rules Are Deployed

**Symptom**: Browser console shows `permission-denied` errors when trying to read/write Firestore data.

**Check**:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`phasmophobia-hq`)
3. Navigate to **Firestore Database** > **Rules** tab
4. Verify the rules match the content in `firestore.rules` file
5. Check the "Last published" timestamp - it should be recent

**Fix**:
```bash
# Deploy rules using Firebase CLI
firebase deploy --only firestore:rules

# Or use the full Firebase login and deploy flow:
firebase login
firebase use phasmophobia-hq
firebase deploy --only firestore:rules
```

**Manual Fix via Console**:
1. Copy the entire content of `firestore.rules` from this repository
2. Paste into Firebase Console > Firestore Database > Rules editor
3. Click **Publish**

### 2. ✅ Confirm You're Using Firestore (Not Realtime Database)

**Common Mistake**: Firestore and Realtime Database are different products with different rules systems.

**Check**:
- This app uses **Firestore** (also called "Cloud Firestore")
- In Firebase Console, you should see **Firestore Database** in the left menu
- Do NOT confuse with **Realtime Database** which is a separate product

**Verify in Code**:
- The app imports from `firebase/firestore` (correct)
- NOT from `firebase/database` (wrong product)

### 3. ✅ Validate Firebase Configuration

**Symptom**: App doesn't connect to Firebase at all, shows "offline mode"

**Check Environment Variables**:
```bash
# Verify these are set in your .env file or deployment environment:
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=phasmophobia-hq.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=phasmophobia-hq
VITE_FIREBASE_STORAGE_BUCKET=phasmophobia-hq.firebasestorage.app
VITE_FIREBASE_APP_ID=your-app-id
```

**Get Correct Values**:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Project Settings** (gear icon) > **General** tab
4. Scroll to **Your apps** section
5. Find your web app or click "Add app" to create one
6. Copy the config values

**Important**: 
- The API key and config are **safe to expose** in client-side code
- Firebase security rules protect your data, not these config values
- If values are incorrect, the app will fail to connect

### 4. ✅ Verify Project ID Matches

**Symptom**: Rules are deployed but to the wrong project

**Check**:
1. Look at `.firebaserc` file - it should contain:
   ```json
   {
     "projects": {
       "default": "phasmophobia-hq"
     }
   }
   ```
2. Verify this matches `VITE_FIREBASE_PROJECT_ID` in your `.env`
3. Verify this matches the project you see in Firebase Console

**Fix**:
```bash
# List available projects
firebase projects:list

# Switch to correct project
firebase use phasmophobia-hq
```

### 5. ✅ Check Browser Console for Errors

**How to Check**:
1. Open your browser's Developer Tools (F12)
2. Go to the **Console** tab
3. Look for Firebase-related errors

**Common Error Messages**:

| Error | Cause | Fix |
|-------|-------|-----|
| `permission-denied` | Firestore rules not deployed | Deploy rules (see #1) |
| `Missing or insufficient permissions` | Firestore rules not deployed | Deploy rules (see #1) |
| `Project not found` | Wrong project ID in config | Fix project ID (see #4) |
| `API key not valid` | Wrong API key in config | Fix API key (see #3) |
| `network error` | Internet connection issue | Check internet connection |
| `Firebase: Error (auth/operation-not-allowed)` | Auth provider not enabled | Enable auth in Firebase Console |

### 6. ✅ Clear Browser Cache

**Symptom**: Old Firebase configuration is cached

**Fix**:
1. Open Developer Tools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

Or:
1. Open Settings in your browser
2. Clear browsing data
3. Select "Cached images and files"
4. Click "Clear data"

### 7. ✅ Verify Firestore Database Exists

**Symptom**: Firestore database hasn't been created yet

**Check**:
1. Go to Firebase Console > Firestore Database
2. If you see "Get started" button, database doesn't exist yet
3. Click "Create database"
4. Choose production mode or test mode
5. Select a location (this cannot be changed later)

**Important**: After creating the database, you still need to deploy rules!

### 8. ✅ Check Billing and Quotas

**Symptom**: Exceeded free tier limits or billing issues

**Check**:
1. Go to Firebase Console > Usage and billing
2. Verify you haven't exceeded quotas:
   - Free tier: 50K reads/day, 20K writes/day
   - Firestore: 1 GB storage free
3. Check if billing is enabled (required for production usage)

**Fix**:
- Enable Blaze (pay-as-you-go) plan if needed
- Set budget alerts to avoid unexpected charges
- For development, Firebase has generous free tier

### 9. ✅ Test Rules Locally

**Symptom**: Want to verify rules work before deploying

**Test via Firebase Console**:
1. Go to Firestore Database > Rules tab
2. Click "Rules Playground" at the top
3. Test read/write operations:
   ```
   // Test read from chat collection
   get /databases/(default)/documents/chat/test123
   
   // Test write to chat collection
   create /databases/(default)/documents/chat/test123
   ```

**Test via Emulator**:
```bash
# Install Firebase emulator
npm install -g firebase-tools

# Start emulator
firebase emulators:start --only firestore

# Update .env to point to emulator
VITE_FIREBASE_USE_EMULATOR=true
```

### 10. ✅ Verify Authentication State

**Symptom**: Rules require authentication but user not signed in

**Check**:
- Look at browser console for "Firebase connected (no authenticated user)" message
- The app works with **unauthenticated** users by design
- Rules in this app allow reads/writes without authentication

**Current Rules**:
- `allow read: if true` - Anyone can read
- `allow create: if true` - Anyone can create
- Authentication is optional for this collaborative game

## Testing Your Fix

After making changes, verify everything works:

### 1. Check Connection Status
- Open the app
- Open browser console (F12)
- Look for: `Firebase connected. Agent [id] authenticated.`
- Should NOT see: `permission-denied` errors

### 2. Test Chat Feature
1. Type a message in the chat panel
2. Message should appear immediately
3. Open app in another browser/tab
4. Message should be visible there too

### 3. Test Real-time Updates
1. Click "TRIGGER HUNT" button
2. Should see hunt animation and effects
3. Should appear in Activity Log
4. Should work across multiple browser tabs

### 4. Test Squad Status
1. Change your location using `!location:Kitchen` command
2. Should update in Squad Status panel
3. Should persist after page refresh

## Common Configuration Issues

### Wrong Firebase Product
**Problem**: Deployed Realtime Database rules instead of Firestore rules

**Solution**: 
- Use `firebase deploy --only firestore:rules` (correct)
- NOT `firebase deploy --only database` (wrong, that's for Realtime Database)

### Rules Not Taking Effect
**Problem**: Rules deployed but still getting permission-denied

**Solution**:
1. Wait 1-2 minutes for rules to propagate
2. Clear browser cache
3. Verify in Firebase Console that rules match `firestore.rules`
4. Check you're deploying to the correct project

### Environment Variables Not Loading
**Problem**: Vite not reading .env variables

**Solution**:
1. Restart dev server after changing .env
2. Variables must start with `VITE_` prefix
3. For production builds, set variables in deployment platform
4. Never commit `.env` file (use `.env.example` as template)

### Cross-Origin Issues
**Problem**: CORS errors when accessing Firebase

**Solution**:
- This shouldn't happen with Firebase
- If it does, verify `authDomain` is correct
- Check Firebase Console > Authentication > Settings > Authorized domains

## Getting Help

If none of these solutions work:

1. **Check Firebase Status**: https://status.firebase.google.com/
2. **Enable Debug Logging**:
   ```javascript
   // Add to firebase.ts temporarily
   import { setLogLevel } from 'firebase/firestore';
   setLogLevel('debug');
   ```
3. **Review Firebase Logs**:
   - Firebase Console > Firestore Database > Usage tab
   - Look for denied requests
4. **Ask for Help**:
   - Include error messages from browser console
   - Include your Firebase project ID
   - Specify what you've already tried

## Security Best Practices

While fixing access issues, remember:

1. **Don't expose sensitive data** in rules or code
2. **Use authentication** for production deployments
3. **Enable Firebase App Check** to prevent abuse
4. **Set up billing alerts** to avoid unexpected charges
5. **Monitor usage** regularly in Firebase Console
6. **Use granular rules** instead of `allow read, write: if true` for production

For this collaborative ghost hunting game, the current permissive rules are intentional to allow squad members to interact without authentication friction. For production with many users, consider requiring authentication.
