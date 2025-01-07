const express = require('express');
const router = express.Router();
const { isAuth } = require('../config/auth');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads/invoices');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 25 * 1024 * 1024 // 25MB limit
  }
});

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
router.post('/add', upload.array('files'), addInvoiceToEvent);

// Update invoice with file upload
router.put('/:id', upload.array('files'), updateInvoice);

// Get single invoice
router.get('/:id', getInvoiceById);

// Get all invoices
router.get('/', getAllInvoices);

// Delete invoice
router.delete('/:id', deleteInvoice);

module.exports = router;
