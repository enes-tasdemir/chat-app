import firebase from '@/utils/firebase';
import { Message } from '@/types';

export class MessageService {
  static async sendMessage(chatId: string, message: Message) {
    try {
      const messageRef = firebase
        .database()
        .ref(`chats/${chatId}/messages`)
        .push();

      await messageRef.set({
        ...message,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
      });

      return messageRef.key;
    } catch (error) {
      console.error('Send message error:', error);
      throw error;
    }
  }

  static subscribeToChat(chatId: string, callback: (messages: Message[]) => void) {
    const chatRef = firebase.database().ref(`chats/${chatId}/messages`);

    chatRef.on('value', (snapshot) => {
      const messages = [];
      snapshot.forEach((child) => {
        messages.push({
          id: child.key,
          ...child.val(),
        });
      });
      callback(messages.reverse());
    });

    return () => chatRef.off();
  }
} 