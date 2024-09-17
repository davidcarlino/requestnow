const Event = require("../models/Event");

const addEvent = async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    await newEvent.save();
    res.status(200).send({
      message: "Event Added Successfully!",
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

  // console.log(" start_date", start_date, endDate);

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
        "_id name description startTime endTime createdAt updatedAt"
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

module.exports = {
    addEvent,
    getAllEvents
};
