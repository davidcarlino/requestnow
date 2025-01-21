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

  getAllInvoices: async (params = {}) => {
    const {
      name = '',
      page = 1,
      limit = 8,
      createTime = '',
      dueTime = '',
      sort = '',
    } = params;

    const queryParams = new URLSearchParams({
      name,
      page: page.toString(),
      limit: limit.toString(),
      createTime,
      dueTime,
      ...(sort && { sort }),
    }).toString();

    return requests.get(`/invoice?${queryParams}`);
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

  getDashboardAmount: async () => {
    return requests.get('/invoice/dashboard/amount');
  },
};

export default InvoiceServices; 