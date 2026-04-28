import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.marrengulait.store',
  appName: 'Marrengula-IT',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    hostname: 'marrengula-it.co.mz'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: '#FF3131',
      showSpinner: true,
      androidScaleType: 'CENTER_CROP',
      splashFullScreen: true,
      splashImmersive: true
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    },
    Camera: {
      promptLabelPhoto: 'Escolher Foto',
      promptLabelPicture: 'Tirar Foto',
      allowEditing: true
    },
    Geolocation: {
      enableHighAccuracy: true
    }
  }
};

export default config;