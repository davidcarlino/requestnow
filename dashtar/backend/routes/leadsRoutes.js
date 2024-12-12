const express = require('express');
const router = express.Router();
const { isAuth } = require('../config/auth');
const { 
  addLead,
  getLeadById,
  deleteLead,
  getAllLeads,
  updateLead,
} = require('../controller/leadsController');

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

module.exports = router;
