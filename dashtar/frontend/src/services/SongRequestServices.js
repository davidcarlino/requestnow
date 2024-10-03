import requests from "./httpService";

const SongServices = {
  // add a song
  addSong: async (body, eventCode) => {
    const updatedBody = { ...body, eventCode };
    return requests.post("/song/add", updatedBody);
  },

  // search a song through spotify api
  searchSong: async (body) => {
    return requests.get(`/song/search?q=${body}`);
  },

}
export default SongServices;