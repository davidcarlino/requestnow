import requests from "./httpService";

const EventServices = {
  addEvent: async (body) => {
    return requests.post("/event/add", body);
  },
  
  getAllEvents: async ({
    body,
    headers,
    name,
    page = 1,
    limit = 8,
    startTime,
    endTime,
  }) => {
    const searchName = name !== null ? name : "";
    const startT = startTime !== null ? startTime : "";
    const endT = endTime !== null ? endTime : "";
    console.log( "ia ma here")
    return requests.get(
      `/event?name=${searchName}&page=${page}&limit=${limit}&startTime=${startT}&endTime=${endT}`,
      body,
      headers
    );
  },

  updateEvents: async (id, body) => {
    return requests.put(`/event/${id}`, body);
  },

  getEventById: async (id) => {
    return requests.get(`/event/${id}`);
  },

  deleteEvent: async (id) => {
    return requests.delete(`/event/${id}`);
  },

};

export default EventServices;
