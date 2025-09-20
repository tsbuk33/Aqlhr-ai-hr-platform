import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Fingerprint, Eye, Shield, Loader2 } from 'lucide-react';

interface BiometricAuthProps {
  onAuthenticated: (success: boolean, employeeData?: any) => void;
  isArabic: boolean;
}

interface BiometricOptions {
  fingerprintAvailable: boolean;
  faceIdAvailable: boolean;
}

// Mock employee data for demo
const mockEmployeeData = {
  id: 'emp_001',
  name: 'Ahmed Al-Rashid',
  nameAr: 'أحمد الراشد',
  employeeId: 'AqlHR-2024-001',
  department: 'Human Resources',
  departmentAr: 'الموارد البشرية',
  position: 'HR Specialist',
  positionAr: 'أخصائي موارد بشرية',
  avatar: null
};

export const BiometricAuth: React.FC<BiometricAuthProps> = ({
  onAuthenticated,
  isArabic
}) => {
  const [authMethod, setAuthMethod] = useState<'biometric' | 'password'>('biometric');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [biometricOptions, setBiometricOptions] = useState<BiometricOptions>({
    fingerprintAvailable: false,
    faceIdAvailable: false
  });
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      // Simulate biometric availability check
      // In a real app, you would use native biometric APIs
      const fingerprintAvailable = true; // Mock availability
      const faceIdAvailable = false; // Mock Face ID not available on this device
      
      setBiometricOptions({
        fingerprintAvailable,
        faceIdAvailable
      });

      console.log('Biometric availability checked:', {
        fingerprintAvailable,
        faceIdAvailable
      });
    } catch (error) {
      console.error('Error checking biometric availability:', error);
    }
  };

  const handleBiometricAuth = async () => {
    setIsAuthenticating(true);
    setError(null);

    try {
      // Simulate biometric authentication
      // In a real app, you would use @capacitor/biometric or similar plugin
      
      // Mock authentication delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful authentication
      const success = Math.random() > 0.2; // 80% success rate for demo
      
      if (success) {
        console.log('Biometric authentication successful');
        onAuthenticated(true, mockEmployeeData);
      } else {
        throw new Error(
          isArabic 
            ? 'فشل التحقق البيومتري. يرجى المحاولة مرة أخرى.'
            : 'Biometric authentication failed. Please try again.'
        );
      }
    } catch (error) {
      console.error('Biometric authentication error:', error);
      setError(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handlePasswordAuth = async () => {
    setIsAuthenticating(true);
    setError(null);

    try {
      // Mock password validation
      if (credentials.username === 'demo' && credentials.password === 'demo123') {
        console.log('Password authentication successful');
        onAuthenticated(true, mockEmployeeData);
      } else {
        throw new Error(
          isArabic
            ? 'اسم المستخدم أو كلمة المرور غير صحيحة'
            : 'Invalid username or password'
        );
      }
    } catch (error) {
      console.error('Password authentication error:', error);
      setError(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <Shield className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {authMethod === 'biometric' ? (
        <div className="space-y-4">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Fingerprint className="h-10 w-10 text-primary" />
            </div>
            <h3 className="font-medium mb-2">
              {isArabic ? 'التحقق البيومتري' : 'Biometric Authentication'}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {isArabic 
                ? 'استخدم بصمة الإصبع أو التعرف على الوجه للدخول'
                : 'Use fingerprint or face recognition to sign in'
              }
            </p>
          </div>

          <div className="space-y-3">
            {biometricOptions.fingerprintAvailable && (
              <Button 
                onClick={handleBiometricAuth}
                disabled={isAuthenticating}
                className="w-full flex items-center gap-2"
              >
                {isAuthenticating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Fingerprint className="h-4 w-4" />
                )}
                {isArabic ? 'استخدام بصمة الإصبع' : 'Use Fingerprint'}
              </Button>
            )}

            {biometricOptions.faceIdAvailable && (
              <Button 
                onClick={handleBiometricAuth}
                disabled={isAuthenticating}
                className="w-full flex items-center gap-2"
                variant="outline"
              >
                {isAuthenticating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                {isArabic ? 'استخدام التعرف على الوجه' : 'Use Face ID'}
              </Button>
            )}

            {!biometricOptions.fingerprintAvailable && !biometricOptions.faceIdAvailable && (
              <div className="text-center text-sm text-muted-foreground">
                {isArabic 
                  ? 'التحقق البيومتري غير متاح على هذا الجهاز'
                  : 'Biometric authentication not available on this device'
                }
              </div>
            )}
          </div>

          <div className="text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAuthMethod('password')}
            >
              {isArabic ? 'استخدام كلمة المرور بدلاً من ذلك' : 'Use password instead'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-center mb-4">
            <h3 className="font-medium">
              {isArabic ? 'تسجيل الدخول بكلمة المرور' : 'Password Login'}
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="username">
                {isArabic ? 'اسم المستخدم' : 'Username'}
              </Label>
              <Input
                id="username"
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                placeholder={isArabic ? 'أدخل اسم المستخدم' : 'Enter username'}
              />
            </div>

            <div>
              <Label htmlFor="password">
                {isArabic ? 'كلمة المرور' : 'Password'}
              </Label>
              <Input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                placeholder={isArabic ? 'أدخل كلمة المرور' : 'Enter password'}
              />
            </div>

            <Button 
              onClick={handlePasswordAuth}
              disabled={isAuthenticating || !credentials.username || !credentials.password}
              className="w-full"
            >
              {isAuthenticating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {isArabic ? 'جاري تسجيل الدخول...' : 'Signing in...'}
                </>
              ) : (
                <>{isArabic ? 'تسجيل الدخول' : 'Sign In'}</>
              )}
            </Button>

            {/* Demo credentials hint */}
            <div className="text-xs text-center text-muted-foreground bg-muted p-2 rounded">
              {isArabic ? 'للتجربة: ' : 'Demo: '}
              <span className="font-mono">demo / demo123</span>
            </div>
          </div>

          <div className="text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAuthMethod('biometric')}
            >
              {isArabic ? 'استخدام التحقق البيومتري' : 'Use biometric authentication'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};