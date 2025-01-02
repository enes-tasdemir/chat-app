import { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { List, Avatar, Divider } from 'react-native-paper';
import { Link } from 'expo-router';
import { database } from '@/utils/firebase';
import { ref, onValue } from 'firebase/database';
import { useAuth } from '@/providers/AuthProvider';
import { Match } from '@/types';

export default function MessagesScreen() {
  const [matches, setMatches] = useState<Match[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const matchesRef = ref(database, `users/${user.id}/matches`);
    const unsubscribe = onValue(matchesRef, (snapshot) => {
      const matchesData = snapshot.val();
      if (matchesData) {
        const matchesList = Object.entries(matchesData).map(([id, data]: [string, any]) => ({
          id,
          ...data,
        }));
        setMatches(matchesList);
      }
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <View style={styles.container}>
      <FlatList
        data={matches}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <Divider />}
        renderItem={({ item }) => (
          <Link href={`/chat/${item.id}`} asChild>
            <List.Item
              title={item.users.find((userId) => userId !== user?.id)}
              description={item.lastMessage?.text ?? 'No messages yet'}
              left={() => (
                <Avatar.Image
                  size={50}
                  source={{ uri: item.photoURL }}
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