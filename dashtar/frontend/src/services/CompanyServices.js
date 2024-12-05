import requests from './httpService';

const CompanyServices = {
  createCompany: async (body) => {
    return requests.post('/company/add', body);
  },

  updateCompany: async (id, body) => {
    return requests.put(`/company/${id}`, body);
  },

  getCompany: async () => {
    return requests.get('/company');
  },
};

export default CompanyServices;
