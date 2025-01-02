import { useState, useEffect } from 'react';
import { database } from '@/utils/firebase';
import { ref, query, orderByChild, startAt, endAt, get } from 'firebase/database';
import { LocationService } from '@/services/LocationService';

export function useProfiles(radius = 50) {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastKey, setLastKey] = useState(null);

  const loadProfiles = async () => {
    try {
      const location = await LocationService.getCurrentLocation();
      const { latitude, longitude } = location.coords;

      const profilesRef = ref(database, 'profiles');
      const profilesQuery = query(
        profilesRef,
        orderByChild('location/latitude'),
        startAt(latitude - radius),
        endAt(latitude + radius)
      );

      const snapshot = await get(profilesQuery);
      const newProfiles = [];

      snapshot.forEach((child) => {
        const profile = child.val();
        const profileLat = profile.location.latitude;
        const profileLon = profile.location.longitude;

        // Calculate distance and filter
        const distance = calculateDistance(
          latitude,
          longitude,
          profileLat,
          profileLon
        );

        if (distance <= radius) {
          newProfiles.push({
            id: child.key,
            ...profile,
            distance,
          });
        }
      });

      setProfiles(newProfiles);
      setLoading(false);
    } catch (error) {
      console.error('Load profiles error:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfiles();
  }, [radius]);

  const loadMore = () => {
    // Implement pagination logic here
  };

  return { profiles, loading, loadMore, refresh: loadProfiles };
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  // Implement Haversine formula for distance calculation
  // Return distance in kilometers
} 