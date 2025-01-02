export interface User {
  id: string;
  name: string;
  email: string;
  photoURL: string;
  bio: string;
  age: number;
  gender: string;
  location: {
    latitude: number;
    longitude: number;
  };
  interests: string[];
  premium: boolean;
}

export interface Message {
  id?: string;
  senderId: string;
  text: string;
  timestamp: number;
  type: 'text' | 'image';
  imageUrl?: string;
}

export interface Match {
  id: string;
  users: string[];
  timestamp: number;
  lastMessage?: Message;
} 