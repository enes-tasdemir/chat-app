import { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { TextInput, IconButton } from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import { MessageService } from '@/services/MessageService';
import { Message } from '@/types';

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (!id) return;

    const unsubscribe = MessageService.subscribeToChat(id as string, (updatedMessages) => {
      setMessages(updatedMessages);
    });

    return () => unsubscribe();
  }, [id]);

  const handleSend = async () => {
    if (!newMessage.trim() || !user) return;

    try {
      await MessageService.sendMessage(id as string, {
        senderId: user.id,
        text: newMessage,
        timestamp: Date.now(),
        type: 'text',
      });
      setNewMessage('');
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