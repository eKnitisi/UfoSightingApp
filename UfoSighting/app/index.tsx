"use dom"

import { Text, View } from "react-native";
import {useState, useEffect, useRef} from "react";
import { MapContainer, Marker, Popup, SVGOverlay, TileLayer, useMap, useMapEvents } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import { LatLngTuple } from "leaflet";
import * as L from "leaflet";



export default function Index() {

  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) {
      const map = L.map(mapRef.current).setView([51.505, -0.09], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      L.marker([51.505, -0.15]).addTo(map)
        .bindPopup('A Leaflet marker in TypeScript!')
        .setIcon(L.icon({
          iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png',
          iconSize: [38, 95],
          iconAnchor: [22, 94],
          popupAnchor: [-3, -76]
        }))
        .openPopup();
    }})

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

  const customIcon = L.icon({
    iconUrl: "https://leafletjs.com/examples/custom-icons/leaf-green.png",
    iconSize: [38, 95],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76]
  });
  
  return (
    
    <div
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: '100vh',
        width: '100vw'
      }}
    >
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        scrollWheelZoom={false}
        style={{ pointerEvents: 'auto', height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[51.505, -0.09]} icon={customIcon}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
        </MapContainer>
      </div>)}
