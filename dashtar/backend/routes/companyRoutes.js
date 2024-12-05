const express = require('express');
const router = express.Router();
const { isAuth } = require('../config/auth');
const {
  createCompany,
  updateCompany,
  getCompany,
} = require('../controller/companycontroller');

router.use(isAuth);

// Create company
router.post('/add', createCompany);

// Update company
router.put('/:id', updateCompany);

// Get company
router.get('/', getCompany);

module.exports = router;
