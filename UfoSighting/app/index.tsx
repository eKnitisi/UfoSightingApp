import { Text, View } from "react-native";
import {useState, useEffect} from "react";

export default function Index() {

  interface UfoSighting {
    id: number;
    witnessName: string;
    location: Location;
    description: string;
    picture: string;
    status: Status;
    dateTime: Date;
    witnessContact: string;
}

interface Location {
    latitude: number;
    longitude: number;
}

enum Status {
    Confirmed = "confirmed",
    Unconfirmed = "unconfirmed",
}

  const [ufoData, setUfoData] = useState<UfoSighting[]>([]);

  useEffect(() =>{
    async function loadData() {
      try {
        const response = await fetch("https://sampleapis.assimilate.be/ufo/sightings");
        const data: UfoSighting[] = await response.json();
        setUfoData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    loadData();
  } ,[]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>{ufoData[0].id}</Text>
    </View>
  );
}
