export interface User {
  id: string;
  name: string;
  email: string;
  photoURL: string;
  bio?: string;
  age: number;
  gender?: string;
  interests: string[];
  location?: {
    latitude: number;
    longitude: number;
  };
  distance?: number;
  lastActive?: string;
  online?: boolean;
}

export interface Match {
  id: string;
  userId: string;
  matchedUserId: string;
  matchedUser: User;
  createdAt: string;
  lastMessage?: Message;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text?: string;
  imageUrl?: string;
  type: 'text' | 'image';
  timestamp: string;
  read: boolean;
}

export interface Chat {
  id: string;
  participants: string[];
  lastMessage?: Message;
  createdAt: string;
  updatedAt: string;
} 