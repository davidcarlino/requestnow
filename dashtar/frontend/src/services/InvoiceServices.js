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

  addNote: async (id, formData) => {
    try {
      return requests.post(`/invoice/${id}/notes`, formData, {
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
    const response = await requests.delete(`/invoice/${id}/notes/${noteId}`);
    return response;
  },
};

export default InvoiceServices; 