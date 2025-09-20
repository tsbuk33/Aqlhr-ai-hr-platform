import React, { useState, useEffect } from 'react';
import { Geolocation, Position } from '@capacitor/geolocation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  MapPin, 
  Clock, 
  Play, 
  Square, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle,
  Navigation
} from 'lucide-react';

interface GPSTimeTrackerProps {
  onCheckIn: (location?: { latitude: number; longitude: number }) => void;
  onCheckOut: (location?: { latitude: number; longitude: number }) => void;
  isArabic: boolean;
  attendanceRecords: any[];
  detailed?: boolean;
}

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  address?: string;
  timestamp: number;
}

export const GPSTimeTracker: React.FC<GPSTimeTrackerProps> = ({
  onCheckIn,
  onCheckOut,
  isArabic,
  attendanceRecords,
  detailed = false
}) => {
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isWithinWorkplace, setIsWithinWorkplace] = useState(false);
  const [todayRecord, setTodayRecord] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Mock workplace coordinates (in a real app, this would come from the server)
  const workplaceLocation = {
    latitude: 24.7136, // Riyadh coordinates
    longitude: 46.6753,
    radius: 100 // meters
  };

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Get current location on mount
    getCurrentLocation();

    // Find today's attendance record
    const today = new Date().toDateString();
    const record = attendanceRecords.find(r => r.date === today);
    setTodayRecord(record);

    return () => clearInterval(timer);
  }, [attendanceRecords]);

  const getCurrentLocation = async () => {
    setIsLocating(true);
    setLocationError(null);

    try {
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 3600000 // 1 hour
      });

      const locationData: LocationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp
      };

      // Get address from coordinates (reverse geocoding)
      const address = await reverseGeocode(locationData.latitude, locationData.longitude);
      locationData.address = address;

      setCurrentLocation(locationData);

      // Check if within workplace
      const distance = calculateDistance(
        locationData.latitude,
        locationData.longitude,
        workplaceLocation.latitude,
        workplaceLocation.longitude
      );

      setIsWithinWorkplace(distance <= workplaceLocation.radius);

    } catch (error) {
      console.error('Error getting location:', error);
      setLocationError(
        isArabic 
          ? 'تعذر الحصول على الموقع. تأكد من تفعيل خدمات الموقع.'
          : 'Unable to get location. Please ensure location services are enabled.'
      );
    } finally {
      setIsLocating(false);
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  };

  const reverseGeocode = async (latitude: number, longitude: number): Promise<string> => {
    try {
      // Mock address lookup (in a real app, use a geocoding service)
      return isArabic 
        ? `الرياض، المملكة العربية السعودية`
        : `Riyadh, Saudi Arabia`;
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return isArabic ? 'موقع غير محدد' : 'Unknown location';
    }
  };

  const handleCheckIn = () => {
    if (currentLocation) {
      onCheckIn({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude
      });
    }
  };

  const handleCheckOut = () => {
    if (currentLocation) {
      onCheckOut({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude
      });
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(isArabic ? 'ar-SA' : 'en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatWorkingHours = (checkIn: string, checkOut?: string) => {
    const start = new Date(checkIn);
    const end = checkOut ? new Date(checkOut) : new Date();
    const diff = end.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return isArabic 
      ? `${hours} ساعة و ${minutes} دقيقة`
      : `${hours}h ${minutes}m`;
  };

  if (!detailed) {
    // Compact view for dashboard
    return (
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-2 text-sm">
          <Clock className="h-4 w-4" />
          {formatTime(currentTime)}
        </div>

        {isLocating ? (
          <Button disabled className="w-full">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            {isArabic ? 'تحديد الموقع...' : 'Locating...'}
          </Button>
        ) : !todayRecord?.checkIn ? (
          <Button 
            onClick={handleCheckIn} 
            disabled={!currentLocation}
            className="w-full flex items-center gap-2"
          >
            <Play className="h-4 w-4" />
            {isArabic ? 'تسجيل الحضور' : 'Check In'}
          </Button>
        ) : !todayRecord?.checkOut ? (
          <Button 
            onClick={handleCheckOut}
            disabled={!currentLocation}
            variant="outline"
            className="w-full flex items-center gap-2"
          >
            <Square className="h-4 w-4" />
            {isArabic ? 'تسجيل الانصراف' : 'Check Out'}
          </Button>
        ) : (
          <div className="text-xs text-muted-foreground">
            {isArabic ? 'تم إكمال يوم العمل' : 'Work day completed'}
          </div>
        )}

        {currentLocation && (
          <div className="flex items-center justify-center gap-1 text-xs">
            <MapPin className="h-3 w-3" />
            <Badge variant={isWithinWorkplace ? 'default' : 'secondary'} className="text-xs">
              {isWithinWorkplace 
                ? (isArabic ? 'في مكان العمل' : 'At workplace')
                : (isArabic ? 'خارج مكان العمل' : 'Outside workplace')
              }
            </Badge>
          </div>
        )}
      </div>
    );
  }

  // Detailed view for attendance tab
  return (
    <div className="space-y-4">
      {/* Current Time */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {formatTime(currentTime)}
            </div>
            <div className="text-sm text-muted-foreground">
              {currentTime.toLocaleDateString(isArabic ? 'ar-SA' : 'en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Navigation className="h-5 w-5" />
            {isArabic ? 'حالة الموقع' : 'Location Status'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {locationError ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{locationError}</AlertDescription>
            </Alert>
          ) : currentLocation ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {isArabic ? 'الدقة:' : 'Accuracy:'}
                </span>
                <Badge variant="outline">
                  ±{Math.round(currentLocation.accuracy)}m
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {isArabic ? 'المكان:' : 'Location:'}
                </span>
                <Badge variant={isWithinWorkplace ? 'default' : 'secondary'}>
                  {isWithinWorkplace 
                    ? (isArabic ? 'في مكان العمل' : 'At workplace')
                    : (isArabic ? 'خارج مكان العمل' : 'Outside workplace')
                  }
                </Badge>
              </div>

              {currentLocation.address && (
                <div className="text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3 inline mr-1" />
                  {currentLocation.address}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              {isArabic ? 'لم يتم تحديد الموقع' : 'Location not determined'}
            </div>
          )}

          <Button 
            onClick={getCurrentLocation}
            disabled={isLocating}
            variant="outline"
            size="sm"
            className="w-full mt-3"
          >
            {isLocating ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Navigation className="h-4 w-4 mr-2" />
            )}
            {isArabic ? 'تحديث الموقع' : 'Update Location'}
          </Button>
        </CardContent>
      </Card>

      {/* Attendance Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5" />
            {isArabic ? 'تسجيل الحضور والانصراف' : 'Time Tracking'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={handleCheckIn}
              disabled={!currentLocation || todayRecord?.checkIn}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              {isArabic ? 'تسجيل الحضور' : 'Check In'}
            </Button>

            <Button 
              onClick={handleCheckOut}
              disabled={!currentLocation || !todayRecord?.checkIn || todayRecord?.checkOut}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Square className="h-4 w-4" />
              {isArabic ? 'تسجيل الانصراف' : 'Check Out'}
            </Button>
          </div>

          {/* Today's Record */}
          {todayRecord && (
            <div className="bg-muted p-3 rounded-lg">
              <h4 className="font-medium mb-2 text-sm">
                {isArabic ? 'سجل اليوم:' : "Today's Record:"}
              </h4>
              
              <div className="space-y-2 text-sm">
                {todayRecord.checkIn && (
                  <div className="flex items-center justify-between">
                    <span>{isArabic ? 'الحضور:' : 'Check In:'}</span>
                    <span className="font-mono">
                      {new Date(todayRecord.checkIn).toLocaleTimeString(isArabic ? 'ar-SA' : 'en-US')}
                    </span>
                  </div>
                )}
                
                {todayRecord.checkOut && (
                  <div className="flex items-center justify-between">
                    <span>{isArabic ? 'الانصراف:' : 'Check Out:'}</span>
                    <span className="font-mono">
                      {new Date(todayRecord.checkOut).toLocaleTimeString(isArabic ? 'ar-SA' : 'en-US')}
                    </span>
                  </div>
                )}

                {todayRecord.checkIn && (
                  <div className="flex items-center justify-between border-t pt-2">
                    <span>{isArabic ? 'ساعات العمل:' : 'Working Hours:'}</span>
                    <span className="font-medium">
                      {formatWorkingHours(todayRecord.checkIn, todayRecord.checkOut)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};