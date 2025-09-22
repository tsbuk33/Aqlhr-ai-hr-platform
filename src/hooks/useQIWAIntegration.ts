import { useState, useEffect } from 'react';

interface QIWAActivity {
  title: string;
  description: string;
  timestamp: string;
}

interface QIWAIntegrationState {
  connectionStatus: 'connected' | 'disconnected' | 'connecting';
  activeJobPostings: number;
  totalApplications: number;
  saudizationRate: number;
  complianceScore: number;
  recentActivities: QIWAActivity[];
  loading: boolean;
}

export const useQIWAIntegration = () => {
  const [state, setState] = useState<QIWAIntegrationState>({
    connectionStatus: 'disconnected',
    activeJobPostings: 0,
    totalApplications: 0,
    saudizationRate: 0,
    complianceScore: 0,
    recentActivities: [],
    loading: false,
  });

  // Load demo data
  useEffect(() => {
    const loadQIWAData = () => {
      const activities: QIWAActivity[] = [
        {
          title: 'Job Posted: Senior Software Engineer',
          description: 'New position posted on QIWA platform',
          timestamp: '2 hours ago'
        },
        {
          title: 'Compliance Status Updated',
          description: 'Saudization rate updated to 64%',
          timestamp: '4 hours ago'
        },
        {
          title: 'Application Received',
          description: '15 new applications for Marketing Manager position',
          timestamp: '6 hours ago'
        },
        {
          title: 'Ministry Report Submitted',
          description: 'Monthly employment report sent to MHRSD',
          timestamp: '1 day ago'
        },
        {
          title: 'Nitaqat Status: Green',
          description: 'Company maintained green classification',
          timestamp: '2 days ago'
        }
      ];

      setState(prev => ({
        ...prev,
        activeJobPostings: 23,
        totalApplications: 147,
        saudizationRate: 64,
        complianceScore: 92,
        recentActivities: activities,
        connectionStatus: 'connected', // Demo mode
      }));
    };

    loadQIWAData();
  }, []);

  const connect = async () => {
    setState(prev => ({ ...prev, loading: true, connectionStatus: 'connecting' }));
    
    // Simulate connection process
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    setState(prev => ({
      ...prev,
      loading: false,
      connectionStatus: 'connected',
    }));
  };

  const disconnect = async () => {
    setState(prev => ({ ...prev, loading: true }));
    
    // Simulate disconnection
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setState(prev => ({
      ...prev,
      loading: false,
      connectionStatus: 'disconnected',
    }));
  };

  const postJob = async () => {
    if (state.connectionStatus !== 'connected') return;
    
    setState(prev => ({ ...prev, loading: true }));
    
    // Simulate job posting
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newActivity: QIWAActivity = {
      title: 'New Job Posted Successfully',
      description: 'Position published on QIWA platform',
      timestamp: 'Just now'
    };
    
    setState(prev => ({
      ...prev,
      loading: false,
      activeJobPostings: prev.activeJobPostings + 1,
      recentActivities: [newActivity, ...prev.recentActivities.slice(0, 4)]
    }));
  };

  const reviewApplications = async () => {
    if (state.connectionStatus !== 'connected') return;
    
    setState(prev => ({ ...prev, loading: true }));
    
    // Simulate application review
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    setState(prev => ({
      ...prev,
      loading: false,
      totalApplications: prev.totalApplications + Math.floor(Math.random() * 5) + 1,
    }));
  };

  const updateSaudizationStatus = async () => {
    if (state.connectionStatus !== 'connected') return;
    
    setState(prev => ({ ...prev, loading: true }));
    
    // Simulate saudization update
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newActivity: QIWAActivity = {
      title: 'Saudization Status Updated',
      description: 'Compliance metrics synchronized with QIWA',
      timestamp: 'Just now'
    };
    
    setState(prev => ({
      ...prev,
      loading: false,
      saudizationRate: Math.min(prev.saudizationRate + 1, 100),
      complianceScore: Math.min(prev.complianceScore + 2, 100),
      recentActivities: [newActivity, ...prev.recentActivities.slice(0, 4)]
    }));
  };

  return {
    ...state,
    connect,
    disconnect,
    postJob,
    reviewApplications,
    updateSaudizationStatus,
  };
};