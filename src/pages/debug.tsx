import ObservabilityDashboard from '@/components/analytics/ObservabilityDashboard';
import FeedbackWidget from '@/components/feedback/FeedbackWidget';
import { useState } from 'react';

export default function DebugPage() {
  const [companyId] = useState<string>('550e8400-e29b-41d4-a716-446655440000'); // replace with a valid company_id

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">AqlHR Debug</h1>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Observability Dashboard</h2>
        <ObservabilityDashboard />
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">Feedback Widget</h2>
        <FeedbackWidget moduleName="debug" />
      </section>
    </div>
  );
}