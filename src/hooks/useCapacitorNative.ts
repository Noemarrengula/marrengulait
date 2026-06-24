import { useState, useEffect, useCallback } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation, Position } from '@capacitor/geolocation';
import { PushNotifications, Token } from '@capacitor/push-notifications';
import { toast } from 'sonner';

interface UseCapacitorNativeReturn {
  hasPermission: {
    camera: boolean;
    location: boolean;
    notifications: boolean;
  };
  requestCameraPermission: () => Promise<boolean>;
  requestLocationPermission: () => Promise<boolean>;
  requestNotificationPermission: () => Promise<boolean>;
  takePhoto: () => Promise<string | null>;
  pickImage: () => Promise<string | null>;
  getCurrentLocation: () => Promise<Position | null>;
  registerForPushNotifications: () => Promise<void>;
  isCapacitor: boolean;
  isLoading: boolean;
}

export const useCapacitorNative = (): UseCapacitorNativeReturn => {
  const [hasPermission, setHasPermission] = useState({
    camera: false,
    location: false,
    notifications: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isCapacitor, setIsCapacitor] = useState(false);

  useEffect(() => {
    const hasCapacitor = typeof window !== 'undefined' && 
      !!(window as unknown as { Capacitor?: object }).Capacitor;
    setIsCapacitor(hasCapacitor);
  }, []);

  const requestCameraPermission = useCallback(async (): Promise<boolean> => {
    if (!isCapacitor) {
      toast.info('Funcionalidade disponível apenas na app');
      return false;
    }

    setIsLoading(true);
    try {
      const permission = await Camera.requestPermissions();
      const granted = permission.camera === 'granted';
      setHasPermission(prev => ({ ...prev, camera: granted }));
      
      if (!granted) {
        toast.error('Permissão da câmera negada');
      }
      
      return granted;
    } catch (error) {
      console.error('Camera permission error:', error);
      toast.error('Erro ao pedir permissão da câmera');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isCapacitor]);

  const requestLocationPermission = useCallback(async (): Promise<boolean> => {
    if (!isCapacitor) {
      toast.info('Funcionalidade disponível apenas na app');
      return false;
    }

    setIsLoading(true);
    try {
      const permission = await Geolocation.requestPermissions();
      const granted = permission.location === 'granted';
      setHasPermission(prev => ({ ...prev, location: granted }));
      
      if (!granted) {
        toast.error('Permissão de localização negada');
      }
      
      return granted;
    } catch (error) {
      console.error('Location permission error:', error);
      toast.error('Erro ao pedir permissão de localização');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isCapacitor]);

  const requestNotificationPermission = useCallback(async (): Promise<boolean> => {
    if (!isCapacitor) {
      toast.info('Funcionalidade disponível apenas na app');
      return false;
    }

    setIsLoading(true);
    try {
      const permission = await PushNotifications.requestPermissions();
      const granted = permission.receive === 'granted';
      setHasPermission(prev => ({ ...prev, notifications: granted }));
      
      if (!granted) {
        toast.error('Permissão de notificações negada');
      }
      
      return granted;
    } catch (error) {
      console.error('Notification permission error:', error);
      toast.error('Erro ao pedir permissão de notificações');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isCapacitor]);

  const takePhoto = useCallback(async (): Promise<string | null> => {
    if (!isCapacitor) {
      toast.info('Tirar foto disponível apenas na app');
      return null;
    }

    try {
      const hasAccess = await requestCameraPermission();
      if (!hasAccess) return null;

      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        width: 1200,
        height: 1200,
      });

      if (image.dataUrl) {
        toast.success('Foto capturada!');
        return image.dataUrl;
      }
      return null;
    } catch (error) {
      console.error('Take photo error:', error);
      toast.error('Erro ao tirar foto');
      return null;
    }
  }, [isCapacitor, requestCameraPermission]);

  const pickImage = useCallback(async (): Promise<string | null> => {
    if (!isCapacitor) {
      toast.info('Escolher imagem disponível apenas na app');
      return null;
    }

    try {
      const hasAccess = await requestCameraPermission();
      if (!hasAccess) return null;

      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos,
        width: 1200,
        height: 1200,
      });

      if (image.dataUrl) {
        toast.success('Imagem selecionada!');
        return image.dataUrl;
      }
      return null;
    } catch (error) {
      console.error('Pick image error:', error);
      toast.error('Erro ao selecionar imagem');
      return null;
    }
  }, [isCapacitor, requestCameraPermission]);

  const getCurrentLocation = useCallback(async (): Promise<Position | null> => {
    if (!isCapacitor) {
      toast.info('Localização disponível apenas na app');
      return null;
    }

    try {
      const hasAccess = await requestLocationPermission();
      if (!hasAccess) return null;

      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
      });

      return position;
    } catch (error) {
      console.error('Get location error:', error);
      toast.error('Erro ao obter localização');
      return null;
    }
  }, [isCapacitor, requestLocationPermission]);

  const registerForPushNotifications = useCallback(async (): Promise<void> => {
    if (!isCapacitor) {
      toast.info('Notificações disponíveis apenas na app');
      return;
    }

    try {
      const hasAccess = await requestNotificationPermission();
      if (!hasAccess) return;

      await PushNotifications.register();

      PushNotifications.addListener('registration', (token: Token) => {
        localStorage.setItem('push_token', token.value);
      });

      PushNotifications.addListener('registrationError', (error) => {
        console.error('Push registration error:', error);
        toast.error('Erro ao registar para notificações');
      });

      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        toast.info(notification.title || 'Nova notificação');
      });

      PushNotifications.addListener('pushNotificationActionPerformed', () => {});
    } catch (error) {
      console.error('Push notification error:', error);
      toast.error('Erro ao configurar notificações');
    }
  }, [isCapacitor, requestNotificationPermission]);

  return {
    hasPermission,
    requestCameraPermission,
    requestLocationPermission,
    requestNotificationPermission,
    takePhoto,
    pickImage,
    getCurrentLocation,
    registerForPushNotifications,
    isCapacitor,
    isLoading,
  };
};

export default useCapacitorNative;
