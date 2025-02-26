import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, FlatList, Modal, Image } from 'react-native';

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

export default function AboutScreen() {
    const [ufoData, setUfoData] = useState<UfoSighting[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSighting, setSelectedSighting] = useState<UfoSighting | null>(null);
  
  
    const handlePress = (sighting: UfoSighting) => {
        setSelectedSighting(sighting);
    };
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
  
    const renderItem = ({ item }: { item: UfoSighting }) => (
        <View style={styles.item}>
          <Text style={styles.title}>{item.witnessName}</Text>
          <Text>{item.dateTime}</Text>
          <Text>{item.status}</Text>
          <TouchableOpacity style={styles.detailsButton} onPress={() => handlePress(item)}>
            <Text style={styles.buttonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      );
    
      return (
        <View style={styles.container}>
          <FlatList
            data={ufoData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
          />
          {selectedSighting && (
            <Modal transparent={true} visible={true} onRequestClose={() => setSelectedSighting(null)}>
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.title}>{selectedSighting.witnessName}</Text>
                  <Image source={{ uri: selectedSighting.picture }} style={styles.image} />
                  <Text>{selectedSighting.description}</Text>
                  <Text></Text>
                  <Text>{selectedSighting.dateTime}</Text>
                  <Text>{selectedSighting.witnessContact}</Text>
                  <Text></Text>
          
                  <Text style={styles.status}>Status: {selectedSighting.status.toUpperCase()}</Text>
                  <TouchableOpacity onPress={() => setSelectedSighting(null)} style={styles.closeButton}>
                    <Text style={{ color: "white" }}>Sluiten</Text>
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
