const Venue = require("../models/Venue");
const Event = require("../models/Event");

const addVenue = async (req, res) => {
  try {
    const newVenue = new Venue(req.body);
    await newVenue.save();
    res.status(200).send({
      message: "Venue Added Successfully!",
      venue: newVenue
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getAllVenues = async (req, res) => {
  const {
    page,
    limit,
    name,
  } = req.query;
  
  try {
    // First get all events for this user using the ID from decoded token
    const userEvents = await Event.find({ createdBy: req.user._id });
    const userVenueIds = userEvents.map(event => event.venue);
    
    const queryObject = {
      _id: { $in: userVenueIds } // Filter venues that belong to user's events
    };

    if (name) {
      queryObject.$or = [
        { "name": { $regex: `${name}`, $options: "i" } },
      ];
    }
    
    const pages = Number(page) || 1;
    const limits = Number(limit);
    const skip = (pages - 1) * limits;

    const totalDoc = await Venue.countDocuments(queryObject);
    const venues = await Venue.find(queryObject)
      .select("_id name address type contactInfo capacity createdAt updatedAt")
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limits);

    res.send({
      venues,
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

const getVenueById = async (req, res) => {
  try {
    // Check if this venue belongs to any of the user's events
    const userEvent = await Event.findOne({
      createdBy: req.user._id,
      venue: req.params.id
    });

    if (!userEvent) {
      return res.status(404).send({
        message: "Venue not found or access denied"
      });
    }

    const venue = await Venue.findById(req.params.id);
    res.send(venue);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateVenues = async (req, res) => {
  try {
    // Check if this venue belongs to any of the user's events
    const userEvent = await Event.findOne({
      createdBy: req.user._id,
      venue: req.params.id
    });

    if (!userEvent) {
      return res.status(404).send({
        message: "Venue not found or access denied"
      });
    }

    const venue = await Venue.findById(req.params.id);
    if (venue) {
      venue.name = req.body.name;
      venue.address = req.body.address;
      venue.capacity = req.body.capacity;
      venue.contactInfo = req.body.contactInfo;
      venue.type = req.body.type;
  
      await venue.save();
      res.send({ message: "Venue Updated Successfully!" });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const deleteVenue = async (req, res) => {
  try {
    // Check if this venue belongs to any of the user's events
    const userEvent = await Event.findOne({
      createdBy: req.user._id,
      venue: req.params.id
    });

    if (!userEvent) {
      return res.status(404).send({
        message: "Venue not found or access denied"
      });
    }

    await Venue.deleteOne({ _id: req.params.id });
    res.status(200).send({
      message: "Venue Deleted Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

module.exports = {
  addVenue,
  getAllVenues,
  deleteVenue,
  getVenueById,
  updateVenues
};