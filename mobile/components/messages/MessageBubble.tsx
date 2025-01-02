import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { Message } from '@/types';

type MessageBubbleProps = {
  message: Message;
  isOwn: boolean;
};

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  return (
    <View style={[
      styles.container,
      isOwn ? styles.ownMessage : styles.otherMessage
    ]}>
      {message.type === 'image' ? (
        <Image 
          source={{ uri: message.imageUrl }} 
          style={styles.image} 
        />
      ) : (
        <Text style={[
          styles.text,
          isOwn ? styles.ownText : styles.otherText
        ]}>
          {message.text}
        </Text>
      )}
      <Text style={styles.timestamp}>
        {new Date(message.timestamp).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: '80%',
    marginVertical: 5,
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 15,
  },
  ownMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5E5EA',
  },
  text: {
    fontSize: 16,
  },
  ownText: {
    color: '#FFFFFF',
  },
  otherText: {
    color: '#000000',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  timestamp: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 5,
    textAlign: 'right',
  },
}); 