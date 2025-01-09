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

// Configure multer for both invoice files and note attachments
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // For both new invoices and notes, store files in invoice-specific directory
    const invoiceId = req.params.id;
    let dir = uploadsDir;

    if (invoiceId) {
      // If we have an invoice ID, store in its directory
      dir = path.join(uploadsDir, invoiceId);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }
    cb(null, dir);
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
  addNote,
  deleteNote,
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

// Add note to invoice (using same storage as invoice files)
router.post('/:id/notes', upload.array('files'), addNote);

// Delete note from invoice
router.delete('/:id/notes/:noteId', deleteNote);

module.exports = router;
