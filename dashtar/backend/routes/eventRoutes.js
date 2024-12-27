const express = require('express');
const router = express.Router();
const { isAuth } = require('../config/auth');
const {
  addEvent,
  getAllEvents,
  updateEvents,
  getEventById,
  deleteEvent,
  addNote,
  deleteNote,
  uploadFiles,
  deleteFile
} = require('../controller/eventController');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads/events');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log(`Created directory: ${uploadsDir}`);
}

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Double-check directory exists before saving
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Create a safe filename
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

// Protect all routes with isAuth middleware
router.use(isAuth);

//add a event
router.post('/add', addEvent);

//get all event
router.get('/', getAllEvents);

//update a event
router.put('/:id', updateEvents);

//get a event by id
router.get('/:id', getEventById);

//delete a event
router.delete('/:id', deleteEvent)

// Add these routes to your eventRoutes.js
router.post('/:id/notes', addNote);
router.delete('/:eventId/notes/:noteId', deleteNote);
router.post('/:id/files', upload.array('files'), uploadFiles);
router.delete('/:eventId/files/:fileId', deleteFile);

module.exports = router;
