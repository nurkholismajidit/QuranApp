// import { Link, Stack } from 'expo-router';
// import { StyleSheet } from 'react-native';

// import { ThemedText } from '@/components/ThemedText';
// import { ThemedView } from '@/components/ThemedView';

// export default function NotFoundScreen() {
//   return (
//     <>
//       <Stack.Screen options={{ title: 'Oops!' }} />
//       <ThemedView style={styles.container}>
//         <ThemedText type="title">This screen doesn't exist.</ThemedText>
//         <Link href="/" style={styles.link}>
//           <ThemedText type="link">Go to home screen!</ThemedText>
//         </Link>
//       </ThemedView>
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 20,
//   },
//   link: {
//     marginTop: 15,
//     paddingVertical: 15,
//   },
// });
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>404</Text>
      <Text style={styles.message}>This screen doesn't exist.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 16,
    marginTop: 8,
  },
});
