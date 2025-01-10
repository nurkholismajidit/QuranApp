import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider'; // Import AppIntroSlider
import LottieView from 'lottie-react-native'; // Import LottieView
import { useRouter } from 'expo-router'; // Menggunakan expo-router untuk navigasi

const WelcomeSlider = () => {
  const router = useRouter();

  // Data untuk slider
  const slides = [
    {
      key: '1',
      title: 'Selamat Datang di Cahaya Quran App',
      text: 'Temukan kedamaian dengan membaca dan mendengarkan Al-Quran serta waktu-waktu penting',
      animation: require('../assets/CahayaQuran.json'), // Ganti dengan path animasi Lottie Anda
    },
    // {
    //   key: '1',
    //   title: 'Selamat Datang di Aplikasi Sunrise & Sunset!',
    //   text: 'Temukan waktu matahari terbit dan terbenam di lokasi Anda.',
    // text: 'Dapatkan waktu matahari terbit, terbenam, dan twilight hanya dengan sekali klik.',
    // text: 'Periksa waktu secara rutin dan tetap update tentang panjang hari dan waktu twilight.',
    //   animation: require('../assets/CahayaQuran.json'), // Ganti dengan path animasi Lottie Anda
    // },
    {
      key: '2',
      title: 'Waktu yang Akurat',
      text: 'Temukan waktu matahari terbit dan terbenam di lokasi Anda.',
      animation: require('../assets/sunset.json'), // Ganti dengan path animasi Lottie Anda
    },
    {
      key: '3',
      title: 'Tetap Terinformasi',
      text: 'Periksa waktu secara rutin dan tetap update tentang panjang hari dan waktu twilight.',
      animation: require('../assets/slide2.json'), // Ganti dengan path animasi Lottie Anda
    },
  ];

  // Fungsi untuk melanjutkan ke halaman utama setelah slider selesai
  const onDone = () => {
    router.push('/(tabs)/home'); // Ganti dengan nama halaman yang sesuai
  };

  return (
    <AppIntroSlider
      renderItem={({ item }) => (
        <View style={styles.slide}>
          <LottieView
            source={item.animation} // Memuat animasi Lottie
            autoPlay
            loop
            style={styles.animation}
          />
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.text}>{item.text}</Text>
          {item.key === '3' && ( // Menampilkan tombol di slide terakhir
            <TouchableOpacity onPress={onDone} style={styles.button}>
              <Text style={styles.buttonText}>Mulai Sekarang</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      data={slides}
      onDone={onDone}
      showSkipButton
      onSkip={onDone} // Bisa skip untuk langsung ke halaman utama
      showPrevButton={false} // Sembunyikan tombol kembali
    />
  );
};

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  animation: {
    width: '80%',
    height: '50%',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default WelcomeSlider;
