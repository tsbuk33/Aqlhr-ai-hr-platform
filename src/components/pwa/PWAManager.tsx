import { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Smartphone, Wifi, WifiOff, Database } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface PWAManagerProps {
  showInstallPrompt?: boolean;
}

export const PWAManager = ({ showInstallPrompt = true }: PWAManagerProps) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [cacheStatus, setCacheStatus] = useState<'loading' | 'cached' | 'error'>('loading');

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || 
        (window.navigator as any).standalone === true) {
      setIsInstalled(true);
    }

    // Listen for PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    // Listen for successful installation
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      toast({
        title: isRTL ? "تم التثبيت بنجاح" : "Successfully Installed",
        description: isRTL ? "يمكنك الآن استخدام التطبيق من الشاشة الرئيسية" : "You can now use the app from your home screen"
      });
    };

    // Listen for online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check cache status
    checkCacheStatus();

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isRTL]);

  const checkCacheStatus = async () => {
    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        if (cacheNames.length > 0) {
          setCacheStatus('cached');
        }
      }
    } catch (error) {
      setCacheStatus('error');
    }
  };

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  const clearCache = async () => {
    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
        setCacheStatus('loading');
        window.location.reload();
      }
    } catch (error) {
      toast({
        title: isRTL ? "خطأ في مسح الذاكرة المؤقتة" : "Cache Clear Error",
        description: isRTL ? "فشل في مسح الذاكرة المؤقتة" : "Failed to clear cache",
        variant: "destructive"
      });
    }
  };

  const refreshApp = () => {
    window.location.reload();
  };

  return (
    <div className={`space-y-4 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* PWA Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            {isRTL ? 'حالة التطبيق التقدمي' : 'Progressive Web App Status'}
          </CardTitle>
          <CardDescription>
            {isRTL ? 'معلومات حول التثبيت والاستخدام بدون اتصال' : 'Installation and offline usage information'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {/* Installation Status */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Download className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">
                  {isRTL ? 'حالة التثبيت' : 'Installation Status'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isInstalled 
                    ? (isRTL ? 'مثبت كتطبيق' : 'Installed as app')
                    : (isRTL ? 'يعمل في المتصفح' : 'Running in browser')
                  }
                </p>
              </div>
            </div>
            <Badge variant={isInstalled ? "default" : "secondary"}>
              {isInstalled 
                ? (isRTL ? 'مثبت' : 'Installed') 
                : (isRTL ? 'غير مثبت' : 'Not Installed')
              }
            </Badge>
          </div>

          {/* Online Status */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              {isOnline ? (
                <Wifi className="h-5 w-5 text-success" />
              ) : (
                <WifiOff className="h-5 w-5 text-warning" />
              )}
              <div>
                <p className="font-medium">
                  {isRTL ? 'حالة الاتصال' : 'Connection Status'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isOnline 
                    ? (isRTL ? 'متصل بالإنترنت' : 'Connected to internet')
                    : (isRTL ? 'غير متصل - وضع بدون اتصال' : 'Offline - cached mode')
                  }
                </p>
              </div>
            </div>
            <Badge variant={isOnline ? "default" : "outline"}>
              {isOnline 
                ? (isRTL ? 'متصل' : 'Online') 
                : (isRTL ? 'غير متصل' : 'Offline')
              }
            </Badge>
          </div>

          {/* Cache Status */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Database className="h-5 w-5 text-accent" />
              <div>
                <p className="font-medium">
                  {isRTL ? 'حالة الذاكرة المؤقتة' : 'Cache Status'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {cacheStatus === 'cached' 
                    ? (isRTL ? 'البيانات محفوظة للاستخدام بدون اتصال' : 'Data cached for offline use')
                    : cacheStatus === 'loading'
                    ? (isRTL ? 'جاري التحميل...' : 'Loading...')
                    : (isRTL ? 'خطأ في الذاكرة المؤقتة' : 'Cache error')
                  }
                </p>
              </div>
            </div>
            <Badge 
              variant={
                cacheStatus === 'cached' ? "default" : 
                cacheStatus === 'loading' ? "secondary" : "destructive"
              }
            >
              {cacheStatus === 'cached' 
                ? (isRTL ? 'محفوظ' : 'Cached')
                : cacheStatus === 'loading'
                ? (isRTL ? 'جاري التحميل' : 'Loading')
                : (isRTL ? 'خطأ' : 'Error')
              }
            </Badge>
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-4">
            {showInstallPrompt && deferredPrompt && !isInstalled && (
              <Button onClick={handleInstallApp} className="w-full gap-2">
                <Download className="h-4 w-4" />
                {isRTL ? 'تثبيت التطبيق' : 'Install App'}
              </Button>
            )}
            
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={refreshApp} className="gap-2">
                <Smartphone className="h-4 w-4" />
                {isRTL ? 'تحديث' : 'Refresh'}
              </Button>
              <Button variant="outline" onClick={clearCache} className="gap-2">
                <Database className="h-4 w-4" />
                {isRTL ? 'مسح الذاكرة' : 'Clear Cache'}
              </Button>
            </div>
          </div>

          {/* Offline Features */}
          {!isOnline && (
            <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
              <h4 className="font-medium text-warning mb-2">
                {isRTL ? 'الميزات المتاحة بدون اتصال:' : 'Available Offline Features:'}
              </h4>
              <ul className="text-sm space-y-1">
                <li>• {isRTL ? 'عرض البيانات المحفوظة' : 'View cached data'}</li>
                <li>• {isRTL ? 'الترجمات المحلية' : 'Local translations'}</li>
                <li>• {isRTL ? 'الإعدادات الشخصية' : 'User preferences'}</li>
                <li>• {isRTL ? 'التقارير المحفوظة' : 'Saved reports'}</li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};