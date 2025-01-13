import { Redirect } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function Index() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Kullanıcının durumuna göre yönlendirme yap
  return <Redirect href="/(app)/discover" />;
  if (user) {
  }

  return <Redirect href="/(auth)/login" />;
} 