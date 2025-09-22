import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// Lazy load pages for better performance
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const SystemOverview = lazy(() => import('@/pages/SystemOverview'));
const GovIntegrationHub = lazy(() => import('@/pages/government/GovIntegrationHub'));
const MUDADIntegration = lazy(() => import('@/pages/government/MUDADIntegration'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/system-overview" element={<SystemOverview />} />
        <Route path="/government" element={<GovIntegrationHub />} />
        <Route path="/government/mudad" element={<MUDADIntegration />} />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
};