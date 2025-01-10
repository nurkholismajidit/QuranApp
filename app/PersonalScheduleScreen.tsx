import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PersonalScheduleScreen = () => {
  const [schedule, setSchedule] = useState<{ id: number; title: string; time: string }[]>([]);
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = async () => {
    const storedSchedule = await AsyncStorage.getItem('schedule');
    if (storedSchedule) {
      setSchedule(JSON.parse(storedSchedule));
    }
  };

  const saveSchedule = async (newSchedule: { id: number; title: string; time: string }[]) => {
    await AsyncStorage.setItem('schedule', JSON.stringify(newSchedule));
  };

  const handleAddSchedule = () => {
    if (!title || !time) {
      Alert.alert('Error', 'Judul dan waktu tidak boleh kosong!');
      return;
    }

    const newSchedule = [...schedule, { id: Date.now(), title, time }];
    setSchedule(newSchedule);
    saveSchedule(newSchedule);
    setTitle('');
    setTime('');
  };

  const handleDeleteSchedule = (id: number) => {
    const filteredSchedule = schedule.filter((item) => item.id !== id);
    setSchedule(filteredSchedule);
    saveSchedule(filteredSchedule);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jadwal Pribadi</Text>

      <TextInput
        style={styles.input}
        placeholder="Judul (misal: Bersantai di pantai)"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Waktu (misal: 06:00)"
        value={time}
        onChangeText={setTime}
      />
      <TouchableOpacity style={styles.button} onPress={handleAddSchedule}>
        <Text style={styles.buttonText}>Tambahkan Jadwal</Text>
      </TouchableOpacity>

      <FlatList
        data={schedule}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.scheduleItem}>
            <Text style={styles.scheduleText}>{`${item.title} - ${item.time}`}</Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteSchedule(item.id)}
            >
              <Text style={styles.deleteButtonText}>Hapus</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    borderColor: '#ccc',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  scheduleText: {
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#FF6347',
    padding: 5,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: 14,
  },
});

export default PersonalScheduleScreen;