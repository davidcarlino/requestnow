import requests from './httpService';

const InvoiceServices = {
  addInvoiceToEvent: async (eventCode, invoiceData) => {
    console.log("invoiceData", invoiceData)
    return requests.post('/invoice/add', { ...invoiceData, eventCode });
  },

  updateInvoice: async (invoiceId, invoice) => {
    return requests.put(`/invoice/${invoiceId}`, invoice);
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