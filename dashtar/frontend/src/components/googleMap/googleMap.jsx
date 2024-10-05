import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Input } from '@windmill/react-ui';
import Error from "@/components/form/others/Error";
import './googlemapstyle.css';
const libraries = ['places'];
const mapContainerStyle = {
  height: "calc(100vh - 360px)",
  width: "100%"
};

const MapComponent = ({ register, setValue, resData, label, errors }) => {
  const [map, setMap] = useState(null);
  const [center, setCenter] = useState({ lat: 40.7128, lng: -74.0060 });
  const [marker, setMarker] = useState(null);
  const [autocompleteService, setAutocompleteService] = useState(null);
  const [placesService, setPlacesService] = useState(null);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isValidAddress, setIsValidAddress] = useState(false); // Track if valid address is selected
  const mapRef = useRef();
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyDCAjw9Fb5F1gt6cvLy7vwH2_qpsaLLPB0',
    libraries,
  });
  useEffect(() => {
    if (resData.venue || resData.venue != null) {
      setQuery(resData.venue.address)
    }
    else{
      setQuery("")
      setMarker(null)
    }
  }, [resData.venue?.address]);
  useEffect(() => {
    if (query !== "") {
      getCoordinates(query);
    }
  }, [query, map]);
  // console.log("resdata", resData)
  useEffect(() => {
    // Using setValue to update the 'location' field
    setValue('location', query);
    
  }, [query]);

  const getCoordinates = (query) => {
    if (!query) return;
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: query }, (results, status) => {
      if (status === 'OK') {
        const { location } = results[0].geometry;
        setCenter({
          lat: location.lat(),
          lng: location.lng(),
        });
        setMarker({
          position: location,
          title: results[0].formatted_address,
        });
      }
    });
  };

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
    setMap(map);
    setAutocompleteService(new window.google.maps.places.AutocompleteService());
    setPlacesService(new window.google.maps.places.PlacesService(map));
  }, []);

  const handleInputChange = (value) => {
    console.log(value)
    setQuery(value);
    setIsValidAddress(false); // Reset valid address flag when typing manually
    if (value.length > 0 && autocompleteService) {
      autocompleteService.getPlacePredictions(
        { input: value },
        (predictions, status) => {
          console.log(predictions)
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            setSuggestions(predictions);
          } else {
            setSuggestions([]);
          }
        }
      );
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (placeId) => {
    if (placesService) {
      placesService.getDetails({ placeId }, (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setCenter({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          });
          setMarker({
            position: place.geometry.location,
            title: place.formatted_address,
          });
          setQuery(place.formatted_address);
          map.panTo(place.geometry.location);
          map.setZoom(15);
          setIsValidAddress(true); // Set valid address flag to true
        }
      });
      setSuggestions([]);
    }
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps</div>;

  return (
    <div className="w-full">
      {label === "eventDrawer" &&
        <><Input
          {...register(`location`, {
            required: "Location is required",
            validate: () => isValidAddress || "Please select a valid address from the suggestions"
          })}
          name="location"
          className="mb-2"
          placeholder="Enter a Location"
          value={query}
          autoComplete ="off"
          onChange={(event) => handleInputChange(event.target.value)}
        />
        <Error errorName={errors.location} /></>
      }

      {suggestions.length > 0 && (
        <ul className="bg-white border">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.place_id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(suggestion.place_id)}
            >
              {suggestion.description}
            </li>
          ))}
        </ul>
      )}
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={10}
        onLoad={onMapLoad}
        options={{
          zoomControl: false,
          fullscreenControl: false
        }}
      >
          {marker &&<Marker position={marker.position} title={marker.title} />}
      </GoogleMap>
    </div>
  );
};

export default MapComponent;
