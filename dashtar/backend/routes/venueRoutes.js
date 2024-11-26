const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  addVenue,
  getAllVenues,
  deleteVenue,
  getVenueById,
  updateVenues
} = require('../controller/venueController');

// Apply auth middleware to all venue routes
router.use(auth);

//add a venue
router.post('/add', addVenue);

//get all venue
router.get('/', getAllVenues);

//delete a venue
router.delete('/:id', deleteVenue);

//get a venue by id
router.get('/:id', getVenueById);

//update a venue
router.put('/:id', updateVenues);

module.exports = router;
