import requests from './httpService';

const InvoiceServices = {
  addInvoiceToEvent: async (eventCode, formData) => {
    return requests.post('/invoice/add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  updateInvoice: async (invoiceId, formData) => {
    return requests.put(`/invoice/${invoiceId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  getInvoiceById: async (invoiceId) => {
    return requests.get(`/invoice/${invoiceId}`);
  },

  getAllInvoices: async () => {
    return requests.get('/invoice');
  },

  deleteInvoice: async (invoiceId) => {
    return requests.delete(`/invoice/${invoiceId}`);
  },
};

export default InvoiceServices; 