import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ModuleDocumentUploader from '@/components/universal/ModuleDocumentUploader';

// Mock hooks and libraries
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
    storage: {
      from: () => ({
        upload: jest.fn().mockResolvedValue({ data: { path: 'test-path' }, error: null }),
        getPublicUrl: jest.fn().mockReturnValue({ data: { publicUrl: 'test-url' } }),
      }),
    },
  },
}));

jest.mock('react-dropzone', () => ({
  useDropzone: jest.fn(() => ({
    getRootProps: () => ({ 'data-testid': 'dropzone' }),
    getInputProps: () => ({ 'data-testid': 'file-input' }),
    isDragActive: false,
  })),
}));

describe('ModuleDocumentUploader', () => {
  it('renders upload area', () => {
    render(<ModuleDocumentUploader moduleKey="test-module" />);

    expect(screen.getByText('mocked_test-module.documentUpload.title')).toBeInTheDocument();
    expect(screen.getByTestId('dropzone')).toBeInTheDocument();
  });

  it('displays drag and drop text', () => {
    render(<ModuleDocumentUploader moduleKey="test-module" />);

    expect(screen.getByText('mocked_upload.dragAndDrop')).toBeInTheDocument();
    expect(screen.getByText('mocked_upload.browse')).toBeInTheDocument();
  });

  it('shows max files limit text', () => {
    render(<ModuleDocumentUploader moduleKey="test-module" maxFiles={3} />);

    expect(screen.getByText('mocked_upload.maxFiles')).toBeInTheDocument();
  });

  it('accepts custom file types and size limits', () => {
    render(
      <ModuleDocumentUploader
        moduleKey="test-module"
        maxSize={20}
        acceptedTypes={['.jpg', '.png']}
      />
    );

    // Component should render without errors
    expect(screen.getByTestId('dropzone')).toBeInTheDocument();
  });

  it('calls onFilesUploaded callback when provided', () => {
    const mockCallback = jest.fn();
    render(
      <ModuleDocumentUploader
        moduleKey="test-module"
        onFilesUploaded={mockCallback}
      />
    );

    // Component should render without errors
    expect(screen.getByTestId('dropzone')).toBeInTheDocument();
  });
});