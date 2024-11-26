const express = require('express');
const router = express.Router();
const { isAuth } = require('../config/auth');
const {
  addEvent,
  getAllEvents,
  updateEvents,
  getEventById,
  deleteEvent
} = require('../controller/eventController');

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

module.exports = router;
