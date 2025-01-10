import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Switch,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment-timezone';
import { useRouter } from 'expo-router'; // Menggunakan expo-router untuk navigasi

interface SunriseSunset {
  sunrise: string;
  sunset: string;
  solar_noon: string;
  day_length: number;
  civil_twilight_begin: string;
  civil_twilight_end: string;
  nautical_twilight_begin: string;
  nautical_twilight_end: string;
  astronomical_twilight_begin: string;
  astronomical_twilight_end: string;
}

interface Location {
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  address: {
    [key: string]: string;
  };
}

const SunriseScreen = () => {
  const [sunriseSunset, setSunriseSunset] = useState<SunriseSunset | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [locations, setLocations] = useState<Location[]>([]);
  const [favoriteLocations, setFavoriteLocations] = useState<Location[]>([]);
  const [darkTheme, setDarkTheme] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const router = useRouter(); // Inisialisasi router

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const favorites = await AsyncStorage.getItem('favoriteLocations');
      const theme = await AsyncStorage.getItem('theme');
      const notifications = await AsyncStorage.getItem('notificationsEnabled');
      if (favorites) setFavoriteLocations(JSON.parse(favorites));
      if (theme) setDarkTheme(theme === 'dark');
      if (notifications) setNotificationsEnabled(notifications === 'true');
    } catch (error) {
      console.error('Error loading preferences', error);
    }
  };

  const savePreferences = async () => {
    try {
      await AsyncStorage.setItem('favoriteLocations', JSON.stringify(favoriteLocations));
      await AsyncStorage.setItem('theme', darkTheme ? 'dark' : 'light');
      await AsyncStorage.setItem('notificationsEnabled', notificationsEnabled.toString());
    } catch (error) {
      console.error('Error saving preferences', error);
    }
  };

  const fetchLocations = async (query: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'AppSunrise/1.0 (email@example.com)',
          },
        }
      );
      const data: Location[] = await response.json();
      if (data.length === 0) {
        Alert.alert('Error', 'Tidak ada lokasi yang ditemukan.');
      } else {
        const uniqueLocations = Array.from(
          new Map<string, Location>(data.map((item: Location) => [item.display_name, item])).values()
        );
        setLocations(uniqueLocations);
      }
    } catch (error) {
      console.error('Error fetching locations', error);
      Alert.alert('Error', 'Gagal mengambil lokasi.');
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (location: Location) => {
    const isFavorite = favoriteLocations.find(fav => fav.display_name === location.display_name);
    if (isFavorite) {
      setFavoriteLocations(prev => prev.filter(fav => fav.display_name !== location.display_name));
    } else {
      setFavoriteLocations(prev => [...prev, location]);
    }
    savePreferences();
  };

  const fetchSunriseSunset = async (lat: number, lon: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&formatted=0`
      );
      const data = await response.json();
      setSunriseSunset(data.results);
    } catch (error) {
      console.error('Error fetching sunrise-sunset data', error);
      Alert.alert('Error', 'Gagal mengambil data sunrise-sunset.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (time: string) => {
    return moment(time).tz('Asia/Jakarta').format('hh:mm A');
  };

  return (
    <View style={[styles.container, { backgroundColor: darkTheme ? '#1a1a1a' : '#ffffff' }]}>
      <Text style={styles.title}>Sunrise & Sunset Times</Text>

      <TextInput
        style={[styles.input, { borderColor: darkTheme ? '#555' : '#ccc' }]}
        placeholder="Masukkan lokasi..."
        placeholderTextColor={darkTheme ? '#aaa' : '#555'}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <TouchableOpacity 
        style={[
       styles.button, 
        { 
           backgroundColor: darkTheme ? '#007BFF' : '#0056b3', 
          shadowColor: darkTheme ? '#004BA0' : '#003E7F',
          shadowOpacity: 0.15,
          shadowOffset: { width: 0, height: 4 },
          shadowRadius: 8,
        }
        ]}
        onPress={() => fetchLocations(searchQuery)}
        >
      <Text style={styles.buttonText}>Cari</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: '#28a745' }]}
        onPress={() => router.push('/GrafikSunset')}
      >
        <Text style={styles.buttonText}>Lihat Grafik Sunset</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: darkTheme ? '#007BFF' : '#0056b3' }]}
        onPress={() => router.push('/PersonalScheduleScreen')}
      >
        <Text style={styles.buttonText}>Jadwal Pribadi</Text>
      </TouchableOpacity>


      <View style={styles.preferences}>
        <View style={styles.preferenceItem}>
          <Text style={[styles.text, { color: darkTheme ? '#fff' : '#000' }]}>Tema Gelap</Text>
          <Switch
            value={darkTheme}
            onValueChange={(value) => {
              setDarkTheme(value);
              savePreferences();
            }}
          />
        </View>
        <View style={styles.preferenceItem}>
          <Text style={[styles.text, { color: darkTheme ? '#fff' : '#000' }]}>Notifikasi Sunrise/Sunset</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={(value) => {
              setNotificationsEnabled(value);
              savePreferences();
            }}
          />
        </View>
      </View>

      {loading && <Text style={styles.text}>Memuat...</Text>}

      <ScrollView style={styles.resultsContainer}>
        {locations.map((location, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.card, { backgroundColor: darkTheme ? '#333' : '#fff', ...styles.cardShadow }]}
            onPress={() => fetchSunriseSunset(parseFloat(location.lat), parseFloat(location.lon))}
          >
            <Text style={[styles.text, { color: darkTheme ? '#fff' : '#000' }]}>{location.display_name}</Text>
            <TouchableOpacity style={styles.favoriteButton} onPress={() => toggleFavorite(location)}>
              <Text
                style={[
                  styles.text,
                  {
                    color: favoriteLocations.find(fav => fav.display_name === location.display_name)
                      ? '#FFD700'
                      : darkTheme
                        ? '#bbb'
                        : '#000',
                  },
                ]}
              >
                {favoriteLocations.find(fav => fav.display_name === location.display_name) ? '★ Favorit' : '☆ Favorit'}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {sunriseSunset && (
        <ScrollView style={styles.resultsContainer}>
          <View style={[styles.card, { backgroundColor: darkTheme ? '#333' : '#fff', ...styles.cardShadow }]}>
            <Text style={[styles.text, { color: darkTheme ? '#fff' : '#000' }]}>Sunrise: {formatTime(sunriseSunset.sunrise)}</Text>
            <Text style={[styles.text, { color: darkTheme ? '#fff' : '#000' }]}>Sunset: {formatTime(sunriseSunset.sunset)}</Text>
            <Text style={[styles.text, { color: darkTheme ? '#fff' : '#000' }]}>Solar Noon: {formatTime(sunriseSunset.solar_noon)}</Text>
            <Text style={[styles.text, { color: darkTheme ? '#fff' : '#000' }]}>
              Day Length: {Math.floor(sunriseSunset.day_length / 3600)} hours {Math.floor((sunriseSunset.day_length % 3600) / 60)} minutes
            </Text>
            <Text style={[styles.text, { color: darkTheme ? '#fff' : '#000' }]}>
              Civil Twilight Begins: {formatTime(sunriseSunset.civil_twilight_begin)}
            </Text>
            <Text style={[styles.text, { color: darkTheme ? '#fff' : '#000' }]}>
              Civil Twilight Ends: {formatTime(sunriseSunset.civil_twilight_end)}
            </Text>
            <Text style={[styles.text, { color: darkTheme ? '#fff' : '#000' }]}>
              Nautical Twilight Begins: {formatTime(sunriseSunset.nautical_twilight_begin)}
            </Text>
            <Text style={[styles.text, { color: darkTheme ? '#fff' : '#000' }]}>
              Nautical Twilight Ends: {formatTime(sunriseSunset.nautical_twilight_end)}
            </Text>
            <Text style={[styles.text, { color: darkTheme ? '#fff' : '#000' }]}>
              Astronomical Twilight Begins: {formatTime(sunriseSunset.astronomical_twilight_begin)}
            </Text>
            <Text style={[styles.text, { color: darkTheme ? '#fff' : '#000' }]}>
              Astronomical Twilight Ends: {formatTime(sunriseSunset.astronomical_twilight_end)}
            </Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    width: '80%',
    marginBottom: 20,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  preferences: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginVertical: 20,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '48%',
  },
  resultsContainer: {
    width: '100%',
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    elevation: 5, // Adds shadow for 3D effect
  },
  cardShadow: {
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  favoriteButton: {
    marginTop: 10,
    alignItems: 'flex-end',
  },
});

export default SunriseScreen;