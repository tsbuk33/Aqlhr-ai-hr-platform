import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// Lazy load pages for better performance
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const SystemOverview = lazy(() => import('@/pages/SystemOverview'));
const GovIntegrationHub = lazy(() => import('@/pages/government/GovIntegrationHub'));
const MUDADIntegration = lazy(() => import('@/pages/government/MUDADIntegration'));
const MUQEEMIntegration = lazy(() => import('@/pages/government/MUQEEMIntegration'));
const NAJIZIntegration = lazy(() => import('@/pages/government/NAJIZIntegration'));
const GOSIIntegration = lazy(() => import('@/pages/government/GOSIIntegration'));
const NITAQATIntegration = lazy(() => import('@/pages/government/NITAQATIntegration'));
const TVTCIntegration = lazy(() => import('@/pages/government/TVTCIntegration'));
const MOLIntegration = lazy(() => import('@/pages/government/MOLIntegration'));
const ELMIntegration = lazy(() => import('@/pages/government/ELMIntegration'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/system-overview" element={<SystemOverview />} />
        <Route path="/government" element={<GovIntegrationHub />} />
        <Route path="/government/mudad" element={<MUDADIntegration />} />
        <Route path="/government/muqeem" element={<MUQEEMIntegration />} />
        <Route path="/government/najiz" element={<NAJIZIntegration />} />
        <Route path="/government/gosi" element={<GOSIIntegration />} />
        <Route path="/government/nitaqat" element={<NITAQATIntegration />} />
        <Route path="/government/tvtc" element={<TVTCIntegration />} />
        <Route path="/government/mol" element={<MOLIntegration />} />
        <Route path="/government/elm" element={<ELMIntegration />} />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;