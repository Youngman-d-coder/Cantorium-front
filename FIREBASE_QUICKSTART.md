# Firebase Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies (Already Done)
```bash
npm install
```

### 2. Set Up Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Add a web app to your project
4. Copy the configuration values

### 3. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 4. Enable Authentication

In Firebase Console:
1. Go to **Authentication** > **Sign-in method**
2. Enable **Email/Password**
3. Enable **Google** (optional)
4. Enable **GitHub** (optional, requires GitHub OAuth app)

### 5. Set Up Firestore

In Firebase Console:
1. Go to **Firestore Database**
2. Click **Create database**
3. Choose **Test mode** for development (or Production with rules)
4. Select a location
5. Click **Enable**

### 6. Add Security Rules

Go to **Firestore** > **Rules** and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }
    
    match /users/{userId} {
      allow read, write: if isOwner(userId);
    }
    
    match /compositions/{compositionId} {
      allow read, create, update, delete: if isSignedIn() && resource.data.userId == request.auth.uid;
    }
    
    match /practiceSessions/{sessionId} {
      allow read, create, update, delete: if isSignedIn() && resource.data.userId == request.auth.uid;
    }
    
    match /aiGenerationLogs/{logId} {
      allow read, create, update: if isSignedIn() && resource.data.userId == request.auth.uid;
    }
  }
}
```

### 7. Start Development

```bash
npm run dev
```

Visit http://localhost:5173 and try:
- Creating an account
- Signing in
- Using Google/GitHub sign-in

## 📝 Common Use Cases

### Check if User is Logged In

```typescript
import { useAuth } from './auth';

function MyComponent() {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please sign in</div>;
  
  return <div>Hello, {user.name}!</div>;
}
```

### Create a Composition

```typescript
import { createComposition } from './services/firestore';
import { useAuth } from './auth';

async function saveComposition() {
  const { user } = useAuth();
  
  const id = await createComposition({
    userId: user.id,
    title: 'My Composition',
    voiceParts: ['Soprano', 'Alto', 'Tenor', 'Bass'],
    aiGenerated: true,
    aiPrompt: 'Create a peaceful choral piece',
  });
  
  console.log('Saved with ID:', id);
}
```

### Get User's Compositions

```typescript
import { getUserCompositions } from './services/firestore';
import { useAuth } from './auth';
import { useEffect, useState } from 'react';

function CompositionsList() {
  const { user } = useAuth();
  const [compositions, setCompositions] = useState([]);
  
  useEffect(() => {
    if (!user) return;
    
    getUserCompositions(user.id).then(setCompositions);
  }, [user]);
  
  return (
    <ul>
      {compositions.map(comp => (
        <li key={comp.id}>{comp.title}</li>
      ))}
    </ul>
  );
}
```

## 🔒 Security Checklist

- [ ] Firebase credentials in `.env.local` (not committed)
- [ ] Firestore security rules enabled
- [ ] Authentication required for all database operations
- [ ] Test mode disabled in production
- [ ] Environment variables set in hosting platform

## 🆘 Troubleshooting

### "Firebase is not configured" error
- Check that all environment variables are set in `.env.local`
- Restart dev server after changing environment variables

### Google/GitHub sign-in not working
- Enable the provider in Firebase Console
- For GitHub: Set up OAuth app with correct callback URL
- Check browser popup blocker settings

### Permission denied in Firestore
- Check security rules are configured correctly
- Verify user is authenticated before making requests
- Check that `userId` matches `request.auth.uid` in security rules

## 📚 More Information

- [Full Setup Guide](./FIREBASE_SETUP.md) - Detailed Firebase configuration
- [Usage Examples](./FIREBASE_USAGE.md) - Code examples for all features
- [Implementation Summary](./IMPLEMENTATION_SUMMARY.md) - Technical details

## 🎯 Next Steps

Once Firebase is set up:
1. ✅ Users can create accounts
2. ✅ Users can sign in with email/Google/GitHub
3. ✅ Compositions are stored in the cloud
4. ✅ Practice sessions are tracked
5. ✅ AI features are enabled

Ready to build! 🚀
