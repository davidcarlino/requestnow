const express = require('express');
const router = express.Router();
const { 
  addLead,
  getLeadById,
  deleteLead,
  getAllLeads,
} = require('../controller/leadsController');

// Routes
router.post('/add', addLead);
router.get('/', getAllLeads);
router.get('/:id', getLeadById);
router.delete('/:id', deleteLead);

module.exports = router;
