const Event = require("../models/Event");
const Venue = require("../models/Venue");
const multer = require('multer');
const path = require('path');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/events')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ storage: storage });

const addEvent = async (req, res) => {
  try {
    const newVenue = new Venue({name: req.body.location, address: req.body.location});
    await newVenue.save();
    
    const newEvent = new Event({
      ...req.body, 
      venue: newVenue._id,
      createdBy: req.user._id  // This will now use the ID from the decoded token
    });
    
    await newEvent.save();
    res.status(200).send({
      message: "Event Added Successfully!",
      event: newEvent
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getAllEvents = async (req, res) => {
  const {
    page,
    limit,
    endDate,
    startDate,
    name,
  } = req.query;
  
  const startDateData = new Date(startDate);
  startDateData.setDate(startDateData.getDate());
  const start_date = startDateData.toString();

  const endDateData = new Date(endDate);
  endDateData.setDate(endDateData.getDate());
  const end_date = endDateData.toString();

  const queryObject = {
    createdBy: req.user._id  // Filter events by logged-in user
  };

  if (name) {
    queryObject.$or = [
      { "name": { $regex: `${name}`, $options: "i" } },
    ];
  }

  if (startDate && endDate) {
    queryObject.updatedAt = {
      $gt: start_date,
      $lt: end_date,
    };
  }
  
  const pages = Number(page) || 1;
  const limits = Number(limit);
  const skip = (pages - 1) * limits;

  try {
    const totalDoc = await Event.countDocuments(queryObject);
    const events = await Event.find(queryObject)
      .select("_id name address description startTime endTime createdAt updatedAt")
      .populate('venue', 'address')   
      .populate('invoices')
      .populate('status')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limits);

    res.send({
      events,
      limits,
      pages,
      totalDoc,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      createdBy: req.user._id  // Only allow access to own events
    })
    .populate('songRequests')
    .populate('venue')
    .populate('invoices')
    .populate('status');

    if (!event) {
      return res.status(404).send({
        message: "Event not found or access denied"
      });
    }

    res.send(event);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateEvents = async (req, res) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });
    
    if (!event) {
      return res.status(404).send({
        message: "Event not found or access denied"
      });
    }

    // Handle venue updates if venueId is provided
    if (req.body.venueId) {
      const venue = await Venue.findById(req.body.venueId);
      if (venue) {
        venue.name = req.body.location;
        venue.address = req.body.location;
        await venue.save();
      }
      event.venue = venue._id;
    }

    // Update event fields
    if (req.body.name) event.name = req.body.name;
    if (req.body.description) event.description = req.body.description;
    if (req.body.startTime) event.startTime = req.body.startTime;
    if (req.body.endTime) event.endTime = req.body.endTime;
    if (req.body.status) event.status = req.body.status;

    await event.save();
    res.send({ message: "Event Updated Successfully!" });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      createdBy: req.user._id  // Only allow deleting own events
    });

    if (!event) {
      return res.status(404).send({
        message: "Event not found or access denied"
      });
    }
    await event.deleteOne({ _id: req.params.id });
    res.status(200).send({
      message: "Event Deleted Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const addNote = async (req, res) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!event) {
      return res.status(404).send({
        message: "Event not found or access denied"
      });
    }

    event.notes.push({ content: req.body.content });
    await event.save();

    res.status(200).send({
      message: "Note added successfully!",
      notes: event.notes
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const deleteNote = async (req, res) => {
  try {
    const event = await Event.findOne({
      _id: req.params.eventId,
      createdBy: req.user._id
    });

    if (!event) {
      return res.status(404).send({
        message: "Event not found or access denied"
      });
    }

    event.notes = event.notes.filter(note => 
      note._id.toString() !== req.params.noteId
    );
    
    await event.save();

    res.status(200).send({
      message: "Note deleted successfully!",
      notes: event.notes
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const uploadFiles = async (req, res) => {
  try {
    const event = await Event.findOne({
      eventCode: req.params.id,
      createdBy: req.user._id
    });

    if (!event) {
      return res.status(404).send({
        message: "Event not found or access denied"
      });
    }

    // Create proper file documents with correct paths - match the leads implementation
    const fileDocuments = req.files.map(file => ({
      name: file.originalname,
      path: file.path,  // Use the full path as stored by multer
      type: file.mimetype,
      size: file.size,
      uploadedAt: new Date()
    }));

    // Add new files to the event
    event.files = event.files.concat(fileDocuments);
    
    // Save the event
    const savedEvent = await event.save();

    res.status(200).send({
      message: "Files uploaded successfully!",
      files: savedEvent.files
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).send({
      message: err.message,
    });
  }
};

const deleteFile = async (req, res) => {
  try {
    const event = await Event.findOne({
      eventCode: req.params.eventId,
      createdBy: req.user._id
    });

    if (!event) {
      return res.status(404).send({
        message: "Event not found or access denied"
      });
    }

    event.files = event.files.filter(file => 
      file._id.toString() !== req.params.fileId
    );
    
    await event.save();

    res.status(200).send({
      message: "File deleted successfully!",
      files: event.files
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

module.exports = {
  addEvent,
  getAllEvents,
  updateEvents,
  getEventById,
  deleteEvent,
  addNote,
  deleteNote,
  uploadFiles,
  deleteFile,
};
