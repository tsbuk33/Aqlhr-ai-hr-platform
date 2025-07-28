import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ModuleTooltip from '@/components/universal/ModuleTooltip';

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

describe('ModuleTooltip', () => {
  it('renders tooltip trigger with children', () => {
    render(
      <ModuleTooltip moduleKey="test-module">
        <span>Test Content</span>
      </ModuleTooltip>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('shows help icon when showIcon is true', () => {
    render(
      <ModuleTooltip moduleKey="test-module" showIcon>
        <span>Test Content</span>
      </ModuleTooltip>
    );

    const helpIcon = document.querySelector('.lucide-help-circle');
    expect(helpIcon).toBeInTheDocument();
  });

  it('displays tooltip content on hover', async () => {
    render(
      <ModuleTooltip moduleKey="test-module">
        <span>Test Content</span>
      </ModuleTooltip>
    );

    const trigger = screen.getByText('Test Content');
    fireEvent.mouseEnter(trigger);

    await waitFor(() => {
      expect(screen.getByText('mocked_test-module.tooltip')).toBeInTheDocument();
    });
  });

  it('applies correct text direction for Arabic', () => {
    const mockUseLanguage = jest.fn(() => ({ language: 'ar' }));
    jest.doMock('@/hooks/useLanguageCompat', () => ({
      useLanguage: mockUseLanguage,
    }));

    render(
      <ModuleTooltip moduleKey="test-module">
        <span>Test Content</span>
      </ModuleTooltip>
    );

    const trigger = screen.getByText('Test Content');
    fireEvent.mouseEnter(trigger);

    // Check for RTL text direction in tooltip content
    const tooltipContent = document.querySelector('[role="tooltip"]');
    expect(tooltipContent).toHaveClass('text-right');
  });
});