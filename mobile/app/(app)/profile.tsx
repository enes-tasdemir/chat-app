import { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Button, TextInput, Avatar, List } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/providers/AuthProvider';
import api from '@/utils/api';

export default function ProfileScreen() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    age: user?.age || '',
    interests: user?.interests || [],
  });

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets[0].uri) {
      const formData = new FormData();
      formData.append('photo', {
        uri: result.assets[0].uri,
        type: 'image/jpeg',
        name: 'profile.jpg',
      });

      try {
        await api.post('/users/profile/photo', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } catch (error) {
        console.error('Upload photo error:', error);
      }
    }
  };

  const handleSave = async () => {
    try {
      await api.put('/users/profile', profile);
      setEditing(false);
    } catch (error) {
      console.error('Update profile error:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar.Image
          size={120}
          source={{ uri: user?.photoURL }}
        />
        <Button onPress={handleImagePick}>Change Photo</Button>
      </View>

      {editing ? (
        <View style={styles.form}>
          <TextInput
            label="Name"
            value={profile.name}
            onChangeText={(text) => setProfile({ ...profile, name: text })}
            style={styles.input}
          />
          <TextInput
            label="Bio"
            value={profile.bio}
            onChangeText={(text) => setProfile({ ...profile, bio: text })}
            multiline
            style={styles.input}
          />
          <TextInput
            label="Age"
            value={String(profile.age)}
            onChangeText={(text) => setProfile({ ...profile, age: text })}
            keyboardType="numeric"
            style={styles.input}
          />
          <Button mode="contained" onPress={handleSave}>
            Save Changes
          </Button>
        </View>
      ) : (
        <List.Section>
          <List.Item
            title="Name"
            description={profile.name}
          />
          <List.Item
            title="Bio"
            description={profile.bio}
          />
          <List.Item
            title="Age"
            description={profile.age}
          />
          <Button mode="contained" onPress={() => setEditing(true)}>
            Edit Profile
          </Button>
        </List.Section>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
  },
  form: {
    padding: 20,
  },
  input: {
    marginBottom: 12,
  },
}); 