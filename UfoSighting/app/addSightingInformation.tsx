import { router, useLocalSearchParams } from 'expo-router';
import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, TextInput } from 'react-native';
import UfoSighting from './UfoSighting';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddSightingInformationScreen() {
    const { photoURI } = useLocalSearchParams();
    const { lat } = useLocalSearchParams();
    const { long } = useLocalSearchParams();

    const [witnessName, setWitnessName] = useState('');
    const [description, setDescription] = useState('');
    const [witnessContact, setWitnessContact] = useState('');
    const [status, setStatus] = useState('Pending'); 

    const storeData = async (value: UfoSighting) => {
        try {
          const jsonValue = JSON.stringify(value);
          await AsyncStorage.setItem(String(value.id), jsonValue);
        } catch (e) {
          // saving error
        }
      };

    const saveSighting = () => {

      if(!witnessName || !description || !witnessContact || !status) {
        alert('Please fill in all fields');
        return;
      }
        const location = { latitude: Number(lat), longitude: Number(long) };
        //console.log(String(photoURI))
        const newSighting: UfoSighting = {
          id: Date.now(),
          witnessName,
          location,
          description,
          picture: String(photoURI),
          status,
          dateTime: new Date().toISOString(),
          witnessContact,
        };
        storeData(newSighting);
        router.push({ pathname: '/allSightings', params: {} });
    }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add a sighting</Text>

<TextInput
  style={styles.input}
  placeholder="Name"
  value={witnessName}
  onChangeText={setWitnessName}
/>

<TextInput
  style={styles.input}
  placeholder="Description"
  value={description}
  onChangeText={setDescription}
  multiline
/>

<TextInput
  style={styles.input}
  placeholder="Contact"
  value={witnessContact}
  onChangeText={setWitnessContact}
/>

<TextInput
  style={styles.input}
  placeholder="Status"
  value={status}
  onChangeText={setStatus}
/>

<Text style={styles.label}>Date and time: {new Date().toLocaleString()}</Text>

<Text style={styles.label}>
  Location: {lat}, {long}
</Text>

<Button title="Confirm" onPress={saveSighting} />

    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
      },
      title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
      },
      input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
      },
      label: {
        fontSize: 16,
        marginVertical: 5,
    },
});