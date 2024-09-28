const express = require('express');
const router = express.Router();
const {
  addVenue,
  getAllVenues,
  deleteVenue,
  getVenueById,
  updateVenues
} = require('../controller/venueController');

//add a venue
router.post('/add', addVenue);

//get all venue
router.get('/', getAllVenues);

//delete a event
router.delete('/:id', deleteVenue)

//get a venue by id
router.get('/:id', getVenueById);

//update a event
router.put('/:id', updateVenues);

module.exports = router;
