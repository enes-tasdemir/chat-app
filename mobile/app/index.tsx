import { Redirect } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function Index() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Kullanıcının durumuna göre yönlendirme yap
  if (user) {
    return <Redirect href="/(app)/discover" />;
  }

  return <Redirect href="/(auth)/login" />;
} 