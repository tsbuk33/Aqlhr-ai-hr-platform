import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ModuleAIChat from '@/components/universal/ModuleAIChat';

// Mock hooks
jest.mock('@/hooks/useAPITranslations', () => ({
  useAPITranslations: () => ({
    t: (key: string) => `mocked_${key}`,
  }),
}));

jest.mock('@/hooks/useLanguageCompat', () => ({
  useLanguage: () => ({
    language: 'en',
  }),
}));

jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: jest.fn().mockResolvedValue({
        data: { response: 'Test AI response' },
        error: null,
      }),
    },
  },
}));

describe('ModuleAIChat', () => {
  it('renders chat interface', () => {
    render(<ModuleAIChat moduleKey="test-module" />);

    expect(screen.getByText('mocked_test-module.aiChat.title')).toBeInTheDocument();
    expect(screen.getByText('mocked_aiChat.beta')).toBeInTheDocument();
  });

  it('displays welcome message initially', async () => {
    render(<ModuleAIChat moduleKey="test-module" />);

    await waitFor(() => {
      expect(screen.getByText('mocked_test-module.aiChat.welcomeMessage')).toBeInTheDocument();
    });
  });

  it('renders minimized view when isMinimized is true', () => {
    render(<ModuleAIChat moduleKey="test-module" isMinimized />);

    const minimizedButton = screen.getByRole('button');
    expect(minimizedButton).toBeInTheDocument();
    expect(minimizedButton.querySelector('.lucide-message-circle')).toBeInTheDocument();
  });

  it('shows toggle buttons when handlers provided', () => {
    const mockToggle = jest.fn();
    const mockClose = jest.fn();

    render(
      <ModuleAIChat
        moduleKey="test-module"
        onToggleMinimize={mockToggle}
        onClose={mockClose}
      />
    );

    const minimizeButton = document.querySelector('.lucide-minimize-2');
    const closeButton = document.querySelector('.lucide-x');
    
    expect(minimizeButton).toBeInTheDocument();
    expect(closeButton).toBeInTheDocument();
  });

  it('allows sending messages', async () => {
    render(<ModuleAIChat moduleKey="test-module" />);

    const input = screen.getByPlaceholderText('mocked_aiChat.placeholder');
    const sendButton = screen.getByRole('button', { name: /send/i });

    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });
  });

  it('handles context data properly', () => {
    const contextData = {
      moduleName: 'Test Module',
      currentData: { test: 'data' },
      uploadedDocs: ['doc1.pdf'],
    };

    render(
      <ModuleAIChat moduleKey="test-module" context={contextData} />
    );

    // Component should render without errors
    expect(screen.getByText('mocked_test-module.aiChat.title')).toBeInTheDocument();
  });
});