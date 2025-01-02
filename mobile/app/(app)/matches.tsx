import { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { useAuth } from '@/providers/AuthProvider';
import { database } from '@/utils/firebase';
import { ref, onValue } from 'firebase/database';
import { Match, User } from '@/types';

export default function MatchesScreen() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [matchedUsers, setMatchedUsers] = useState<User[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const matchesRef = ref(database, `users/${user.id}/matches`);
    const unsubscribe = onValue(matchesRef, async (snapshot) => {
      const matchesData = snapshot.val();
      if (matchesData) {
        const matchesList = Object.entries(matchesData).map(([id, data]: [string, any]) => ({
          id,
          ...data,
        }));
        setMatches(matchesList);

        // Fetch matched users' profiles
        const userProfiles = await Promise.all(
          matchesList.map(async (match) => {
            const userId = match.users.find((id) => id !== user.id);
            const userRef = ref(database, `users/${userId}`);
            const userSnapshot = await get(userRef);
            return { id: userId, ...userSnapshot.val() };
          })
        );
        setMatchedUsers(userProfiles);
      }
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <View style={styles.container}>
      <FlatList
        data={matchedUsers}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Cover source={{ uri: item.photoURL }} />
            <Card.Content>
              <Title>{item.name}</Title>
              <Paragraph>{item.age} years old</Paragraph>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => {}}>Message</Button>
              <Button onPress={() => {}}>View Profile</Button>
            </Card.Actions>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    flex: 1,
    margin: 5,
  },
}); 