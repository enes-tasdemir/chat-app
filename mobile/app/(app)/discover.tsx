import { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { Card, Title } from 'react-native-paper';
import { LocationService } from '@/services/LocationService';
import { UserCard } from '@/components/cards/UserCard';
import { useProfiles } from '@/hooks/useProfiles';

export default function DiscoverScreen() {
  const { profiles, loading, loadMore } = useProfiles();
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const initLocation = async () => {
      try {
        const currentLocation = await LocationService.getCurrentLocation();
        setLocation(currentLocation);
      } catch (error) {
        console.error('Location error:', error);
      }
    };

    initLocation();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={profiles}
        renderItem={({ item }) => <UserCard user={item} />}
        keyExtractor={(item) => item.id}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 