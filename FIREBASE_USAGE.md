# Firebase Integration Usage Examples

This document provides code examples for using the Firebase backend in Cantorium.

## Authentication

### Sign Up with Email/Password

```typescript
import { signUpWithEmail } from './services/firebaseAuth';
import { useAuth } from './auth';

function SignUpComponent() {
  const { setUser } = useAuth();

  const handleSignUp = async () => {
    try {
      const user = await signUpWithEmail('user@example.com', 'password123', 'John Doe');
      setUser(user);
      console.log('User signed up:', user);
    } catch (error) {
      console.error('Sign up failed:', error);
    }
  };

  return <button onClick={handleSignUp}>Sign Up</button>;
}
```

### Sign In with Email/Password

```typescript
import { signInWithEmail } from './services/firebaseAuth';
import { useAuth } from './auth';

function SignInComponent() {
  const { setUser } = useAuth();

  const handleSignIn = async () => {
    try {
      const user = await signInWithEmail('user@example.com', 'password123');
      setUser(user);
      console.log('User signed in:', user);
    } catch (error) {
      console.error('Sign in failed:', error);
    }
  };

  return <button onClick={handleSignIn}>Sign In</button>;
}
```

### Sign In with Google

```typescript
import { signInWithGoogle } from './services/firebaseAuth';
import { useAuth } from './auth';

function GoogleSignInComponent() {
  const { setUser } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      const user = await signInWithGoogle();
      setUser(user);
      console.log('User signed in with Google:', user);
    } catch (error) {
      console.error('Google sign in failed:', error);
    }
  };

  return <button onClick={handleGoogleSignIn}>Sign In with Google</button>;
}
```

### Sign Out

```typescript
import { useAuth } from './auth';

function SignOutComponent() {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      console.log('User signed out');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return <button onClick={handleSignOut}>Sign Out</button>;
}
```

### Access Current User

```typescript
import { useAuth } from './auth';

function UserProfileComponent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Not signed in</div>;
  }

  return (
    <div>
      <h2>Welcome, {user.name || user.email}</h2>
      <p>User ID: {user.id}</p>
      <p>Email: {user.email}</p>
    </div>
  );
}
```

## Firestore Database

### Create a Composition

```typescript
import { createComposition } from './services/firestore';
import { useAuth } from './auth';

function CreateCompositionComponent() {
  const { user } = useAuth();

  const handleCreateComposition = async () => {
    if (!user) {
      console.error('User not authenticated');
      return;
    }

    try {
      const compositionId = await createComposition({
        userId: user.id,
        title: 'My First Choral Piece',
        voiceParts: ['Soprano', 'Alto', 'Tenor', 'Bass'],
        key: 'C Major',
        tempo: 120,
        lyrics: 'Ave Maria, gratia plena...',
        aiGenerated: true,
        aiPrompt: 'Create a peaceful SATB arrangement of Ave Maria',
      });
      console.log('Composition created:', compositionId);
    } catch (error) {
      console.error('Failed to create composition:', error);
    }
  };

  return <button onClick={handleCreateComposition}>Create Composition</button>;
}
```

### Get User's Compositions

```typescript
import { getUserCompositions } from './services/firestore';
import { useAuth } from './auth';
import { useEffect, useState } from 'react';

function CompositionListComponent() {
  const { user } = useAuth();
  const [compositions, setCompositions] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchCompositions = async () => {
      try {
        const userCompositions = await getUserCompositions(user.id);
        setCompositions(userCompositions);
      } catch (error) {
        console.error('Failed to fetch compositions:', error);
      }
    };

    fetchCompositions();
  }, [user]);

  return (
    <div>
      <h2>My Compositions</h2>
      <ul>
        {compositions.map((comp) => (
          <li key={comp.id}>
            {comp.title} - {comp.key} - {comp.tempo} BPM
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Update a Composition

```typescript
import { updateComposition } from './services/firestore';

async function updateCompositionExample(compositionId: string) {
  try {
    await updateComposition(compositionId, {
      title: 'Updated Title',
      tempo: 130,
    });
    console.log('Composition updated');
  } catch (error) {
    console.error('Failed to update composition:', error);
  }
}
```

### Delete a Composition

```typescript
import { deleteComposition } from './services/firestore';

async function deleteCompositionExample(compositionId: string) {
  try {
    await deleteComposition(compositionId);
    console.log('Composition deleted');
  } catch (error) {
    console.error('Failed to delete composition:', error);
  }
}
```

### Create a Practice Session

```typescript
import { createPracticeSession } from './services/firestore';
import { useAuth } from './auth';

function PracticeComponent() {
  const { user } = useAuth();

  const handleEndPractice = async (compositionId: string, duration: number) => {
    if (!user) return;

    try {
      const sessionId = await createPracticeSession({
        userId: user.id,
        compositionId: compositionId,
        voicePart: 'Tenor',
        duration: duration, // in seconds
        accuracy: 85, // 0-100
      });
      console.log('Practice session saved:', sessionId);
    } catch (error) {
      console.error('Failed to save practice session:', error);
    }
  };

  return <div>Practice Component</div>;
}
```

### Get User's Practice Sessions

```typescript
import { getUserPracticeSessions } from './services/firestore';
import { useAuth } from './auth';
import { useEffect, useState } from 'react';

function PracticeHistoryComponent() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchSessions = async () => {
      try {
        const userSessions = await getUserPracticeSessions(user.id);
        setSessions(userSessions);
      } catch (error) {
        console.error('Failed to fetch practice sessions:', error);
      }
    };

    fetchSessions();
  }, [user]);

  return (
    <div>
      <h2>Practice History</h2>
      <ul>
        {sessions.map((session) => (
          <li key={session.id}>
            {session.voicePart} - {Math.floor(session.duration / 60)} minutes
            {session.accuracy && ` - ${session.accuracy}% accuracy`}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Update User Profile

```typescript
import { updateUserProfile } from './services/firestore';
import { useAuth } from './auth';

function UpdateProfileComponent() {
  const { user } = useAuth();

  const handleUpdateProfile = async () => {
    if (!user) return;

    try {
      await updateUserProfile(user.id, {
        name: 'Updated Name',
        voicePart: 'Tenor',
        preferences: {
          defaultTempo: 120,
          defaultKey: 'C Major',
          favoriteVoicePart: 'Tenor',
        },
      });
      console.log('Profile updated');
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  return <button onClick={handleUpdateProfile}>Update Profile</button>;
}
```

### Log AI Generation Request

```typescript
import { createAIGenerationLog, updateAIGenerationLog } from './services/firestore';
import { useAuth } from './auth';

async function generateAIComposition(prompt: string) {
  const { user } = useAuth();
  if (!user) return;

  try {
    // Log the request
    const logId = await createAIGenerationLog({
      userId: user.id,
      prompt: prompt,
      status: 'pending',
    });

    // Simulate AI generation...
    // In reality, this would call your AI service
    
    // Update log on success
    await updateAIGenerationLog(logId, {
      status: 'completed',
      compositionId: 'generated-composition-id',
    });
    
    console.log('AI composition generated');
  } catch (error) {
    console.error('AI generation failed:', error);
    
    // Update log on failure
    await updateAIGenerationLog(logId, {
      status: 'failed',
      error: error.message,
    });
  }
}
```

## Protected Routes

```typescript
import { Navigate } from 'react-router-dom';
import { useAuth } from './auth';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
}

// Usage in Router
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

## Making Authenticated API Requests

If you need to make requests to other APIs with Firebase authentication:

```typescript
import { useAuth } from './auth';

function ApiComponent() {
  const { getAuthHeaders } = useAuth();

  const makeAuthenticatedRequest = async () => {
    try {
      const response = await fetch('https://api.example.com/data', {
        method: 'GET',
        headers: {
          ...getAuthHeaders(), // Includes Authorization: Bearer <token>
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      console.log('Data:', data);
    } catch (error) {
      console.error('Request failed:', error);
    }
  };

  return <button onClick={makeAuthenticatedRequest}>Fetch Data</button>;
}
```

## Error Handling Best Practices

```typescript
import { FirebaseError } from 'firebase/app';

async function handleFirebaseError() {
  try {
    // Firebase operation
  } catch (error) {
    if (error instanceof FirebaseError) {
      switch (error.code) {
        case 'auth/user-not-found':
          console.error('User not found');
          break;
        case 'auth/wrong-password':
          console.error('Incorrect password');
          break;
        case 'auth/email-already-in-use':
          console.error('Email already in use');
          break;
        case 'permission-denied':
          console.error('Permission denied');
          break;
        default:
          console.error('Firebase error:', error.message);
      }
    } else {
      console.error('Unknown error:', error);
    }
  }
}
```

## Notes

- Always check if the user is authenticated before making Firestore requests
- Firebase authentication tokens expire after 1 hour and are automatically refreshed by the SDK
- Use the `loading` state from `useAuth()` to show loading indicators while auth state is being determined
- All Firestore operations are subject to security rules configured in the Firebase Console
- See [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for security rules configuration
