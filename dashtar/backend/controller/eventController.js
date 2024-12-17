const Event = require("../models/Event");
const Venue = require("../models/Venue");

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
    .populate('venue');

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
      createdBy: req.user._id  // Only allow updating own events
    });
    
    if (!event) {
      return res.status(404).send({
        message: "Event not found or access denied"
      });
    }

    const venue = await Venue.findById(req.body.venueId);
    if (venue) {
      venue.name = req.body.location;
      venue.address = req.body.location;
      await venue.save();
    }

    event.name = req.body.name;
    event.description = req.body.description;
    event.startTime = req.body.startTime;
    event.endTime = req.body.endTime;
    event.venue = venue._id;

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

module.exports = {
    addEvent,
    getAllEvents,
    updateEvents,
    getEventById,
    deleteEvent,
    addNote,
    deleteNote,
};
