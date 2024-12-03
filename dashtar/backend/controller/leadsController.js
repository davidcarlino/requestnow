const Leads = require('../models/Leads');

const addLead = async (req, res) => {
  try {
    const leadExists = await Leads.findOne({ email: req.body.email });
    if (leadExists) {
      return res.status(400).json({
        message: 'Lead with this email already exists',
      });
    }

    const lead = new Leads(req.body);
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
    const lead = await Leads.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({
        message: 'Lead not found',
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
    const lead = await Leads.findByIdAndDelete(req.params.id);
    if (!lead) {
      return res.status(404).json({
        message: 'Lead not found',
      });
    }
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
    const leads = await Leads.find({});
    const totalDoc = await Leads.countDocuments();

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
