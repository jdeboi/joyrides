// components/LocationPicker.tsx
import React, { useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import L, { LatLngExpression } from "leaflet";
import {
  useJsApiLoader,
  GoogleMap,
  Autocomplete,
} from "@react-google-maps/api";

// Define an SVG icon directly as a Leaflet icon
const customMarkerIcon = new L.DivIcon({
  html: `<svg version="1.1" id="icons" xmlns="http://www.w3.org/2000/svg" x="0" y="0" viewBox="0 0 128 128" style="enable-background:new 0 0 128 128" xml:space="preserve"><style>.st0,.st1{display:none;fill:#191919}.st1,.st4{fill-rule:evenodd;clip-rule:evenodd}.st4,.st5{display:inline;fill:#191919}</style><g id="row1"><path id="nav:4" d="M64 1C38.8 1 18.3 21.2 18.3 46S64 127 64 127s45.7-56.2 45.7-81S89.2 1 64 1zm0 73.9c-16.6 0-30-13.2-30-29.5C34 29 47.4 15.8 64 15.8S94 29 94 45.3 80.6 74.9 64 74.9z" style="fill-rule:evenodd;clip-rule:evenodd;fill:red"/></g></svg>`,

  className: "",
  iconSize: [24, 24],
  iconAnchor: [12, 24], // Anchor the icon bottom center
});

// Define the props interface
interface LocationPickerProps {
  onLocationSelect?: (
    location: { lat: number; lng: number },
    description: string
  ) => void;
}

// Your Google Maps API key
const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

const LocationPicker: React.FC<LocationPickerProps> = ({
  onLocationSelect,
}) => {
  const [markerPosition, setMarkerPosition] = useState<LatLngExpression | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const mapRef = useRef<L.Map | null>(null); // Ref to store the map instance
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const newOrleans: L.LatLngExpression = [29.95, -90.1];

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey,
    libraries: ["places"], // Load the places library for autocomplete
  });

  const handleMapClick = (event: L.LeafletMouseEvent) => {
    const { lat, lng } = event.latlng;
    setMarkerPosition([lat, lng]);
    const coordString = `[${lat}, ${lng}]`;
    setSearchQuery(coordString || "");

    if (onLocationSelect) {
      onLocationSelect({ lat, lng }, coordString);
    }
  };

  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry) {
        const lat = place.geometry.location?.lat();
        const lng = place.geometry.location?.lng();
        const newLocation = [lat!, lng!] as LatLngExpression;
        setMarkerPosition(newLocation);
        setSearchQuery(place.name || "");
        if (onLocationSelect) {
          onLocationSelect({ lat: lat!, lng: lng! }, place.name || "");
        }
        // Zoom to the new location
        if (mapRef.current) {
          mapRef.current.setView(newLocation, 13);
        }
      }
    }
  };

  // Custom hook to attach map click event
  const MapEvents = () => {
    const map = useMap();
    mapRef.current = map; // Store the map instance in the ref
    map.on("click", handleMapClick);
    return null;
  };

  return (
    <div className="mb-2">
      <div className="flex items-center space-x-2 mb-2">
        {isLoaded && (
          <div className="w-full">
            <Autocomplete
              onLoad={(autocomplete) =>
                (autocompleteRef.current = autocomplete)
              }
              onPlaceChanged={handlePlaceChanged}
            >
              <input
                type="text"
                className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none text-white dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a location or pick on map"
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.preventDefault();
                }}
              />
            </Autocomplete>
          </div>
        )}

        <button
          onClick={handlePlaceChanged}
          className="text-white bg-gray-800 hover:bg-gray-900 focus:ring-2 focus:outline-none focus:ring-gray-500 font-medium rounded-md text-xs px-3 py-1 dark:bg-gray-700 dark:hover:bg-gray-800 dark:focus:ring-gray-600"
        >
          Search
        </button>
      </div>
      <MapContainer
        key={markerPosition ? markerPosition.toString() : "initial-map"}
        center={newOrleans}
        minZoom={12}
        zoom={12}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`}
          attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> contributors'
          tileSize={512}
          zoomOffset={-1}
        />
        {markerPosition && (
          <Marker position={markerPosition} icon={customMarkerIcon}></Marker>
        )}
        <MapEvents />
      </MapContainer>
    </div>
  );
};

export default LocationPicker;
