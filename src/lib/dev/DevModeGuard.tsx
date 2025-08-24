import { useEffect, ReactNode, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ensureDemoData } from './ensureDemoData';

export async function ensureDevTenant() {
  const url = new URL(window.location.href);
  const dev = url.searchParams.get('dev') === '1' || import.meta.env.MODE === 'development';
  if (!dev) return;
  // Cache to avoid repeated RPC
  const cached = localStorage.getItem('aqlhr.demoTenant');
  if (cached) return;
  const { data, error } = await supabase.rpc('get_demo_tenant_id');
  if (!error && data) localStorage.setItem('aqlhr.demoTenant', data);
}

interface DevModeGuardProps {
  children: ReactNode;
}

export default function DevModeGuard({ children }: DevModeGuardProps) {
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedingStatus, setSeedingStatus] = useState<string>('');

  useEffect(() => {
    async function initializeDevMode() {
      const url = new URL(window.location.href);
      const dev = url.searchParams.get('dev') === '1' || import.meta.env.MODE === 'development';
      
      if (!dev) return;

      try {
        // First ensure we have a demo tenant
        await ensureDevTenant();
        
        // Then ensure demo data exists
        setIsSeeding(true);
        setSeedingStatus('Preparing demo data...');
        
        const result = await ensureDemoData();
        
        if (result.seeded) {
          setSeedingStatus('Demo data ready');
          setTimeout(() => setSeedingStatus(''), 3000);
        } else if (result.error) {
          setSeedingStatus(`Demo setup failed: ${result.error}`);
        }
      } catch (error: any) {
        setSeedingStatus(`Demo setup error: ${error.message}`);
        console.error('Dev mode initialization failed:', error);
      } finally {
        setIsSeeding(false);
      }
    }

    initializeDevMode();
  }, []);

  return (
    <>
      {seedingStatus && (
        <div className="fixed top-4 right-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md shadow-lg">
          {isSeeding && <span className="animate-pulse">⏳ </span>}
          {seedingStatus}
        </div>
      )}
      {children}
    </>
  );
}