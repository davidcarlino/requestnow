const express = require('express');
const router = express.Router();
const { isAuth } = require('../config/auth');
const { 
  addLead,
  getLeadById,
  deleteLead,
  getAllLeads,
  updateLead,
  addNote,
  deleteNote,
  uploadFile,
} = require('../controller/leadsController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Add timestamp to filename to make it unique
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Add file filter
const fileFilter = (req, file, cb) => {
  // Accept images and documents
  if (file.mimetype.startsWith('image/') || 
      file.mimetype.startsWith('application/') ||
      file.mimetype.startsWith('text/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Protect all routes with isAuth middleware
router.use(isAuth);
// Routes
//add a lead
router.post('/add', addLead);

//get all leads
router.get('/', getAllLeads);

//get a lead by id
router.get('/:id', getLeadById);

//update a lead
router.put('/:id', updateLead);

//delete a lead
router.delete('/:id', deleteLead);

// Add these routes to your leadsRoutes.js
router.post('/:id/notes', upload.array('files', 5), addNote);
router.delete('/:leadId/notes/:noteId', deleteNote);

module.exports = router;
