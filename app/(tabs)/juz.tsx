import React, { useState } from 'react';
import { View, Text, Button, TextInput, FlatList, StyleSheet } from 'react-native';

interface Verse {
  number: {
    inSurah: number;
  };
  text: {
    arab: string;
  };
  translation: {
    en: string;
    id: string;
  };
}

interface JuzData {
  juz: number;
  juzStartInfo: string;
  juzEndInfo: string;
  totalVerses: number;
  verses: Verse[];
}

const JuzViewer: React.FC = () => {
  const [juzNumber, setJuzNumber] = useState<string>('');
  const [juzData, setJuzData] = useState<JuzData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJuz = async () => {
    if (!juzNumber) {
      setError('Silakan masukkan nomor Juz.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://api.quran.gading.dev/juz/${juzNumber}`);
      if (!response.ok) {
        throw new Error('Gagal mendapatkan data.');
      }

      const data = await response.json();
      setJuzData(data.data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Terjadi kesalahan yang tidak diketahui.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lihat Juz</Text>
      <TextInput
        style={styles.input}
        placeholder="Masukkan nomor Juz"
        keyboardType="numeric"
        value={juzNumber}
        onChangeText={setJuzNumber}
      />
      <Button title="Tampilkan Juz" onPress={fetchJuz} />

      {loading && <Text>Memuat...</Text>}
      {error && <Text style={styles.error}>{error}</Text>}

      {juzData && (
        <View>
          <Text style={styles.info}>Juz: {juzData.juz}</Text>
          <Text style={styles.info}>Awal Juz: {juzData.juzStartInfo}</Text>
          <Text style={styles.info}>Akhir Juz: {juzData.juzEndInfo}</Text>
          <Text style={styles.info}>Jumlah Ayat: {juzData.totalVerses}</Text>

          <FlatList
            data={juzData.verses}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.ayahContainer}>
                <Text style={styles.ayahNumber}>Ayat {item.number.inSurah}</Text>
                <Text style={styles.ayahText}>{item.text.arab}</Text>
                <Text style={styles.translation}>EN: {item.translation.en}</Text>
                <Text style={styles.translation}>ID: {item.translation.id}</Text>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  error: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
  info: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  ayahContainer: {
    marginBottom: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  ayahNumber: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  ayahText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 4,
  },
  translation: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#555555',
  },
});

export default JuzViewer;
