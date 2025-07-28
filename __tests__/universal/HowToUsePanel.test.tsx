import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import HowToUsePanel from '@/components/universal/HowToUsePanel';

// Mock hooks
jest.mock('@/hooks/useAPITranslations', () => ({
  useAPITranslations: () => ({
    t: (key: string) => {
      if (key.includes('steps')) return ['Step 1', 'Step 2', 'Step 3'];
      return `mocked_${key}`;
    },
  }),
}));

jest.mock('@/hooks/useLanguageCompat', () => ({
  useLanguage: () => ({
    language: 'en',
  }),
}));

describe('HowToUsePanel', () => {
  it('renders collapsed by default', () => {
    render(<HowToUsePanel moduleKey="test-module" />);

    expect(screen.getByText('mocked_test-module.howToUse.title')).toBeInTheDocument();
    expect(screen.queryByText('mocked_test-module.howToUse.description')).not.toBeInTheDocument();
  });

  it('expands when clicked', () => {
    render(<HowToUsePanel moduleKey="test-module" />);

    const header = screen.getByText('mocked_test-module.howToUse.title');
    fireEvent.click(header);

    expect(screen.getByText('mocked_test-module.howToUse.description')).toBeInTheDocument();
  });

  it('displays steps when expanded', () => {
    render(<HowToUsePanel moduleKey="test-module" />);

    const header = screen.getByText('mocked_test-module.howToUse.title');
    fireEvent.click(header);

    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('Step 2')).toBeInTheDocument();
    expect(screen.getByText('Step 3')).toBeInTheDocument();
  });

  it('shows action buttons when expanded', () => {
    render(<HowToUsePanel moduleKey="test-module" />);

    const header = screen.getByText('mocked_test-module.howToUse.title');
    fireEvent.click(header);

    expect(screen.getByText('mocked_common.watchVideo')).toBeInTheDocument();
    expect(screen.getByText('mocked_common.downloadGuide')).toBeInTheDocument();
  });

  it('applies RTL styling for Arabic', () => {
    const mockUseLanguage = jest.fn(() => ({ language: 'ar' }));
    jest.doMock('@/hooks/useLanguageCompat', () => ({
      useLanguage: mockUseLanguage,
    }));

    render(<HowToUsePanel moduleKey="test-module" />);

    const header = screen.getByText('mocked_test-module.howToUse.title');
    fireEvent.click(header);

    const contentDiv = screen.getByText('mocked_test-module.howToUse.description').closest('div');
    expect(contentDiv).toHaveClass('text-right');
  });
});