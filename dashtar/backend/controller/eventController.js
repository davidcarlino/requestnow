const Event = require("../models/Event");

const addEvent = async (req, res) => {
  try {
    const newEvent = new Event(req.body);
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
        "_id name location description startTime endTime createdAt updatedAt"
      )
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
    if (event) {
      event.name = req.body.name;
      event.description = req.body.description
      event.startTime = req.body.startTime;
      event.endTime = req.body.endTime ;
      event.location = req.body.location;
  
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
    const event = await Event.findById(req.params.id);
    res.send(event);
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
