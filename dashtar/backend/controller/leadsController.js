const Leads = require('../models/Leads');

const addLead = async (req, res) => {
  try {
    const leadExists = await Leads.findOne({ email: req.body.email });
    if (leadExists) {
      return res.status(400).json({
        message: 'Lead with this email already exists',
      });
    }

    const lead = new Leads({
      ...req.body,
      createdBy: req.user._id
    });
    const savedLead = await lead.save();
    
    res.status(201).json({
      message: 'Lead created successfully',
      lead: savedLead,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getLeadById = async (req, res) => {
  try {
    const lead = await Leads.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });
    
    if (!lead) {
      return res.status(404).json({
        message: 'Lead not found or access denied',
      });
    }
    res.status(200).json(lead);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteLead = async (req, res) => {
  try {
    const lead = await Leads.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });
    
    if (!lead) {
      return res.status(404).json({
        message: 'Lead not found or access denied',
      });
    }
    
    await lead.deleteOne();
    res.status(200).json({
      message: 'Lead deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAllLeads = async (req, res) => {
  try {
    const leads = await Leads.find({
      createdBy: req.user._id
    });
    const totalDoc = await Leads.countDocuments({
      createdBy: req.user._id
    });

    res.status(200).json({
      leads,
      totalDoc,
    });
  } catch (err) {
    res.status(500).json({
      error: err,
      message: 'Error getting leads',
    });
  }
};

module.exports = {
  addLead,
  getLeadById,
  deleteLead,
  getAllLeads,
};
