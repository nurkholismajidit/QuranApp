// import React, { useEffect, useState } from 'react';
// import { FlatList, Text, View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';

// interface Surah {
//   number: number;
//   name: {
//     short: string;
//     long: string;
//     transliteration: {
//       en: string;
//     };
//     translation: {
//       en: string;
//     };
//   };
//   numberOfAyahs: number;
// }

// interface Ayah {
//   number: number;
//   text: {
//     arab: string;
//     transliteration: { id: string };
//   };
//   translation: { id: string };
// }

// const QuranApp: React.FC = () => {
//   const [surahs, setSurahs] = useState<Surah[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
//   const [ayahs, setAyahs] = useState<Ayah[]>([]);
//   const [selectedAyah, setSelectedAyah] = useState<Ayah | null>(null);

//   useEffect(() => {
//     const fetchSurahs = async () => {
//       try {
//         const response = await fetch('https://api.quran.gading.dev/surah');
//         if (!response.ok) {
//           throw new Error('Failed to fetch surahs');
//         }
//         const data = await response.json();
//         setSurahs(data.data);
//       } catch (err) {
//         setError('Failed to fetch surahs. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSurahs();
//   }, []);

//   const fetchSurahDetails = async (surahNumber: number) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await fetch(`https://api.quran.gading.dev/surah/${surahNumber}`);
//       if (!response.ok) {
//         throw new Error('Failed to fetch surah details');
//       }
//       const data = await response.json();
//       setSelectedSurah(data.data);
//       setAyahs(data.data.verses);
//     } catch (err) {
//       setError('Failed to fetch surah details. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchSpecificAyah = async (surahNumber: number, ayahNumber: number) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await fetch(`https://api.quran.gading.dev/surah/${surahNumber}/${ayahNumber}`);
//       if (!response.ok) {
//         throw new Error('Failed to fetch specific ayah');
//       }
//       const data = await response.json();
//       setSelectedAyah(data.data);
//     } catch (err) {
//       setError('Failed to fetch specific ayah. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderSurah = ({ item }: { item: Surah }) => (
//     <TouchableOpacity style={styles.surahItem} onPress={() => fetchSurahDetails(item.number)}>
//       <Text style={styles.surahName}>{item.name.long}</Text>
//       <Text style={styles.surahDetails}>
//         {item.name.transliteration.en} - {item.numberOfAyahs} Ayahs
//       </Text>
//     </TouchableOpacity>
//   );

//   const renderAyah = ({ item }: { item: Ayah }) => (
//     <TouchableOpacity
//       style={styles.ayahItem}
//       onPress={() => fetchSpecificAyah(selectedSurah!.number, item.number)}
//     >
//       <Text style={styles.ayahText}>{item.text?.arab || 'No Arabic text available'}</Text>
//       <Text style={styles.ayahTranslation}>{item.translation?.id || 'No translation available'}</Text>
//     </TouchableOpacity>
//   );

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" color="#4CAF50" />
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.error}>{error}</Text>
//         <TouchableOpacity style={styles.backButton} onPress={() => setError(null)}>
//           <Text style={styles.backButtonText}>Retry</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   if (selectedAyah) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.ayahText}>
//           {selectedAyah.text?.arab || 'No Arabic text available'}
//         </Text>
//         <Text style={styles.ayahTranslation}>
//           {selectedAyah.translation?.id || 'No translation available'}
//         </Text>
//         <TouchableOpacity style={styles.backButton} onPress={() => setSelectedAyah(null)}>
//           <Text style={styles.backButtonText}>Back to Ayahs List</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   if (selectedSurah) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.surahTitle}>
//           {selectedSurah.name.long} - {selectedSurah.numberOfAyahs} Ayahs
//         </Text>
//         <FlatList
//           data={ayahs}
//           keyExtractor={(item, index) => `${item.number}-${index}`}
//           renderItem={renderAyah}
//         />
//         <TouchableOpacity style={styles.backButton} onPress={() => setSelectedSurah(null)}>
//           <Text style={styles.backButtonText}>Back to Surah List</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={surahs}
//         keyExtractor={(item) => item.number.toString()}
//         renderItem={renderSurah}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f7f7f7',
//     padding: 16,
//   },
//   surahItem: {
//     backgroundColor: '#ffffff',
//     padding: 16,
//     marginBottom: 8,
//     borderRadius: 8,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     shadowOffset: { width: 0, height: 2 },
//   },
//   surahName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   surahDetails: {
//     fontSize: 14,
//     color: '#666',
//   },
//   surahTitle: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 16,
//     textAlign: 'center',
//   },
//   ayahItem: {
//     backgroundColor: '#ffffff',
//     padding: 16,
//     marginBottom: 8,
//     borderRadius: 8,
//   },
//   ayahText: {
//     fontSize: 16,
//     color: '#333',
//     marginBottom: 8,
//   },
//   ayahTranslation: {
//     fontSize: 14,
//     color: '#666',
//     fontStyle: 'italic',
//   },
//   error: {
//     fontSize: 16,
//     color: 'red',
//     textAlign: 'center',
//   },
//   backButton: {
//     marginTop: 16,
//     backgroundColor: '#4CAF50',
//     padding: 12,
//     borderRadius: 8,
//   },
//   backButtonText: {
//     color: '#fff',
//     textAlign: 'center',
//     fontWeight: 'bold',
//   },
// });

// export default QuranApp;


import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';

interface Surah {
  number: number;
  name: {
    short: string;
    long: string;
    transliteration: {
      en: string;
    };
    translation: {
      en: string;
    };
  };
  numberOfAyahs: number;
}

interface Ayah {
  number: number;
  text: {
    arab: string;
    transliteration: { id: string };
  };
  translation: { id: string };
}

const QuranApp: React.FC = () => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [filteredSurahs, setFilteredSurahs] = useState<Surah[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [selectedAyah, setSelectedAyah] = useState<Ayah | null>(null);

  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const response = await fetch('https://api.quran.gading.dev/surah');
        if (!response.ok) {
          throw new Error('Failed to fetch surahs');
        }
        const data = await response.json();
        setSurahs(data.data);
        setFilteredSurahs(data.data); // Initialize filteredSurahs
      } catch (err) {
        setError('Failed to fetch surahs. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchSurahs();
  }, []);

  useEffect(() => {
    const filtered = surahs.filter((surah) =>
      surah.name.long.toLowerCase().includes(searchText.toLowerCase()) ||
      surah.name.transliteration.en.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredSurahs(filtered);
  }, [searchText, surahs]);

  const renderSurah = ({ item }: { item: Surah }) => (
    <TouchableOpacity style={styles.surahItem} onPress={() => fetchSurahDetails(item.number)}>
      <Text style={styles.surahName}>{item.name.long}</Text>
      <Text style={styles.surahDetails}>
        {item.name.transliteration.en} - {item.numberOfAyahs} Ayahs
      </Text>
    </TouchableOpacity>
  );

  const fetchSurahDetails = async (surahNumber: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://api.quran.gading.dev/surah/${surahNumber}`);
      if (!response.ok) {
        throw new Error('Failed to fetch surah details');
      }
      const data = await response.json();
      setSelectedSurah(data.data);
      setAyahs(data.data.verses);
    } catch (err) {
      setError('Failed to fetch surah details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => setError(null)}>
          <Text style={styles.backButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (selectedSurah) {
    return (
      <View style={styles.container}>
        <Text style={styles.surahTitle}>
          {selectedSurah.name.long} - {selectedSurah.numberOfAyahs} Ayahs
        </Text>
        <FlatList
          data={ayahs}
          keyExtractor={(item, index) => `${item.number}-${index}`}
          renderItem={({ item }) => (
            <View style={styles.ayahItem}>
              <Text style={styles.ayahText}>{item.text.arab}</Text>
              <Text style={styles.ayahTranslation}>{item.translation.id}</Text>
            </View>
          )}
        />
        <TouchableOpacity style={styles.backButton} onPress={() => setSelectedSurah(null)}>
          <Text style={styles.backButtonText}>Back to Surah List</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search Surah by name or transliteration..."
        value={searchText}
        onChangeText={setSearchText}
      />
      <FlatList
        data={filteredSurahs}
        keyExtractor={(item) => item.number.toString()}
        renderItem={renderSurah}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    padding: 16,
  },
  surahItem: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  surahName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  surahDetails: {
    fontSize: 14,
    color: '#666',
  },
  surahTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  ayahItem: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  ayahText: {
    fontSize: 16,
    marginBottom: 8,
  },
  ayahTranslation: {
    fontSize: 14,
    color: '#666',
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  error: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  backButton: {
    marginTop: 16,
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default QuranApp;

