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

  updateEvents: async (id, body, venueId) => {
    console.log("venueId", venueId)
    const updatedBody = { ...body, venueId };
    return requests.put(`/event/${id}`, updatedBody);
  },

  getEventById: async (id) => {
    return requests.get(`/event/${id}`);
  },

  deleteEvent: async (id) => {
    return requests.delete(`/event/${id}`);
  },

  addNote: async (eventId, noteData) => {
    const response = await requests.post(`/event/${eventId}/notes`, noteData);
    console.log("responseServicee", response);
    return response;
  },

  deleteNote: async (eventId, noteId) => {
    const response = await requests.delete(`/event/${eventId}/notes/${noteId}`);
    return response;
  },

  uploadFiles: async (eventId, formData) => {
    return requests.post(`/event/${eventId}/files`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  deleteFile: async (eventId, fileId) => {
    return requests.delete(`/event/${eventId}/files/${fileId}`);
  }

};

export default EventServices;
