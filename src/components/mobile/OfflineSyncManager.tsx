import React, { useState, useEffect } from 'react';
import { Network } from '@capacitor/network';
import { Storage } from '@capacitor/storage';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Database, 
  Upload, 
  Download,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';

interface OfflineData {
  id: string;
  type: 'attendance' | 'leave_request' | 'document' | 'timesheet';
  timestamp: string;
  data: any;
  status: 'pending' | 'syncing' | 'synced' | 'failed';
  retryCount: number;
}

interface SyncManagerProps {
  isArabic: boolean;
  onSyncComplete?: (results: SyncResult[]) => void;
}

interface SyncResult {
  id: string;
  type: string;
  success: boolean;
  error?: string;
}

export const OfflineSyncManager: React.FC<SyncManagerProps> = ({ 
  isArabic, 
  onSyncComplete 
}) => {
  const [isOnline, setIsOnline] = useState(true);
  const [offlineData, setOfflineData] = useState<OfflineData[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  useEffect(() => {
    initializeSync();
    setupNetworkListener();
    loadOfflineData();
  }, []);

  const initializeSync = async () => {
    try {
      const { value } = await Storage.get({ key: 'last_sync_time' });
      if (value) {
        setLastSyncTime(new Date(value));
      }
    } catch (error) {
      console.error('Error initializing sync:', error);
    }
  };

  const setupNetworkListener = async () => {
    try {
      const status = await Network.getStatus();
      setIsOnline(status.connected);

      Network.addListener('networkStatusChange', async (status) => {
        const wasOffline = !isOnline;
        setIsOnline(status.connected);
        
        // Auto-sync when coming back online
        if (wasOffline && status.connected) {
          setTimeout(() => {
            handleAutoSync();
          }, 2000); // Wait 2 seconds for connection to stabilize
        }
      });
    } catch (error) {
      console.error('Error setting up network listener:', error);
    }
  };

  const loadOfflineData = async () => {
    try {
      const { value } = await Storage.get({ key: 'offline_sync_queue' });
      if (value) {
        const data = JSON.parse(value) as OfflineData[];
        setOfflineData(data);
      }
    } catch (error) {
      console.error('Error loading offline data:', error);
    }
  };

  const saveOfflineData = async (data: OfflineData[]) => {
    try {
      await Storage.set({
        key: 'offline_sync_queue',
        value: JSON.stringify(data)
      });
      setOfflineData(data);
    } catch (error) {
      console.error('Error saving offline data:', error);
    }
  };

  const addToSyncQueue = async (type: OfflineData['type'], data: any) => {
    const newItem: OfflineData = {
      id: `${type}_${Date.now()}`,
      type,
      timestamp: new Date().toISOString(),
      data,
      status: 'pending',
      retryCount: 0
    };

    const updatedQueue = [...offlineData, newItem];
    await saveOfflineData(updatedQueue);

    // Try to sync immediately if online
    if (isOnline) {
      syncSingleItem(newItem);
    }
  };

  const handleAutoSync = async () => {
    if (!isOnline || offlineData.length === 0) return;
    
    console.log('Auto-sync triggered');
    await handleManualSync();
  };

  const handleManualSync = async () => {
    if (!isOnline) {
      console.log('Cannot sync while offline');
      return;
    }

    setIsSyncing(true);
    setSyncProgress(0);

    const pendingItems = offlineData.filter(item => 
      item.status === 'pending' || item.status === 'failed'
    );

    const results: SyncResult[] = [];
    
    for (let i = 0; i < pendingItems.length; i++) {
      const item = pendingItems[i];
      setSyncProgress(((i + 1) / pendingItems.length) * 100);
      
      const result = await syncSingleItem(item);
      results.push(result);
      
      // Small delay between syncs
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsSyncing(false);
    setSyncProgress(100);
    
    // Update last sync time
    const now = new Date();
    setLastSyncTime(now);
    await Storage.set({ key: 'last_sync_time', value: now.toISOString() });

    // Notify completion
    if (onSyncComplete) {
      onSyncComplete(results);
    }

    // Clean up synced items
    setTimeout(() => {
      cleanupSyncedItems();
    }, 1000);
  };

  const syncSingleItem = async (item: OfflineData): Promise<SyncResult> => {
    try {
      // Update item status to syncing
      const updatedData = offlineData.map(d => 
        d.id === item.id ? { ...d, status: 'syncing' as const } : d
      );
      await saveOfflineData(updatedData);

      // Simulate API call based on item type
      const success = await performSync(item);
      
      if (success) {
        // Mark as synced
        const finalData = offlineData.map(d => 
          d.id === item.id ? { ...d, status: 'synced' as const } : d
        );
        await saveOfflineData(finalData);
        
        return { id: item.id, type: item.type, success: true };
      } else {
        throw new Error('Sync failed');
      }
    } catch (error) {
      console.error(`Error syncing item ${item.id}:`, error);
      
      // Mark as failed and increment retry count
      const failedData = offlineData.map(d => 
        d.id === item.id ? { 
          ...d, 
          status: 'failed' as const, 
          retryCount: d.retryCount + 1 
        } : d
      );
      await saveOfflineData(failedData);
      
      return { 
        id: item.id, 
        type: item.type, 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  };

  const performSync = async (item: OfflineData): Promise<boolean> => {
    // Simulate different sync operations
    const delay = Math.random() * 2000 + 1000; // 1-3 second delay
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Simulate 90% success rate
    const success = Math.random() > 0.1;
    
    switch (item.type) {
      case 'attendance':
        console.log('Syncing attendance record:', item.data);
        break;
      case 'leave_request':
        console.log('Syncing leave request:', item.data);
        break;
      case 'document':
        console.log('Syncing document:', item.data);
        break;
      case 'timesheet':
        console.log('Syncing timesheet:', item.data);
        break;
    }
    
    return success;
  };

  const cleanupSyncedItems = async () => {
    const pendingItems = offlineData.filter(item => 
      item.status !== 'synced'
    );
    await saveOfflineData(pendingItems);
  };

  const retryFailedItem = async (itemId: string) => {
    const item = offlineData.find(d => d.id === itemId);
    if (item && isOnline) {
      await syncSingleItem(item);
    }
  };

  const removeFailedItem = async (itemId: string) => {
    const updatedData = offlineData.filter(d => d.id !== itemId);
    await saveOfflineData(updatedData);
  };

  const getStatusIcon = (status: OfflineData['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'syncing':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'synced':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusText = (status: OfflineData['status']) => {
    if (isArabic) {
      switch (status) {
        case 'pending':
          return 'في الانتظار';
        case 'syncing':
          return 'جاري المزامنة';
        case 'synced':
          return 'تمت المزامنة';
        case 'failed':
          return 'فشلت';
      }
    } else {
      switch (status) {
        case 'pending':
          return 'Pending';
        case 'syncing':
          return 'Syncing';
        case 'synced':
          return 'Synced';
        case 'failed':
          return 'Failed';
      }
    }
  };

  const getTypeText = (type: OfflineData['type']) => {
    if (isArabic) {
      switch (type) {
        case 'attendance':
          return 'الحضور';
        case 'leave_request':
          return 'طلب إجازة';
        case 'document':
          return 'مستند';
        case 'timesheet':
          return 'جدول الأعمال';
      }
    } else {
      switch (type) {
        case 'attendance':
          return 'Attendance';
        case 'leave_request':
          return 'Leave Request';
        case 'document':
          return 'Document';
        case 'timesheet':
          return 'Timesheet';
      }
    }
  };

  const pendingCount = offlineData.filter(item => 
    item.status === 'pending' || item.status === 'failed'
  ).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isOnline ? (
            <Wifi className="h-5 w-5 text-green-500" />
          ) : (
            <WifiOff className="h-5 w-5 text-red-500" />
          )}
          {isArabic ? 'إدارة المزامنة' : 'Sync Manager'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm">
              {isOnline 
                ? (isArabic ? 'متصل' : 'Connected')
                : (isArabic ? 'غير متصل' : 'Offline')
              }
            </span>
          </div>
          {pendingCount > 0 && (
            <Badge variant="outline">
              {pendingCount} {isArabic ? 'في الانتظار' : 'pending'}
            </Badge>
          )}
        </div>

        {/* Sync Progress */}
        {isSyncing && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>{isArabic ? 'جاري المزامنة...' : 'Syncing...'}</span>
              <span>{Math.round(syncProgress)}%</span>
            </div>
            <Progress value={syncProgress} />
          </div>
        )}

        {/* Sync Button */}
        <Button 
          onClick={handleManualSync}
          disabled={!isOnline || isSyncing || pendingCount === 0}
          className="w-full"
        >
          {isSyncing ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              {isArabic ? 'جاري المزامنة...' : 'Syncing...'}
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              {isArabic ? 'مزامنة البيانات' : 'Sync Data'} ({pendingCount})
            </>
          )}
        </Button>

        {/* Last Sync Time */}
        {lastSyncTime && (
          <div className="text-xs text-muted-foreground text-center">
            {isArabic ? 'آخر مزامنة: ' : 'Last sync: '}
            {lastSyncTime.toLocaleString()}
          </div>
        )}

        {/* Offline Data Queue */}
        {offlineData.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">
              {isArabic ? 'قائمة انتظار البيانات' : 'Data Queue'}
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {offlineData.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2 border rounded text-sm">
                  <div className="flex items-center gap-2 flex-1">
                    {getStatusIcon(item.status)}
                    <span className="font-medium">{getTypeText(item.type)}</span>
                    <span className="text-muted-foreground">
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {getStatusText(item.status)}
                    </Badge>
                    {item.status === 'failed' && (
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => retryFailedItem(item.id)}
                          disabled={!isOnline}
                          className="h-6 w-6 p-0"
                        >
                          <RefreshCw className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFailedItem(item.id)}
                          className="h-6 w-6 p-0"
                        >
                          <XCircle className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Offline Message */}
        {!isOnline && (
          <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm text-yellow-800">
              {isArabic 
                ? 'البيانات ستتم مزامنتها تلقائياً عند الاتصال بالإنترنت'
                : 'Data will sync automatically when connection is restored'
              }
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};