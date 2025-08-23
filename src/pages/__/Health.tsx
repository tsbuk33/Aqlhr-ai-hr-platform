import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export default function HealthPage() {
  const [stats, setStats] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (supabase as any).from('aqlhr_core.core_health_v1').select('*')
      .then(({ data, error }: any) => {
        if (error) setErr(error.message);
        else setStats((data && data[0]) || {});
      });
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">AqlHR Kernel Health</h1>
      {err && <div className="text-red-600">Error: {err}</div>}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card title="Queued" value={stats?.queued ?? '—'} />
        <Card title="Processing" value={stats?.processing ?? '—'} />
        <Card title="Failed" value={stats?.failed ?? '—'} />
        <Card title="Last Audit" value={stats?.last_audit_at ?? '—'} />
      </div>
      <p className="text-sm text-gray-500">PDPL-safe: shows aggregate kernel stats only.</p>
    </div>
  );
}

function Card({ title, value }: { title: string; value: any }) {
  return (
    <div className="rounded border p-4 bg-white dark:bg-neutral-900">
      <div className="text-xs uppercase text-gray-500">{title}</div>
      <div className="text-2xl font-bold">{String(value)}</div>
    </div>
  );
}