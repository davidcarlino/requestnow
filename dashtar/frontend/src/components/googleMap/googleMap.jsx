import React, { useCallback, useState, useEffect } from 'react';
import { GoogleMap, Marker, Autocomplete, useJsApiLoader } from '@react-google-maps/api';

const libraries = ['places'];

const mapContainerStyle = {
  height: "500px",
  width: "550px"
};
const inputStyle = {
  boxSizing: `border-box`,
  border: `1px solid transparent`,
  width: `240px`,
  height: `32px`,
  padding: `0 12px`,
  borderRadius: `3px`,
  boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
  fontSize: `14px`,
  outline: `none`,
  textOverflow: `ellipses`,
  position: 'absolute',
  top: '10px',
  right: '10px',
}

const MapComponent = () => {
  const [marker, setMarker] = useState({ lat: 37.7749, lng: -122.4194 }); // Default location
  const [autocomplete, setAutocomplete] = useState(null);
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyDCAjw9Fb5F1gt6cvLy7vwH2_qpsaLLPB0', // Replace with your actual API key
    libraries,
  });

  const onLoad = useCallback((autocomplete) => {
    console.log("autocomplete", autocomplete)
    setAutocomplete(autocomplete);
  }, []);

  const onPlaceChanged = () => {
    console.log("hhhhhh", autocomplete)
    if (autocomplete) {
      const place = autocomplete.getPlace();
      console.log("place", place)
      if (place.geometry) {
        setMarker({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
      }
    }
  };

  if (loadError) return <div>Error loading map: {loadError.message}</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div>
      

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={marker}
        zoom={10}
      >
        <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
          <input
            type="text"
            placeholder="Search for places"
            style={inputStyle}
          />
      </Autocomplete>
        <Marker position={marker} />
      </GoogleMap>
    </div>
  );
};

export default MapComponent;