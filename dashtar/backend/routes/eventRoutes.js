const express = require('express');
const router = express.Router();
const {
  addEvent,
  getAllEvents
} = require('../controller/eventController');

//add a event
router.post('/add', addEvent);

//get all event
router.get('/', getAllEvents);

module.exports = router;
