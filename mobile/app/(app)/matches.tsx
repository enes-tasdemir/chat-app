import { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { useAuth } from '@/providers/AuthProvider';
import api from '@/utils/api';
import { Match, User } from '@/types';

export default function MatchesScreen() {
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

  const handleMessage = async (matchId: string) => {
    try {
      const response = await api.post(`/chats`, { matchId });
      // Chat ekranına yönlendir
      router.push(`/chat/${response.data.chatId}`);
    } catch (error) {
      console.error('Create chat error:', error);
    }
  };

  const handleUnmatch = async (matchId: string) => {
    try {
      await api.delete(`/matches/${matchId}`);
      loadMatches(); // Listeyi yenile
    } catch (error) {
      console.error('Unmatch error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={matches}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Cover source={{ uri: item.matchedUser.photoURL }} />
            <Card.Content>
              <Title>{item.matchedUser.name}</Title>
              <Paragraph>{item.matchedUser.bio}</Paragraph>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => handleMessage(item.id)}>Message</Button>
              <Button onPress={() => handleUnmatch(item.id)}>Unmatch</Button>
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
    marginBottom: 10,
  },
}); 