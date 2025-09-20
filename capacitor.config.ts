import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.1e2511c6d68f465bbce5a3f16026d868',
  appName: 'AqlHR Platform',
  webDir: 'dist',
  server: {
    url: 'https://1e2511c6-d68f-465b-bce5-a3f16026d868.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Geolocation: {
      permissions: ['location'],
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 3600000
    },
    Camera: {
      permissions: ['camera', 'photos']
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#488AFF',
      sound: 'beep.wav'
    },
    BiometricAuth: {
      androidBiometricStrength: 'strong'
    }
  }
};

export default config;