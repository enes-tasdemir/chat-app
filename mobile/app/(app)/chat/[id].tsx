import { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { TextInput, IconButton } from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import api from '@/utils/api';
import { Message } from '@/types';

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, [id]);

  const loadMessages = async () => {
    try {
      const response = await api.get(`/chats/${id}/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error('Load messages error:', error);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    try {
      await api.post(`/chats/${id}/messages`, {
        text: newMessage,
        type: 'text'
      });
      setNewMessage('');
      loadMessages();
    } catch (error) {
      console.error('Send message error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id!}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageContainer,
              item.senderId === user?.id ? styles.sentMessage : styles.receivedMessage,
            ]}>
            <TextInput>{item.text}</TextInput>
          </View>
        )}
        inverted
      />
      <View style={styles.inputContainer}>
        <TextInput
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          style={styles.input}
        />
        <IconButton
          icon="send"
          size={24}
          onPress={handleSend}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageContainer: {
    padding: 10,
    margin: 5,
    maxWidth: '80%',
    borderRadius: 10,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5E5EA',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    marginRight: 10,
  },
}); 