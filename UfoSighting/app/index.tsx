import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal,Image } from "react-native";
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from "react-native-maps";
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';


interface UfoSighting {
  id: number;
  witnessName: string;
  location: {
    latitude: number;
    longitude: number;
  };
  description: string;
  picture: string;
  status: string;
  dateTime: string;
  witnessContact: string;
}

export const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-GB', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: false 
  }).format(date);
};

export default function App() {
  const [ufoData, setUfoData] = useState<UfoSighting[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSighting, setSelectedSighting] = useState<UfoSighting | null>(null);


  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          "https://sampleapis.assimilate.be/ufo/sightings"
        );
        const data: UfoSighting[] = await response.json();
        setUfoData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);



  const handlePress = (sighting: UfoSighting) => {
      setSelectedSighting(sighting);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading UFO sightings...</Text>
      </View>
    );
  }

  return (
    
    <View style={styles.container}>
  <Link href="/allSightings" style={styles.addButton}>
  Go to all sightings
      </Link>
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
        {ufoData.map((sighting) => (
          <Marker onPress={() => handlePress(sighting)}
            key={sighting.id}
            coordinate={{
              latitude: sighting.location.latitude,
              longitude: sighting.location.longitude,
            }}
          >
            {selectedSighting && (
  <Modal transparent={true} visible={true} onRequestClose={() => setSelectedSighting(null)}>
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.title}>{selectedSighting.witnessName}</Text>
        <Image source={{ uri: selectedSighting.picture }} style={styles.image} />
        <Text>{selectedSighting.description}</Text>
        <Text></Text>
        <Text>{formatDate(new Date(selectedSighting.dateTime))}</Text>
        <Text>{selectedSighting.witnessContact}</Text>
        <Text></Text>
        <Text>At latitude:{selectedSighting.location.latitude}</Text>
        <Text>and longitude:{selectedSighting.location.longitude}</Text>
        <Text></Text>
        <Text style={styles.status}>Status: {selectedSighting.status.toUpperCase()}</Text>
        <TouchableOpacity onPress={() => setSelectedSighting(null)} style={styles.closeButton}>
          <Text style={{ color: "white" }}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
)}
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 14,
  },
  status: {
    fontSize: 12,
    color: "gray",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  image: {
    width: 250,
    height: 150,
    borderRadius: 10,
    marginVertical: 10,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },

  addButton: {
    position: "absolute",  // Plaats de button bovenaan
    top: 20,               // 20px van de bovenkant
    left: 10,              // 10px van de linkerzijde
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    zIndex: 1,             // Zorg ervoor dat de knop boven de kaart komt
    color: "white",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
