import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { Link } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, createDemoUser } = useAuth();

  const handleLogin = async () => {
    try {
      await signIn(email, password);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleDemoLogin = async () => {
    try {
      await createDemoUser();
    } catch (error) {
      console.error('Demo login error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button mode="contained" onPress={handleLogin} style={styles.button}>
        Login
      </Button>
      <Button 
        mode="outlined" 
        onPress={handleDemoLogin} 
        style={styles.demoButton}
      >
        Try Demo Account
      </Button>
      <Link href="/register" style={styles.link}>
        Don't have an account? Register
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 12,
  },
  demoButton: {
    marginTop: 8,
  },
  link: {
    marginTop: 20,
    textAlign: 'center',
    color: '#0066cc',
  },
}); 