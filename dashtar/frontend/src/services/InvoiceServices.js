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

  getAllInvoices: async ({
    name,
    page = 1,
    limit = 8,
    createTime,
    dueTime,
  }) => {
    const searchName = name !== undefined && name !== null ? name : "";
    const createT = createTime !== undefined && createTime !== null ? createTime : "";
    const dueT = dueTime !== undefined && dueTime !== null ? dueTime : "";
    
    return requests.get(
      `/invoice?name=${searchName}&page=${page}&limit=${limit}&createTime=${createT}&dueTime=${dueT}`
    );
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