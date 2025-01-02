import { Image, StyleSheet, View } from 'react-native';
import { Badge } from 'react-native-paper';

type UserAvatarProps = {
  imageUrl: string;
  size?: number;
  online?: boolean;
};

export function UserAvatar({ imageUrl, size = 50, online }: UserAvatarProps) {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: imageUrl }}
        style={[
          styles.image,
          { width: size, height: size, borderRadius: size / 2 }
        ]}
      />
      {online !== undefined && (
        <Badge
          style={[
            styles.badge,
            { backgroundColor: online ? '#4CAF50' : '#9E9E9E' }
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    backgroundColor: '#E1E1E1',
  },
  badge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
}); 