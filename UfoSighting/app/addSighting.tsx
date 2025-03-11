import { router, useLocalSearchParams } from 'expo-router';
import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';

export default function NewScreen() {
    const { URI } = useLocalSearchParams();
    const mapRef = useRef<MapView | null>(null);

  async function confirmLocation(): Promise<void> {
    if (mapRef.current) {
      const camera = await mapRef.current.getCamera();
      const { latitude, longitude } = camera.center;
      
      router.push({ pathname: '/addSighting', params: { photoURI: URI } });

    }  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: 51.505,
          longitude: -0.09,
          latitudeDelta: 10,
          longitudeDelta: 10,
        }}
      >
      </MapView>
      <View style={styles.markerFixed}>
        <Text style={styles.markerText}>📍</Text>
      </View>
      <TouchableOpacity style={styles.buttonContainer} onPress={confirmLocation}>
          <Text style={{ color: "white" }}>Confirm Location</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },  map: {
    width: "100%",
    height: "100%",
  },  markerFixed: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -15,
    marginTop: -30, 
  },  markerText: {
    fontSize: 30,
  },  buttonContainer: {
    zIndex: 1,
    position: 'absolute',
    marginTop: 10,
    marginLeft: 10,
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
  },
});