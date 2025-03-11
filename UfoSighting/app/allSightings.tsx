import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, FlatList, Modal, Image } from 'react-native';
import { formatDate } from './index';
import UfoSighting from './UfoSighting';
import getAllData from './allUfoData';

export default function AboutScreen() {
    const [ufoData, setUfoData] = useState<UfoSighting[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSighting, setSelectedSighting] = useState<UfoSighting | null>(null);
    const { combinedData, loadingData } = getAllData();

    useEffect(() => {
      if (!loadingData && combinedData.length > 0) {
          setUfoData(combinedData);
          setLoading(false); 
      }
  }, [combinedData, loadingData]);

    const handlePress = (sighting: UfoSighting) => {
      console.log(sighting.picture);
      setSelectedSighting(sighting);
    };

    const renderItem = ({ item }: { item: UfoSighting }) => (
        <View style={styles.item}>
          <Text style={styles.title}>{item.witnessName}</Text>
          <Text>{formatDate(new Date(item.dateTime))}</Text>
          <Text>{item.status}</Text>
          <TouchableOpacity style={styles.detailsButton} onPress={() => handlePress(item)}>
            <Text style={styles.buttonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      );
    
      return (
        <View style={styles.container}>
            <Link href="/" style={styles.addButton}>
            Go to map
                </Link>
          <FlatList
            data={ufoData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
          />
          <Link href={"/camera"} style={styles.addSightingButton}>
            <Text style={styles.buttonText}>Add a sighting</Text>
          </Link>
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
                  <Text>At latitude: {selectedSighting.location.latitude}</Text>
                  <Text>and longitude: {selectedSighting.location.longitude}</Text>
                  <Text></Text>
                  <Text style={styles.status}>Status: {selectedSighting.status.toUpperCase()}</Text>
                  <TouchableOpacity onPress={() => setSelectedSighting(null)} style={styles.closeButton}>
                    <Text style={{ color: "white" }}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}
        </View>
        
      );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
  },
  item: {
    backgroundColor: "white",
    padding: 10,
    marginVertical: 8,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
  },
  detailsButton: {
    marginTop: 10,
    backgroundColor: "blue",
    padding: 8,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
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
  addSightingButton: {
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

});
