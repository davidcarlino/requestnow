import requests from "./httpService";

const SongServices = {
  // addSong: async (body) => {
  //   return requests.post("/venue/add", body);
  // },
  searchSong: async (body) => {
    return requests.get(`/song/search?q=${body}`);
  }

}
export default SongServices;