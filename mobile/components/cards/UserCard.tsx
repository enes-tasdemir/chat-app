import { StyleSheet, View, Image } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { User } from '@/types';

type UserCardProps = {
  user: User;
  onLike?: () => void;
  onDislike?: () => void;
};

export function UserCard({ user, onLike, onDislike }: UserCardProps) {
  return (
    <Card style={styles.card}>
      <Card.Cover 
        source={{ uri: user.photoURL }} 
        style={styles.image}
      />
      <Card.Content style={styles.content}>
        <Title>{user.name}, {user.age}</Title>
        <Paragraph>{user.bio}</Paragraph>
        
        {user.interests && user.interests.length > 0 && (
          <View style={styles.interests}>
            {user.interests.map((interest, index) => (
              <Button 
                key={index} 
                mode="outlined" 
                style={styles.interestTag}
                labelStyle={styles.interestLabel}
              >
                {interest}
              </Button>
            ))}
          </View>
        )}
        
        <View style={styles.distance}>
          <Paragraph>{user.distance}km away</Paragraph>
        </View>
      </Card.Content>

      <Card.Actions style={styles.actions}>
        <Button 
          mode="contained" 
          onPress={onDislike}
          style={[styles.actionButton, styles.dislikeButton]}
          icon="close"
        >
          Pass
        </Button>
        <Button 
          mode="contained" 
          onPress={onLike}
          style={[styles.actionButton, styles.likeButton]}
          icon="heart"
        >
          Like
        </Button>
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 10,
    elevation: 4,
  },
  image: {
    height: 300,
  },
  content: {
    padding: 15,
  },
  interests: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  interestTag: {
    margin: 4,
    borderRadius: 20,
  },
  interestLabel: {
    fontSize: 12,
  },
  distance: {
    marginTop: 10,
    opacity: 0.7,
  },
  actions: {
    justifyContent: 'space-around',
    padding: 15,
  },
  actionButton: {
    flex: 0.45,
  },
  likeButton: {
    backgroundColor: '#4CAF50',
  },
  dislikeButton: {
    backgroundColor: '#f44336',
  },
}); 