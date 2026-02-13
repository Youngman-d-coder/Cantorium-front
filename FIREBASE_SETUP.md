# Firebase Setup Guide for Cantorium

This guide will help you set up Firebase for Cantorium's authentication and database features.

## Prerequisites

- A Google account
- Node.js 18.x or higher installed
- Git repository cloned locally

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard:
   - Enter a project name (e.g., "Cantorium")
   - Choose whether to enable Google Analytics (recommended)
   - Click "Create project"

## Step 2: Register Your Web App

1. In your Firebase project, click the web icon (</>) to add a web app
2. Enter an app nickname (e.g., "Cantorium Web App")
3. Check "Also set up Firebase Hosting" if you want to host on Firebase
4. Click "Register app"
5. Copy the Firebase configuration values - you'll need these for the next step

## Step 3: Configure Environment Variables

1. Copy the `.env.example` file to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and update the Firebase configuration values:
   ```env
   VITE_FIREBASE_API_KEY=your-api-key-here
   VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```

   Replace the placeholder values with your actual Firebase configuration.

## Step 4: Enable Authentication Methods

1. In the Firebase Console, go to **Build** > **Authentication**
2. Click "Get started" if this is your first time
3. Go to the **Sign-in method** tab
4. Enable the following providers:

### Email/Password Authentication
1. Click on "Email/Password"
2. Enable the first option (Email/Password)
3. Click "Save"

### Google Authentication
1. Click on "Google"
2. Enable the toggle
3. Enter a public-facing name for your project
4. Choose a support email
5. Click "Save"

### GitHub Authentication
1. Click on "GitHub"
2. Enable the toggle
3. You'll need to create a GitHub OAuth App:
   - Go to [GitHub Developer Settings](https://github.com/settings/developers)
   - Click "New OAuth App"
   - Fill in the details:
     - Application name: Cantorium
     - Homepage URL: Your app URL (e.g., http://localhost:5173 for development)
     - Authorization callback URL: Copy from Firebase (looks like: `https://your-project-id.firebaseapp.com/__/auth/handler`)
   - Click "Register application"
   - Copy the Client ID and generate a Client Secret
4. Paste the Client ID and Client Secret into Firebase
5. Click "Save"

## Step 5: Set Up Firestore Database

1. In the Firebase Console, go to **Build** > **Firestore Database**
2. Click "Create database"
3. Choose a starting mode:
   - **Production mode**: Start with security rules that deny all reads/writes
   - **Test mode**: Start with security rules that allow all reads/writes (for 30 days)
   
   For development, you can start with test mode, but remember to update security rules later.

4. Choose a Cloud Firestore location (choose one closest to your users)
5. Click "Enable"

## Step 6: Configure Firestore Security Rules

For production, update your Firestore security rules:

1. Go to **Firestore Database** > **Rules** tab
2. Replace the rules with the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is authenticated
    function isSignedIn() {
      return request.auth != null;
    }
    
    // Helper function to check if user owns the resource
    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }
    
    // Users collection - users can only read/write their own data
    match /users/{userId} {
      allow read, write: if isOwner(userId);
    }
    
    // Compositions collection - users can only read/write their own compositions
    match /compositions/{compositionId} {
      allow read: if isSignedIn() && resource.data.userId == request.auth.uid;
      allow create: if isSignedIn() && request.resource.data.userId == request.auth.uid;
      allow update, delete: if isSignedIn() && resource.data.userId == request.auth.uid;
    }
    
    // Practice sessions - users can only read/write their own sessions
    match /practiceSessions/{sessionId} {
      allow read: if isSignedIn() && resource.data.userId == request.auth.uid;
      allow create: if isSignedIn() && request.resource.data.userId == request.auth.uid;
      allow update, delete: if isSignedIn() && resource.data.userId == request.auth.uid;
    }
    
    // AI generation logs - users can only read/write their own logs
    match /aiGenerationLogs/{logId} {
      allow read: if isSignedIn() && resource.data.userId == request.auth.uid;
      allow create: if isSignedIn() && request.resource.data.userId == request.auth.uid;
      allow update: if isSignedIn() && resource.data.userId == request.auth.uid;
    }
  }
}
```

3. Click "Publish"

## Step 7: Test Your Setup

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser to http://localhost:5173

3. Try the following:
   - Sign up with a new email/password
   - Sign in with your account
   - Try Google sign-in (if configured)
   - Try GitHub sign-in (if configured)
   - Check the Firebase Console to see the new user in Authentication

## Step 8: Set Up Firestore Indexes (Optional)

As you use the app, Firestore may suggest creating indexes for better query performance. When you see index creation links in the console:

1. Click the link or go to **Firestore Database** > **Indexes** tab
2. Create the suggested composite indexes
3. Wait for the indexes to be built (usually takes a few seconds)

## Security Best Practices

1. **Never commit `.env.local` or `.env` files**: These files contain sensitive credentials
2. **Update security rules**: The default test mode rules expire after 30 days
3. **Enable App Check**: Add an extra layer of security to protect your backend resources
4. **Monitor usage**: Set up billing alerts and monitor your Firebase usage
5. **Rotate credentials**: If you suspect your Firebase credentials have been compromised, regenerate them

## Troubleshooting

### Firebase is not configured error
- Check that all environment variables are set correctly in `.env.local`
- Restart the development server after changing environment variables

### Authentication popup blocked
- Check your browser's popup blocker settings
- Try using the app in a different browser

### Firestore permission denied
- Check that your security rules are correctly configured
- Verify that the user is authenticated before making Firestore requests

### GitHub authentication not working
- Verify that the Authorization callback URL is correctly set in your GitHub OAuth App
- Check that the Client ID and Client Secret are correctly entered in Firebase

## Next Steps

Now that Firebase is set up, you can:

1. Use the authentication system to sign up and sign in users
2. Store user compositions in Firestore
3. Track practice sessions
4. Log AI generation requests
5. Build additional features using Firebase services

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firebase Console](https://console.firebase.google.com/)
