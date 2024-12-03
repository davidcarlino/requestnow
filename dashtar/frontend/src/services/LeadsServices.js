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
};

export default LeadsServices;
