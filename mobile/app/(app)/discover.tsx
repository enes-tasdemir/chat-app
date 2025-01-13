import { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { UserCard } from '@/components/cards/UserCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import api from '@/utils/api';
import { User } from '@/types';

export default function DiscoverScreen() {
  const [currentProfile, setCurrentProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadNextProfile();
  }, []);

  const loadNextProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users/discover/next');
      setCurrentProfile(response.data);
      setError(null);
    } catch (error) {
      setError('Failed to load profiles');
      console.error('Load profile error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!currentProfile) return;
    try {
      await api.post(`/users/${currentProfile.id}/like`);
      loadNextProfile();
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  const handleDislike = async () => {
    if (!currentProfile) return;
    try {
      await api.post(`/users/${currentProfile.id}/dislike`);
      loadNextProfile();
    } catch (error) {
      console.error('Dislike error:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadNextProfile} />;
  }

  if (!currentProfile) {
    return (
      <View style={styles.container}>
        <ErrorMessage message="No more profiles to show" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <UserCard
        user={currentProfile}
        onLike={handleLike}
        onDislike={handleDislike}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 