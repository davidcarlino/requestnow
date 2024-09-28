import requests from "./httpService";

const VenueServices = {
  addVenue: async (body) => {
    return requests.post("/venue/add", body);
  },

  getAllVenues: async ({
    body,
    headers,
    name,
    page = 1,
    limit = 8,
  }) => {
    const searchName = name !== null ? name : "";
    console.log( "ia ma here")
    return requests.get(
      `/venue?name=${searchName}&page=${page}&limit=${limit}`,
      body,
      headers
    );
  },

  deleteVenue: async (id) => {
    return requests.delete(`/venue/${id}`);
  },

  getVenueById: async (id) => {
    return requests.get(`/venue/${id}`);
  },

  updateVenues: async (id, body) => {
    return requests.put(`/venue/${id}`, body);
  },

}
export default VenueServices;