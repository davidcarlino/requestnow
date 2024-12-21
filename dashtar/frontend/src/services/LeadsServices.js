import requests from "./httpService";
import axios from "axios";

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

  addNote: async (id, formData) => {
    try {
      console.log('FormData contents:'); // Debug log
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]); 
      }
      
      return requests.post(`/lead/${id}/notes`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      console.error('Error in addNote service:', error);
      throw error;
    }
  },

  deleteNote: async (id, noteId) => {
    const response = await requests.delete(`/lead/${id}/notes/${noteId}`);
    console.log("response", response)
    return response;
  },
};

export default LeadsServices;
