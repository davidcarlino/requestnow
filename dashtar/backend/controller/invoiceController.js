const Invoice = require('../models/Invoice');
const Event = require('../models/Event');
const { uploadMultipleFiles } = require('../utils/uploadFile');

const addInvoiceToEvent = async (req, res) => {
	console.log("req", req.body)
  try {
    let fileUrls = [];
    if (req.files && req.files.length > 0) {
      fileUrls = await uploadMultipleFiles(req.files);
    }
		const event = await Event.findOne({
      eventCode: req.body.eventCode,
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    const invoice = new Invoice({
      ...req.body,
      files: fileUrls,
      createdBy: req.user._id,
    });

    const savedInvoice = await invoice.save();
		event.invoices.push(savedInvoice._id);
		await event.save();
    res.status(201).json({
      success: true,
      message: 'Invoice created successfully',
      invoice: savedInvoice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateInvoice = async (req, res) => {
  try {
    let fileUrls = [];
    if (req.files && req.files.length > 0) {
      fileUrls = await uploadMultipleFiles(req.files);
    }

    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        ...(fileUrls.length > 0 && { files: fileUrls }),
      },
      { new: true }
    );

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Invoice updated successfully',
      invoice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found',
      });
    }
    res.status(200).json({
      success: true,
      invoice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      invoices,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Invoice deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addInvoiceToEvent,
  updateInvoice,
  getInvoiceById,
  getAllInvoices,
  deleteInvoice,
	
};
