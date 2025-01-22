const Invoice = require('../models/Invoice');
const Event = require('../models/Event');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

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
  const {
    page,
    limit,
    dueTime,
    createTime,
    name,
    sort,
  } = req.query;

  const queryObject = {
    createdBy: req.user._id
  };

  if (name && name !== 'undefined') {
    queryObject.$or = [
      { "reference": { $regex: name, $options: "i" } },
      { "services": { $regex: name, $options: "i" } }
    ];
  }

  if (createTime && dueTime) {
    queryObject.createdAt = {
      $gte: new Date(createTime),
      $lte: new Date(dueTime),
    };
  }

  const pages = Number(page) || 1;
  const limits = Number(limit) || 8;
  const skip = (pages - 1) * limits;

  try {
    const totalDoc = await Invoice.countDocuments(queryObject);
    
    let query = Invoice.find(queryObject)
      .skip(skip)
      .limit(limits);

    // Add sorting if provided
    if (sort) {
      query = query.sort(sort);
    } else {
      query = query.sort({ createdAt: -1 }); // Default sort
    }

    const invoices = await query;

    res.status(200).json({
      success: true,
      invoices,
      totalDoc,
      limits,
      pages,
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

const addNote = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });
    
    if (!invoice) {
      return res.status(404).json({
        message: 'Invoice not found or access denied',
      });
    }

    // Create note object
    const note = {
      content: req.body.content || '',
      attachments: [],
      createdAt: new Date()
    };

    // Handle multiple file attachments if present
    if (req.files && req.files.length > 0) {
      note.attachments = req.files.map(file => ({
        originalName: file.originalname,
        fileName: file.filename,
        mimeType: file.mimetype,
        size: file.size,
        path: file.path
      }));
    }

    // Add the note without validation since we're allowing either content or attachments
    invoice.notes.push(note);

    // Save the lead
    const savedInvoice = await invoice.save({ validateBeforeSave: false }); // Skip mongoose validation
    
    // Return the updated lead
    res.status(200).json(savedInvoice);
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Error adding note',
    });
  }
};

const deleteNote = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });
    if (!invoice) {
      return res.status(404).json({
        message: 'Invoice not found or access denied',
      });
    }

    invoice.notes = invoice.notes.filter(note => 
      note._id.toString() !== req.params.noteId
    );

    await invoice.save();
    res.status(200).json({
      message: "Note deleted successfully!",
      notes: invoice.notes
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getDashboardAmount = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Convert string ID to ObjectId
    const userId = new mongoose.Types.ObjectId(req.user._id);

    // Get all amounts
    const totalAmount = await Invoice.aggregate([
      {
        $match: { 
          createdBy: userId  // Now matching with ObjectId
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
          thisMonthAmount: {
            $sum: {
              $cond: [
                { 
                  $and: [
                    { $gte: ["$createdAt", startOfMonth] },
                    { $lt: ["$createdAt", new Date()] }
                  ]
                },
                "$amount",
                0
              ]
            }
          },
        }
      }
    ]);

    // Check if there are any invoices before aggregation
    const invoiceCount = await Invoice.countDocuments({ createdBy: userId });
    console.log('Total invoices for user:', invoiceCount);

    res.status(200).json({
      success: true,
      data: {
        totalAmount: totalAmount[0]?.total || 0,
        thisMonthAmount: totalAmount[0]?.thisMonthAmount || 0,
      }
    });
  } catch (error) {
    console.error('Error in getDashboardAmount:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  addInvoiceToEvent,
  updateInvoice,
  getInvoiceById,
  getAllInvoices,
  deleteInvoice,
  addNote,
  deleteNote,
  getDashboardAmount,
};
