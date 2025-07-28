import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ModuleDiagnosticPanel from '@/components/universal/ModuleDiagnosticPanel';

// Mock hooks
jest.mock('@/hooks/useAPITranslations', () => ({
  useAPITranslations: () => ({
    t: (key: string) => {
      if (key.includes('categories.excellent')) return 'Excellent';
      if (key.includes('severity.medium')) return 'Medium';
      if (key.includes('priority.high')) return 'High';
      return `mocked_${key}`;
    },
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
        data: null,
        error: new Error('Function not found'),
      }),
    },
  },
}));

describe('ModuleDiagnosticPanel', () => {
  it('renders diagnostic panel with run button initially', () => {
    render(<ModuleDiagnosticPanel moduleKey="test-module" />);

    expect(screen.getByText('mocked_test-module.diagnostic.title')).toBeInTheDocument();
    expect(screen.getByText('mocked_diagnostic.runDiagnostic')).toBeInTheDocument();
  });

  it('shows loading state when running diagnostic', async () => {
    render(<ModuleDiagnosticPanel moduleKey="test-module" />);

    const runButton = screen.getByText('mocked_diagnostic.runDiagnostic');
    fireEvent.click(runButton);

    expect(runButton).toBeDisabled();
  });

  it('displays diagnostic results after running', async () => {
    render(<ModuleDiagnosticPanel moduleKey="test-module" />);

    const runButton = screen.getByText('mocked_diagnostic.runDiagnostic');
    fireEvent.click(runButton);

    await waitFor(() => {
      expect(screen.getByText(/\d+%/)).toBeInTheDocument(); // Score percentage
    });
  });

  it('shows refresh button in results view', async () => {
    render(<ModuleDiagnosticPanel moduleKey="test-module" />);

    const runButton = screen.getByText('mocked_diagnostic.runDiagnostic');
    fireEvent.click(runButton);

    await waitFor(() => {
      expect(screen.getByText('mocked_diagnostic.refresh')).toBeInTheDocument();
    });
  });

  it('displays issues and recommendations', async () => {
    render(<ModuleDiagnosticPanel moduleKey="test-module" />);

    const runButton = screen.getByText('mocked_diagnostic.runDiagnostic');
    fireEvent.click(runButton);

    await waitFor(() => {
      expect(screen.getByText('mocked_diagnostic.issues')).toBeInTheDocument();
      expect(screen.getByText('mocked_diagnostic.recommendations')).toBeInTheDocument();
    });
  });

  it('handles auto-refresh when enabled', () => {
    render(
      <ModuleDiagnosticPanel
        moduleKey="test-module"
        autoRefresh={true}
        refreshInterval={1}
      />
    );

    // Component should render without errors
    expect(screen.getByText('mocked_test-module.diagnostic.title')).toBeInTheDocument();
  });

  it('accepts context data', () => {
    const contextData = { testData: 'value' };

    render(
      <ModuleDiagnosticPanel
        moduleKey="test-module"
        contextData={contextData}
      />
    );

    expect(screen.getByText('mocked_test-module.diagnostic.title')).toBeInTheDocument();
  });
});