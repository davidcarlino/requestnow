const Venue = require("../models/Venue");

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
  
  const queryObject = {};

  if (name) {
    queryObject.$or = [
      { "name": { $regex: `${name}`, $options: "i" } },
    ];
  }
  
  const pages = Number(page) || 1;
  const limits = Number(limit);
  const skip = (pages - 1) * limits;

  try {
    // total orders count
    const totalDoc = await Venue.countDocuments(queryObject);
    const venues = await Venue.find(queryObject)
      .select(
        "_id name address type contactInfo capacity  createdAt updatedAt"
      )
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

const deleteVenue = (req, res) => {
  Venue.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      res.status(500).send({
        message: err.message,
      });
    } else {
      res.status(200).send({
        message: "Venue Deleted Successfully!",
      });
    }
  });
};

const getVenueById = async (req, res) => {
  try {
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
    const venue = await Venue.findById(req.params.id);
    if (venue) {
      venue.name = req.body.name;
      venue.address = req.body.address
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

module.exports = {
  addVenue,
  getAllVenues,
  deleteVenue,
  getVenueById,
  updateVenues
};