import requests from "./httpService";

const LeadsServices = {
  addLead: async (body) => {
    return requests.post("/lead/add", body);
  },

  getAllLeads: async () => {
    return requests.get("/lead");
  },

  getLeadById: async (id) => {
    return requests.get(`/lead/${id}`);
  },

  deleteLead: async (id) => {
    return requests.delete(`/lead/${id}`);
  },

  updateLead: async (id, body) => {
    return requests.put(`/lead/${id}`, body);
  },

  getCompanyServices: async () => {
    return requests.get("/company");
  },

  addNote: async (id, noteData) => {
    return requests.post(`/lead/${id}/notes`, noteData);
  },

  deleteNote: async (id, noteId) => {
    const response = await requests.delete(`/lead/${id}/notes/${noteId}`);
    console.log("response", response)
    return response;
  },
};

export default LeadsServices;
