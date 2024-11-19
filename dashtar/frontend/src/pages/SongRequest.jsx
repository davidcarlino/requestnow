import React, {useState, useCallback} from "react";
import { Button } from "@windmill/react-ui";
import { Card, CardBody, Input, Dropdown, DropdownItem } from "@windmill/react-ui";
import { useParams } from 'react-router-dom';
//internal import
import AnimatedContent from "@/components/common/AnimatedContent";
import PageTitle from "@/components/Typography/PageTitle";
import useSongRequestSubmit from "@/hooks/useSongRequestSubmit";
import SongServices from "@/services/SongRequestServices";

const SongRequest = ({eventId, showSearch, onSongSubmitted, setShowSearch}) => {
  console.log("showSearch", showSearch)
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSongs, setSelectedSongs] = useState([]); 
  const [sendRequest, setSendRequest] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    onSubmit: originalOnSubmit,
  } = useSongRequestSubmit();
  
  const debounce = (func, delay) => {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  const fetchSongs = useCallback(
    debounce(async (query) => {
      if (query) {
        setLoading(true);
        try {
          const response = await SongServices.searchSong(query);
          
          setSuggestions(response);
        } catch (error) {
          console.error('Error fetching songs:', error);
        }
        setLoading(false);
      } else {
        setSuggestions([]);
      }
    }, 500),
    []
  );

  const handleInputChange = (value) => {
    setQuery(value);
    fetchSongs(value);
  }

  const handleSelectSong = (song) => {
    setSendRequest(true)
    const updatedSongs = selectedSongs.find((s) => s.id === song.id)
      ? selectedSongs.filter((s) => s.id !== song.id) // Remove if already selected
      : [...selectedSongs, song]; // Add if not selected
    console.log("updatedSongs", updatedSongs)
    if (updatedSongs.length == 0){
      setQuery("")
    } else {
      setQuery("") // Clear query after selecting a song
    }
    setSelectedSongs(updatedSongs);
    setValue('song', updatedSongs.map((s) => s)); // Update the registered form value with song
    setValue('eventCode', eventId);
    setSuggestions([]); // Clear suggestions after selection
  };

  const onSubmit = async (data) => {
    try {
      await originalOnSubmit(data);
      setSelectedSongs([]); // Clear selected songs
      setQuery(''); // Clear search query
      setSendRequest(false);
      setShowSearch(false); // Hide search after submission
      
      // Add a small delay before refreshing to ensure the backend has processed the request
      setTimeout(() => {
        if (onSongSubmitted) {
          onSongSubmitted();
        }
      }, 500);
    } catch (error) {
      console.error('Error submitting song request:', error);
    }
  };
  return (
    <>
      <AnimatedContent>
      <Card className="overflow-y-scroll flex-grow scrollbar-hide w-full max-h-full">
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="px-6 pt-8 flex-grow scrollbar-hide w-full max-h-full pb-40">
              <div className="w-full">
                {showSearch && (
                  <Input
                    name="search"
                    className="mb-2"
                    placeholder="Search a Song"
                    value={query}
                    onChange={(event) => handleInputChange(event.target.value)}
                  />
                )}
                
                <input 
                  type="hidden" 
                  {...register('song', {
                    required: true,
                  })}
                />
                
                {loading && <p className="dark:text-gray-200">Loading...</p>}
                
                {suggestions.length > 0 && (
                  <ul className="bg-white border">
                    {suggestions.map((song) => (
                      <li
                        key={song.id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                        onClick={() => handleSelectSong(song)}
                      >
                        <img 
                          src={song.albumImage} 
                          alt={song.name}
                          className="w-10 h-10 mr-2 object-cover"
                        />
                        <div>
                          <p className="font-medium">{song.name}</p>
                          <small className="text-gray-600">{song.artist}</small>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                {selectedSongs.length > 0 && (
                  <div className="mt-2">
                    <h4 className="dark:text-gray-200">Selected Songs:</h4>
                    {selectedSongs.map((song) => (
                      <div key={song.id} className="flex items-center mb-2">
                        <img
                          src={song.albumImage}
                          alt={song.name}
                          className="w-10 h-10 mr-2"
                        />
                        <div>
                          <p className="dark:text-gray-200">{song.name}</p>
                          <small className="dark:text-gray-400">{song.artist} - {song.album}</small>
                        </div>
                        <button
                          className="ml-auto bg-red-500 text-white px-2 py-1 rounded"
                          onClick={() => handleSelectSong(song)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div>
              {selectedSongs.length > 0 && sendRequest ?
                <div className="flex justify-center mt-4">
                  <Button type="submit">Confirm</Button>
                </div>
                :""
              }
            </div>
          </form>
        </CardBody>
      </Card>
      </AnimatedContent>
    </>
  )
}
export default SongRequest