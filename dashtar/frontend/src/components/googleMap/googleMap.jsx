import React, { useState, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Input } from '@windmill/react-ui';

const libraries = ['places'];
const mapContainerStyle = {
  height: "300px",
  width: "100%"
};

const MapComponent = () => {
  const [map, setMap] = useState(null);
  const [center, setCenter] = useState({ lat: 40.7128, lng: -74.0060 });
  const [marker, setMarker] = useState(null);
  const [autocompleteService, setAutocompleteService] = useState(null);
  const [placesService, setPlacesService] = useState(null);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const mapRef = useRef();

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyDCAjw9Fb5F1gt6cvLy7vwH2_qpsaLLPB0',
    libraries,
  });

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
    setMap(map);
    setAutocompleteService(new window.google.maps.places.AutocompleteService());
    setPlacesService(new window.google.maps.places.PlacesService(map));
  }, []);

  const handleInputChange = (value) => {
		setQuery(value);
    if (value.length > 0 && autocompleteService) {
      autocompleteService.getPlacePredictions(
        { input: value },
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            setSuggestions(predictions);
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
        }
      });
			setSuggestions([]);
    }
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps</div>;

  return (
    <div className="w-full">
			<Input
				className="mb-2"
				placeholder="Type a country name"
				value={query}
				onChange={(event) => handleInputChange(event.target.value)}
			/>
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
      >
        {marker && <Marker position={marker.position} title={marker.title} />}
      </GoogleMap>
    </div>
  );
};

export default MapComponent;