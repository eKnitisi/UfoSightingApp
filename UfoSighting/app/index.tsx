"use dom"

import { Text, View } from "react-native";
import {useState, useEffect} from "react";
import { MapContainer, Marker, Popup, SVGOverlay, TileLayer, useMap, useMapEvents } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import { LatLngTuple } from "leaflet";
import * as L from "leaflet";



export default function Index() {

  const map = L.map('map').setView([51.505, -0.09], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
  
  L.marker([51.505, -0.09]).addTo(map)
    .bindPopup('A Leaflet marker in TypeScript!')
    .openPopup();

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
<MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: "100vh", width: "100%" }}>
  
    

</MapContainer>
    </View>
  );
}
