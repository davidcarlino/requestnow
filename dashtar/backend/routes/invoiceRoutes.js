const express = require('express');
const router = express.Router();
const { isAuth } = require('../config/auth');
// const upload = require('../middleware/uploadFile');
const {
  addInvoiceToEvent,
  updateInvoice,
  getInvoiceById,
  getAllInvoices,
  deleteInvoice,
} = require('../controller/invoiceController');

// Routes with authentication
router.use(isAuth);

// Create invoice with file upload
router.post('/add', addInvoiceToEvent);

// Update invoice with file upload
router.put('/:id', updateInvoice);

// Get single invoice
router.get('/:id', getInvoiceById);

// Get all invoices
router.get('/', getAllInvoices);

// Delete invoice
router.delete('/:id', deleteInvoice);

module.exports = router;
