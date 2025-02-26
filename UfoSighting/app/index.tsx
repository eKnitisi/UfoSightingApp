import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
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
    Alert.alert(
      "UFO Sighting",
      `Witness: ${sighting.witnessName}\nDate: ${
        sighting.dateTime
      }\nStatus: ${sighting.status.toUpperCase()}`
    );
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
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.title}>{sighting.witnessName}</Text>
                <Text>{sighting.description}</Text>
                <Text style={styles.status}>
                  Status: {sighting.status.toUpperCase()}
                </Text>
              </View>
              <Text style={styles.title}>Tap for more info</Text>
            </Callout>
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
  callout: {
    width: 200,
    padding: 5,
  },
  title: {
    fontWeight: "bold",
    fontSize: 14,
  },
  status: {
    fontSize: 12,
    color: "gray",
  },
});
