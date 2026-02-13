import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToastProvider, useToast } from './Toast';

// Test component that uses the toast hook
function TestComponent() {
  const { showToast } = useToast();
  
  return (
    <div>
      <button onClick={() => showToast('Test message', 'success')}>
        Show Toast
      </button>
    </div>
  );
}

describe('ToastProvider', () => {
  it('should show toast notification', async () => {
    const user = userEvent.setup();
    
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    const button = screen.getByText('Show Toast');
    await user.click(button);
    
    await waitFor(() => {
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });
  });

  it('should throw error when useToast is used outside provider', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = () => {};
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useToast must be used within ToastProvider');
    
    console.error = originalError;
  });
});
