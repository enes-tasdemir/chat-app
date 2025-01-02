import * as Location from 'expo-location';

export class LocationService {
  static async getCurrentLocation() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      throw new Error('Permission to access location was denied');
    }

    return await Location.getCurrentPositionAsync({});
  }

  static async watchLocation(callback: (location: Location.LocationObject) => void) {
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      throw new Error('Permission to access location was denied');
    }

    return await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 10000,
        distanceInterval: 100,
      },
      callback
    );
  }
} 