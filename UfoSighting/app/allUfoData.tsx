import { useEffect, useState } from 'react';
import UfoSighting from './UfoSighting';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function getAllData() {
    const [ufoData, setUfoData] = useState<UfoSighting[]>([]);
    const [loading, setLoading] = useState(true);
    const [combinedData, setCombinedData] = useState<UfoSighting[]>([]);
    const [localData, setLocalData] = useState<UfoSighting[]>([]);
    
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

    useEffect(() => {
        async function loadLocalData() {
            try {
              //await AsyncStorage.clear();

                const keys = await AsyncStorage.getAllKeys();
                const items = await AsyncStorage.multiGet(keys);
                
                const parsedData: UfoSighting[] = items.map(([key, value]) => 
                    value ? JSON.parse(value) : null
                ).filter(item => item !== null);

                setLocalData(parsedData);
            } catch (error) {
                console.error("Error loading local data:", error);
            }
        }
        loadLocalData();
    }, []);

    useEffect(() => {
        setCombinedData([...ufoData, ...localData]);
    }, [ufoData, localData]);

    return { combinedData, loadingData: loading };
}