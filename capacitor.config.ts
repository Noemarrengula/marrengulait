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
      // hidden by the app as soon as the first screen is drawn (src/native/nativeApp.ts)
      launchShowDuration: 3000,
      launchAutoHide: true,
      launchFadeOutDuration: 250,
      backgroundColor: '#121212',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP',
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#121212',
      overlaysWebView: false
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