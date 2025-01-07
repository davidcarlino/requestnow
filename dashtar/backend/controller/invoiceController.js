const Invoice = require('../models/Invoice');
const Event = require('../models/Event');
const fs = require('fs');
const path = require('path');

const addInvoiceToEvent = async (req, res) => {
	console.log("req", req.body)
  try {
    const event = await Event.findOne({
      eventCode: req.body.eventCode,
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // First create the invoice to get the ID
    const invoice = new Invoice({
      ...req.body,
      createdBy: req.user._id,
    });

    const savedInvoice = await invoice.save();

    // Create invoice-specific directory
    const invoiceDir = path.join(__dirname, `../uploads/invoices/${savedInvoice._id}`);
    if (!fs.existsSync(invoiceDir)) {
      fs.mkdirSync(invoiceDir, { recursive: true });
    }

    // Process files if they exist
    if (req.files && req.files.length > 0) {
      const files = await Promise.all(req.files.map(async (file) => {
        // Create new filename
        const filename = `${Date.now()}-${file.originalname}`;
        const newPath = path.join(invoiceDir, filename);

        // Move file to new location
        try {
          // Use fs.copyFile instead of renameSync to handle cross-device links
          await fs.promises.copyFile(file.path, newPath);
          // Delete the temporary file
          await fs.promises.unlink(file.path);

          return {
            name: file.originalname,
            path: `uploads/invoices/${savedInvoice._id}/${filename}`,
            type: file.mimetype,
            size: file.size,
            uploadedAt: new Date()
          };
        } catch (err) {
          console.error('File processing error:', err);
          throw err;
        }
      }));

      // Update invoice with file information
      savedInvoice.files = files;
      await savedInvoice.save();
    }

    // Add invoice to event
    event.invoices.push(savedInvoice._id);
    await event.save();

    res.status(201).json({
      success: true,
      message: 'Invoice created successfully',
      invoice: savedInvoice,
    });
  } catch (error) {
    // Clean up any uploaded files if there's an error
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found',
      });
    }

    // Ensure invoice directory exists
    const invoiceDir = path.join(__dirname, `../uploads/invoices/${invoice._id}`);
    if (!fs.existsSync(invoiceDir)) {
      fs.mkdirSync(invoiceDir, { recursive: true });
    }

    // Process new files
    const newFiles = req.files && req.files.length > 0 ? 
      await Promise.all(req.files.map(async (file) => {
        const filename = `${Date.now()}-${file.originalname}`;
        const newPath = path.join(invoiceDir, filename);

        try {
          await fs.promises.copyFile(file.path, newPath);
          await fs.promises.unlink(file.path);

          return {
            name: file.originalname,
            path: `uploads/invoices/${invoice._id}/${filename}`,
            type: file.mimetype,
            size: file.size,
            uploadedAt: new Date()
          };
        } catch (err) {
          console.error('File processing error:', err);
          throw err;
        }
      })) : [];

    // Combine existing files with new files
    const updatedFiles = [...invoice.files, ...newFiles];

    const updatedInvoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        files: updatedFiles,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Invoice updated successfully',
      invoice: updatedInvoice,
    });
  } catch (error) {
    // Clean up any uploaded files if there's an error
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
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
    res.send(invoice);
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
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found',
      });
    }

    // Find the event containing this invoice and remove it from the invoices array
    await Event.updateMany(
      { invoices: invoice._id },
      { $pull: { invoices: invoice._id } }
    );

    // Delete the invoice directory if it exists
    const invoiceDir = path.join(__dirname, `../uploads/invoices/${invoice._id}`);
    if (fs.existsSync(invoiceDir)) {
      fs.rmSync(invoiceDir, { recursive: true, force: true });
    }

    // Delete the invoice from the database
    await Invoice.findByIdAndDelete(req.params.id);

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
