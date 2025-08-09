import React from 'react';
import ObservabilityDashboard from '@/components/analytics/ObservabilityDashboard';
import FeedbackWidget from '@/components/feedback/FeedbackWidget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AqlHRAIAssistant from '@/components/ai/AqlHRAIAssistant';

const DebugPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🐛 Debug & Analytics Testing</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This page is for testing the analytics dashboard and feedback components.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>📊 Observability Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <ObservabilityDashboard />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>💬 Feedback Widget Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <FeedbackWidget 
              moduleName="debug"
              trigger="button"
              position="inline"
            />
            <FeedbackWidget 
              moduleName="debug"
              trigger="icon"
              position="inline"
            />
            <FeedbackWidget 
              moduleName="debug"
              trigger="text"
              position="inline"
            />
          </div>
        </CardContent>
      </Card>

      {/* Fixed position feedback widget */}
      <FeedbackWidget 
        moduleName="debug"
        trigger="button"
        position="fixed"
      />

      {/* AI Assistant */}
      <AqlHRAIAssistant moduleContext="debug.testing" />
    </div>
  );
};

export default DebugPage;