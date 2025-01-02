import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';

export default function AuthLayout() {
  const { user, isLoading } = useAuth();

  // Eğer auth durumu yükleniyorsa, hiçbir şey render etme
  if (isLoading) {
    return null;
  }

  // Kullanıcı giriş yapmışsa ana uygulamaya yönlendir
  if (user) {
    return <Redirect href="/(app)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
} 