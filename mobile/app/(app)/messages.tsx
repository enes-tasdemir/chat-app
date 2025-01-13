import { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { List, Avatar, Divider } from 'react-native-paper';
import { Link } from 'expo-router';
import api from '@/utils/api';
import { useAuth } from '@/providers/AuthProvider';
import { Match } from '@/types';

export default function MessagesScreen() {
  const [matches, setMatches] = useState<Match[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      const response = await api.get('/matches');
      setMatches(response.data);
    } catch (error) {
      console.error('Load matches error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={matches}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <Divider />}
        renderItem={({ item }) => (
          <Link href={`/chat/${item.id}`} asChild>
            <List.Item
              title={item.matchedUser.name}
              description={item.lastMessage?.text ?? 'No messages yet'}
              left={() => (
                <Avatar.Image
                  size={50}
                  source={{ uri: item.matchedUser.photoURL }}
                />
              )}
            />
          </Link>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 