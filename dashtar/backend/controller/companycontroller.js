const Company = require('../models/Company');

const createCompany = async (req, res) => {
  try {
    const { name, email, phone, services } = req.body;
    const userId = req.user._id;

    // Check if company already exists for this user
    const existingCompany = await Company.findOne({ user: userId });
    if (existingCompany) {
      return res.status(400).json({
        message: 'Company already exists for this user',
      });
    }

    // Ensure services is an array
    const servicesArray = Array.isArray(services) ? services : [];

    const company = new Company({
      name,
      email,
      phone,
      services: servicesArray,
      logo: req.body.logo || '',
      user: userId,
    });

    const savedCompany = await company.save();
    res.status(201).json(savedCompany);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCompany = async (req, res) => {
  try {
    const userId = req.user._id;
    const company = await Company.findOne({ user: userId });

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Ensure services is an array when updating
    const updateData = { ...req.body };
    if (updateData.services) {
      updateData.services = Array.isArray(updateData.services) 
        ? updateData.services 
        : [];
    }

    const updatedCompany = await Company.findByIdAndUpdate(
      company._id,
      {
        $set: updateData,
      },
      { new: true }
    );

    res.status(200).json(updatedCompany);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCompany = async (req, res) => {
  try {
    const userId = req.user._id;
    const company = await Company.findOne({ user: userId });

    if (!company) {
      return res.status(200).json({ 
        exists: false,
        message: 'No company found for this user' 
      });
    }

    res.status(200).json({
      exists: true,
      ...company.toObject()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCompany,
  updateCompany,
  getCompany,
};
