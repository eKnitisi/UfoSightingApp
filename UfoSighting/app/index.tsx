"use client";

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
  iconSize: [25, 41], // Standaard Leaflet formaat
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

interface UfoSighting {
  id: number;
  witnessName: string;
  location: { latitude: number; longitude: number };
  description: string;
  picture: string;
  status: string;
  dateTime: string;
  witnessContact: string;
}

export default function Index() {
  const [ufoData, setUfoData] = useState<UfoSighting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
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
    loadData();
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
      }}
    >
      <MapContainer
        center={[51.505, -0.09]}
        zoom={3}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* ✅ Fix: Wacht op data voordat je markers rendert */}
        {!loading &&
          ufoData.map((sighting) => (
            <Marker
              key={sighting.id}
              position={[
                sighting.location.latitude,
                sighting.location.longitude,
              ]}
              icon={customIcon}
            >
              <Popup>
                <b>{sighting.witnessName}</b> <br />
                <img
                  src={sighting.picture}
                  alt="UFO"
                  style={{
                    width: "100px",
                    height: "auto",
                    borderRadius: "5px",
                  }}
                />
                <p>{sighting.description}</p>
                <small>{new Date(sighting.dateTime).toLocaleString()}</small>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}
