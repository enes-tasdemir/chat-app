import { useEffect } from 'react';
import { Slot, SplashScreen } from 'expo-router';
import { AuthProvider } from '@/providers/AuthProvider';
import { useFonts } from 'expo-font';

// Splash screen'in otomatik gizlenmesini engelle
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    // Kullanmak istediğiniz fontları buraya ekleyin
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}
