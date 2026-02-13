import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AuthProvider, useAuth } from './auth';

// Test component that uses the auth hook
function TestComponent() {
  const { user, signOut } = useAuth();
  
  return (
    <div>
      <div data-testid="user-status">{user ? 'Logged In' : 'Logged Out'}</div>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}

describe('AuthProvider', () => {
  it('should provide auth context', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(screen.getByTestId('user-status')).toHaveTextContent('Logged Out');
  });

  it('should throw error when useAuth is used outside provider', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = () => {};
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useAuth must be used within AuthProvider');
    
    console.error = originalError;
  });
});
