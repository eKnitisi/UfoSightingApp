import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal,Image } from "react-native";
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from "react-native-maps";

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
        <Text style={styles.status}>Status: {selectedSighting.status.toUpperCase()}</Text>
        <TouchableOpacity onPress={() => setSelectedSighting(null)} style={styles.closeButton}>
          <Text style={{ color: "white" }}>Sluiten</Text>
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
    backgroundColor: "rgba(0,0,0,0.5)", // Donkere overlay
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
});
