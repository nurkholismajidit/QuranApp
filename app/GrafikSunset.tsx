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
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { useRouter } from 'expo-router'; // Menggunakan expo-router untuk navigasi

const screenWidth = Dimensions.get('window').width;

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

const GrafikSunset = () => {
    const router = useRouter(); // Menggunakan router dari expo-router
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [locations, setLocations] = useState<Location[]>([]);
  const [darkTheme, setDarkTheme] = useState(false);

  const fetchLocations = async (query: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'MyApp/1.0 (myemail@example.com)',
          },
        }
      );      
      const data: Location[] = await response.json();
      setLocations(data);
    } catch (error) {
      console.error('Error fetching locations:', error);
      Alert.alert('Error', 'Gagal mengambil lokasi.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSunriseSunsetData = async (lat: number, lon: number) => {
    setLoading(true);
    try {
      const results: { month: string; sunrise: number; sunset: number }[] = [];
      for (let month = 1; month <= 12; month++) {
        const date = `${2023}-${String(month).padStart(2, '0')}-15`;
        const response = await fetch(
          `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&date=${date}&formatted=0`
        );
        const data = await response.json();
        if (data && data.results) {
          results.push({
            month: moment(date).format('MMM'),
            sunrise:
              moment(data.results.sunrise).hour() +
              moment(data.results.sunrise).minute() / 60,
            sunset:
              moment(data.results.sunset).hour() +
              moment(data.results.sunset).minute() / 60,
          });
        }
      }

      const sunriseTimes = results.map((item) => item.sunrise);
      const sunsetTimes = results.map((item) => item.sunset);

      setChartData({
        labels: results.map((item) => item.month),
        datasets: [
          {
            data: sunriseTimes,
            color: () => `rgba(255, 99, 132, 1)`,
            strokeWidth: 2,
          },
          {
            data: sunsetTimes,
            color: () => `rgba(54, 162, 235, 1)`,
            strokeWidth: 2,
          },
        ],
        legend: ['Sunrise', 'Sunset'],
      });
    } catch (error) {
      console.error('Error fetching sunrise-sunset data', error);
      Alert.alert('Error', 'Gagal mengambil data sunrise-sunset.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: darkTheme ? '#1a1a1a' : '#ffffff' }]}>
        {/* Tombol Kembali */}
      {/* <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push('/SunriseScreen')}
      >
        <Text style={styles.backButtonText}>Kembali</Text>
      </TouchableOpacity> */}
      <Text style={styles.title}>Grafik Waktu Matahari Terbit dan Terbenam Sepanjang Tahun</Text>

      <TextInput
        style={[styles.input, { borderColor: darkTheme ? '#555' : '#ccc' }]}
        placeholder="Masukkan lokasi..."
        placeholderTextColor={darkTheme ? '#aaa' : '#555'}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: darkTheme ? '#007BFF' : '#0056b3' }]}
        onPress={() => fetchLocations(searchQuery)}
      >
        <Text style={styles.buttonText}>Cari Lokasi</Text>
      </TouchableOpacity>

      <ScrollView style={styles.resultsContainer}>
        {locations.map((location, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.card, { backgroundColor: darkTheme ? '#333' : '#fff' }]}
            onPress={() => fetchSunriseSunsetData(parseFloat(location.lat), parseFloat(location.lon))}
          >
            <Text style={[styles.text, { color: darkTheme ? '#fff' : '#000' }]}>
              {location.display_name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {chartData && (
        <LineChart
          data={chartData}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: darkTheme ? '#333' : '#ffffff',
            backgroundGradientTo: darkTheme ? '#444' : '#f3f3f3',
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: { borderRadius: 16 },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
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
  backButton: {
    alignSelf: 'flex-start',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#007BFF',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
  text: {
    fontSize: 16,
  },
});

export default GrafikSunset;