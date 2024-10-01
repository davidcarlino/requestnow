const express = require('express');
const router = express.Router();
const { addSong, searchSong } = require('../controller/songController');

// //add a song
// router.post('/add', addSong);

// search a song
router.get('/search', searchSong);


module.exports = router;
