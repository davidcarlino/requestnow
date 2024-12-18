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

const updateLead = async (req, res) => {
  try {
    const lead = await Leads.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });
    
    if (!lead) {
      return res.status(404).send({
        message: "Lead not found or access denied"
      });
    }

    // If updating email, check if new email already exists
    if (req.body.email && req.body.email !== lead.email) {
      const emailExists = await Leads.findOne({ 
        email: req.body.email,
        _id: { $ne: req.params.id }, // exclude current lead
        createdBy: req.user._id
      });
      if (emailExists) {
        return res.status(400).send({
          message: 'Lead with this email already exists',
        });
      }
    }

    // Update lead fields directly
    lead.firstName = req.body.firstName;
    lead.lastName = req.body.lastName;
    lead.email = req.body.email;
    lead.phone = req.body.phone;
    lead.service = req.body.service;
    lead.rating = req.body.rating;

    await lead.save();
    res.send({ 
      message: "Lead Updated Successfully!",
      lead: lead 
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const addNote = async (req, res) => {
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

    lead.notes.push({
      content: req.body.content
    });

    await lead.save();
    res.status(200).json(lead);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteNote = async (req, res) => {
  try {
    const lead = await Leads.findOne({
      _id: req.params.leadId,
      createdBy: req.user._id
    });
    if (!lead) {
      return res.status(404).json({
        message: 'Lead not found or access denied',
      });
    }

    lead.notes = lead.notes.filter(note => 
      note._id.toString() !== req.params.noteId
    );

    await lead.save();
    res.status(200).json({
      message: "Note deleted successfully!",
      notes: lead.notes
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addLead,
  getLeadById,
  deleteLead,
  getAllLeads,
  updateLead,
  addNote,
  deleteNote,
};
