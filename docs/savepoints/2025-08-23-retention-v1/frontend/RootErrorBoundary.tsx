// RootErrorBoundary.tsx Component Snapshot
// Date: 2025-08-23
// Global error handling with UI event logging and bilingual fallback

import React, { Component, ReactNode } from 'react';
import { getTenantIdOrDemo } from '@/lib/tenant/getTenantId';
import { supabase } from '@/integrations/supabase/client';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class RootErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  async componentDidCatch(error: Error, errorInfo: any) {
    // Log to ui_events
    try {
      const tenantId = await getTenantIdOrDemo();
      await supabase.from('ui_events').insert({
        tenant_id: tenantId,
        event_type: 'error',
        level: 'error',
        page: window.location.pathname,
        message: error.message,
        metadata: {
          stack: error.stack,
          componentStack: errorInfo.componentStack
        }
      });
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center p-6">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Something went wrong / حدث خطأ ما
            </h1>
            <p className="text-muted-foreground mb-4">
              Please refresh the page / يرجى تحديث الصفحة
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Refresh / تحديث
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}