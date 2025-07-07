import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPin, 
  Clock, 
  Camera, 
  Wifi, 
  WifiOff, 
  Play, 
  Square, 
  Coffee,
  CheckCircle2,
  XCircle,
  Smartphone
} from "lucide-react";
import { Geolocation } from '@capacitor/geolocation';
import { Camera as CapCamera, CameraResultType } from '@capacitor/camera';
import { supabase } from "@/integrations/supabase/client";

interface AttendanceSession {
  id: string;
  check_in_time: string;
  check_out_time?: string;
  work_hours?: number;
  status: string;
  location_lat?: number;
  location_lng?: number;
}

interface AttendanceLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius_meters: number;
}

const MobileAttendanceApp = () => {
  const [currentSession, setCurrentSession] = useState<AttendanceSession | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [attendanceLocations, setAttendanceLocations] = useState<AttendanceLocation[]>([]);
  const [isInGeofence, setIsInGeofence] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [breakTimer, setBreakTimer] = useState<number | null>(null);
  const [activeBreakId, setActiveBreakId] = useState<string | null>(null);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Get current location
  useEffect(() => {
    getCurrentLocation();
    const interval = setInterval(getCurrentLocation, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Check geofence when location changes
  useEffect(() => {
    if (currentLocation && attendanceLocations.length > 0) {
      checkGeofence();
    }
  }, [currentLocation, attendanceLocations]);

  const getCurrentLocation = async () => {
    try {
      const coordinates = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000
      });
      
      setCurrentLocation({
        lat: coordinates.coords.latitude,
        lng: coordinates.coords.longitude
      });
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const checkGeofence = () => {
    if (!currentLocation) return;

    const isWithin = attendanceLocations.some(location => {
      const distance = calculateDistance(
        currentLocation.lat,
        currentLocation.lng,
        location.latitude,
        location.longitude
      );
      return distance <= location.radius_meters;
    });

    setIsInGeofence(isWithin);
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  const takePhoto = async () => {
    try {
      const image = await CapCamera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64
      });
      return image.webPath;
    } catch (error) {
      console.error('Error taking photo:', error);
      return null;
    }
  };

  const handleCheckIn = async () => {
    if (!isInGeofence) {
      alert('You must be within an approved location to check in');
      return;
    }

    setIsLoading(true);
    try {
      const photoUrl = await takePhoto();
      
      const response = await supabase.functions.invoke('mobile-attendance/check-in', {
        body: {
          employee_id: 'current-employee-id', // This should come from auth context
          device_info: {
            device_type: getDeviceType(),
            device_name: navigator.userAgent,
            os_version: getOSVersion(),
            app_version: '1.0.0'
          },
          location: {
            latitude: currentLocation!.lat,
            longitude: currentLocation!.lng,
            accuracy: 5
          },
          photo_url: photoUrl
        }
      });

      if (response.data?.success) {
        setCurrentSession({
          id: response.data.session_id,
          check_in_time: response.data.check_in_time,
          status: 'active'
        });
      }
    } catch (error) {
      console.error('Check-in error:', error);
      alert('Failed to check in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!currentSession) return;

    setIsLoading(true);
    try {
      const photoUrl = await takePhoto();
      
      const response = await supabase.functions.invoke('mobile-attendance/check-out', {
        body: {
          session_id: currentSession.id,
          location: {
            latitude: currentLocation!.lat,
            longitude: currentLocation!.lng,
            accuracy: 5
          },
          photo_url: photoUrl
        }
      });

      if (response.data?.success) {
        setCurrentSession(null);
        alert(`Work completed! Hours: ${response.data.work_hours}`);
      }
    } catch (error) {
      console.error('Check-out error:', error);
      alert('Failed to check out. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBreakStart = async (breakType: string = 'regular') => {
    if (!currentSession) return;

    try {
      const response = await supabase.functions.invoke('mobile-attendance/break-start', {
        body: {
          session_id: currentSession.id,
          break_type: breakType
        }
      });

      if (response.data?.success) {
        setActiveBreakId(response.data.break_id);
        setBreakTimer(Date.now());
      }
    } catch (error) {
      console.error('Break start error:', error);
    }
  };

  const handleBreakEnd = async () => {
    if (!activeBreakId) return;

    try {
      const response = await supabase.functions.invoke('mobile-attendance/break-end', {
        body: {
          break_id: activeBreakId
        }
      });

      if (response.data?.success) {
        setActiveBreakId(null);
        setBreakTimer(null);
        alert(`Break ended. Duration: ${response.data.duration_minutes} minutes`);
      }
    } catch (error) {
      console.error('Break end error:', error);
    }
  };

  const getDeviceType = (): 'ios' | 'android' | 'harmony' => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('iphone') || userAgent.includes('ipad')) return 'ios';
    if (userAgent.includes('android')) return 'android';
    return 'harmony'; // Default fallback
  };

  const getOSVersion = (): string => {
    const userAgent = navigator.userAgent;
    const match = userAgent.match(/(?:Version|Android|OS)\/([0-9._]+)/);
    return match ? match[1] : 'Unknown';
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      {/* Status Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Mobile Attendance
            </CardTitle>
            <div className="flex items-center gap-2">
              {isOnline ? (
                <Badge variant="secondary" className="bg-green-50 text-green-700">
                  <Wifi className="h-3 w-3 mr-1" />
                  Online
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-red-50 text-red-700">
                  <WifiOff className="h-3 w-3 mr-1" />
                  Offline
                </Badge>
              )}
            </div>
          </div>
          <CardDescription>
            {isInGeofence ? (
              <span className="text-green-600 flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" />
                Within approved location
              </span>
            ) : (
              <span className="text-red-600 flex items-center gap-1">
                <XCircle className="h-4 w-4" />
                Outside approved location
              </span>
            )}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Main Action */}
      <Card>
        <CardContent className="pt-6">
          {!currentSession ? (
            <Button 
              onClick={handleCheckIn}
              disabled={!isInGeofence || isLoading}
              className="w-full h-16 text-lg bg-gradient-primary hover:opacity-90"
            >
              <Play className="h-6 w-6 mr-2" />
              {isLoading ? 'Checking In...' : 'Check In'}
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Checked in at</p>
                <p className="text-2xl font-bold text-brand-primary">
                  {formatTime(currentSession.check_in_time)}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {!activeBreakId ? (
                  <Button
                    onClick={() => handleBreakStart('regular')}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Coffee className="h-4 w-4" />
                    Start Break
                  </Button>
                ) : (
                  <Button
                    onClick={handleBreakEnd}
                    variant="outline"
                    className="flex items-center gap-2 border-orange-200 text-orange-700"
                  >
                    <Square className="h-4 w-4" />
                    End Break
                  </Button>
                )}
                
                <Button
                  onClick={handleCheckOut}
                  disabled={isLoading}
                  className="flex items-center gap-2 bg-gradient-secondary hover:opacity-90"
                >
                  <Square className="h-4 w-4" />
                  {isLoading ? 'Checking Out...' : 'Check Out'}
                </Button>
              </div>

              {breakTimer && (
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <p className="text-sm text-orange-700">Break timer running</p>
                  <p className="font-mono text-lg text-orange-800">
                    {Math.floor((Date.now() - breakTimer) / 60000)} minutes
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Location Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Current Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentLocation ? (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Lat: {currentLocation.lat.toFixed(6)}
              </p>
              <p className="text-sm text-muted-foreground">
                Lng: {currentLocation.lng.toFixed(6)}
              </p>
              <Badge variant={isInGeofence ? "secondary" : "destructive"}>
                {isInGeofence ? "Inside Geofence" : "Outside Geofence"}
              </Badge>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Getting location...</p>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <Clock className="h-8 w-8 mx-auto mb-2 text-brand-primary" />
              <p className="text-2xl font-bold">8.5h</p>
              <p className="text-xs text-muted-foreground">Today's Hours</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <Camera className="h-8 w-8 mx-auto mb-2 text-brand-accent" />
              <p className="text-2xl font-bold">2</p>
              <p className="text-xs text-muted-foreground">Photos Taken</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MobileAttendanceApp;