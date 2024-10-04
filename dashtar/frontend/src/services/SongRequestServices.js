import requests from "./httpService";

const SongServices = {
  // add a song
  addSong: async (body, eventCode) => {
    const songs = body
    const payload = {songs, eventCode};
    return requests.post("/song/add", payload);
  },

  // search a song through spotify api
  searchSong: async (body) => {
    return requests.get(`/song/search?q=${body}`);
  },

}
export default SongServices;