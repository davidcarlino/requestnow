const Event = require("../models/Event");
const Venue = require("../models/Venue");

const addEvent = async (req, res) => {
  try {
    const newVenue = new Venue({name: req.body.location, address: req.body.location});
    await newVenue.save();
    const newEvent = new Event({...req.body, venue: newVenue._id});
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

  const queryObject = {};

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
    // total orders count
    const totalDoc = await Event.countDocuments(queryObject);
    const events = await Event.find(queryObject)
      .select(
        "_id name address description startTime endTime createdAt updatedAt"
      ).populate('venue', 'address')   
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
// event update
const updateEvents = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    const venue = await Venue.findById(req.body.venueId)
    if (venue) {
      venue.name = req.body.location;
      venue.address = req.body.location
  
      await venue.save();
    }
    if (event) {
      event.name = req.body.name;
      event.description = req.body.description
      event.startTime = req.body.startTime;
      event.endTime = req.body.endTime ;
      event.venue = venue._id
  
      await event.save();
      res.send({ message: "Event Updated Successfully!" });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getEventById = async (req, res) => {
  try {

    const eventWithSongRequests = await Event.findById(req.params.id)
      .populate('songRequests')
      .populate('venue')

    if (!eventWithSongRequests) {
      console.log('Event not found');
      return null;
    }

    res.send(eventWithSongRequests);
    // return eventWithSongRequests;

    // const event = await Event.findById(req.params.id)
    // .populate({ path: "venue", select: "_id, address" })
    // .populate({ path: 'songRequest', select: 'name artist album releaseDate' });
    // res.send(event);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const deleteEvent = (req, res) => {
  Event.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      res.status(500).send({
        message: err.message,
      });
    } else {
      res.status(200).send({
        message: "Event Deleted Successfully!",
      });
    }
  });
};

module.exports = {
    addEvent,
    getAllEvents,
    updateEvents,
    getEventById,
    deleteEvent,
};
