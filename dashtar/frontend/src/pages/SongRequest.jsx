import React, {useState, useCallback} from "react";
import { Button } from "@windmill/react-ui";
import { Card, CardBody, Input, Dropdown, DropdownItem } from "@windmill/react-ui";
import { useParams } from 'react-router-dom';
//internal import
import AnimatedContent from "@/components/common/AnimatedContent";
import PageTitle from "@/components/Typography/PageTitle";
import useSongRequestSubmit from "@/hooks/useSongRequestSubmit";
import InputArea from "@/components/form/input/InputArea";
import SongServices from "@/services/SongRequestServices";

const SongRequest = () => {
  const { id } = useParams();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSongs, setSelectedSongs] = useState([]); 
  const [songRequest, setSongRequest] = useState(false);
  const [sendRequest, setSendRequest] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    onSubmit,
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
    setQuery(song.name)
    setSendRequest(true)
    const updatedSongs = selectedSongs.find((s) => s.id === song.id)
      ? selectedSongs.filter((s) => s.id !== song.id) // Remove if already selected
      : [...selectedSongs, song]; // Add if not selected
    
    setSelectedSongs(updatedSongs);
    setValue('song', updatedSongs.map((s) => s)); // Update the registered form value with song
    setValue('eventCode', id);
    setSuggestions([]); // Clear suggestions after selection
  };
  return (
    <>
      <PageTitle>{"Song Request"}</PageTitle>
      <AnimatedContent>
      <div className="flex justify-end"> 
        <Button className="h-12 w-full" onClick={() => setSongRequest(true)}>
          {"SongRequest"}
        </Button>
      </div>
      <Card className="overflow-y-scroll flex-grow scrollbar-hide w-full max-h-full">
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="px-6 pt-8 flex-grow scrollbar-hide w-full max-h-full pb-40">
              <div className="w-full">
                {songRequest &&
                  <Input
                    {...register(`song`, {
                      required: true,
                    })}
                    name="search"
                    className="mb-2"
                    placeholder="Search a Song"
                    value={query}
                    onChange={(event) => handleInputChange(event.target.value)}
                  />
                }
                {loading && <p>Loading...</p>}
                
                {suggestions.length > 0 && (
                  <ul className="bg-white border">
                    {suggestions.map((song) => (
                      <li
                        key={song.id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSelectSong(song)}
                      >
                        {song.artist} - {song.album}
                      </li>
                    ))}
                  </ul>
                )}
                {selectedSongs.length > 0 && (
                  <div className="mt-2">
                    <h4>Selected Songs:</h4>
                    {selectedSongs.map((song) => (
                      <div key={song.id} className="flex items-center mb-2">
                        <img
                          src={song.albumImage}
                          alt={song.name}
                          className="w-10 h-10 mr-2"
                        />
                        <div>
                          <p>{song.name}</p>
                          <small>{song.artist} - {song.album}</small>
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
                <Button type="submit">{"Send Request"}</Button>
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