// import React, { useRef } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import { useRouter } from 'expo-router';
// import LottieView from 'lottie-react-native';

// const WelcomeScreen = () => {
//   const router = useRouter();
//   const animationRef = useRef<LottieView>(null);

//   const handleStart = () => {
//     router.push('/home'); // Navigasi ke halaman utama
//   };

//   return (
//     <View style={styles.container}>
//       <LottieView
//         ref={animationRef}
//         source={require('../../assets/CahayaQuran.json')} // Pastikan path file JSON benar
//         autoPlay
//         loop
//         style={styles.lottie}
//       />
//       <Text style={styles.title}>Selamat Datang di Cahaya Quran App</Text>
//       <Text style={styles.subtitle}>Temukan kedamaian dengan membaca dan mendengarkan Al-Quran serta waktu-waktu penting</Text>
//       <TouchableOpacity style={styles.button} onPress={handleStart}>
//         <Text style={styles.buttonText}>Mulai</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f8f8f8',
//     padding: 20,
//   },
//   lottie: {
//     width: 300,
//     height: 300,
//     marginBottom: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#2c3e50',
//     marginBottom: 16,
//     textAlign: 'center',
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#7f8c8d',
//     marginBottom: 32,
//     textAlign: 'center',
//   },
//   button: {
//     backgroundColor: '#27ae60',
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     borderRadius: 8,
//   },
//   buttonText: {
//     fontSize: 18,
//     color: '#fff',
//     fontWeight: 'bold',
//   },
// });

// export default WelcomeScreen;

// // import React from 'react';
// // import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// // import { useRouter } from 'expo-router';

// // const WelcomeScreen = () => {
// //   const router = useRouter();

// //   const handleStart = () => {
// //     router.push('/home'); // Navigasi ke halaman utama (ganti 'home' sesuai kebutuhan)
// //   };

// //   return (
// //     <View style={styles.container}>
// //       <Text style={styles.title}>Selamat Datang di Quran App</Text>
// //       <Text style={styles.subtitle}>Temukan kedamaian dengan membaca dan mendengarkan Al-Quran</Text>
// //       <TouchableOpacity style={styles.button} onPress={handleStart}>
// //         <Text style={styles.buttonText}>Mulai</Text>
// //       </TouchableOpacity>
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: '#f8f8f8',
// //     padding: 20,
// //   },
// //   title: {
// //     fontSize: 24,
// //     fontWeight: 'bold',
// //     color: '#2c3e50',
// //     marginBottom: 16,
// //     textAlign: 'center',
// //   },
// //   subtitle: {
// //     fontSize: 16,
// //     color: '#7f8c8d',
// //     marginBottom: 32,
// //     textAlign: 'center',
// //   },
// //   button: {
// //     backgroundColor: '#27ae60',
// //     paddingVertical: 12,
// //     paddingHorizontal: 24,
// //     borderRadius: 8,
// //   },
// //   buttonText: {
// //     fontSize: 18,
// //     color: '#fff',
// //     fontWeight: 'bold',
// //   },
// // });

// // export default WelcomeScreen;

import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router'; // Import useRouter
import WelcomeSlider from './WelcomeSlider'; // Import WelcomeSlider

export default function Index() {
  const [showSplash, setShowSplash] = useState(true);
  const router = useRouter(); // Inisialisasi router

  useEffect(() => {
    // Mengatur Splash Screen untuk ditampilkan selama 3 detik
    const timer = setTimeout(() => {
      setShowSplash(false);
      // Navigasi ke halaman WelcomeSlider setelah splash screen
      router.push('/WelcomeSlider');
    });

    return () => clearTimeout(timer); // Bersihkan timer jika komponen dilepas
  }, []);

  return null; // Tidak perlu render apa-apa setelah splash screen
}
