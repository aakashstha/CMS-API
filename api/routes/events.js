const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Event = require("../models/event");
const checkAuth = require("../middleware/check-auth");

// For Posting Events
router.post("/", async (req, res, next) => {
  const event = new Event({
    _id: new mongoose.Types.ObjectId(),
    eventId: req.body.eventId,
    eventName: req.body.eventName,
    eventDescription: req.body.eventDescription,
    date: req.body.date,
  });

  try {
    await event.save();

    res.status(201).json({
      message: "Event Added Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error from event POST method",
      error: error,
    });
  }
});

// For Getting All Events
router.get("/", async (req, res, next) => {
  try {
    const result = await Event.find().exec();

    const response = {
      count: result.length,
      event: result,
    };
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      message: "Error from event GET All method",
      error: error,
    });
  }
});

// For Getting One Events
router.get("/:eventId", async (req, res, next) => {
  const eventId = req.params.eventId;

  try {
    const result = await Event.findOne({ eventId: eventId }).exec();

    if (result) {
      res.status(200).json({
        event: result,
      });
      return;
    }
    res.status(404).json({
      message: "No such ID exist in our event",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error from GET One course",
      error: error,
    });
  }
});

// For Updating Events
router.put("/:eventId", async (req, res, next) => {
  const eventId = req.params.eventId;
  const updateEvent = {
    eventId: eventId,
    eventName: req.body.eventName,
    eventDescription: req.body.eventDescription,
    date: req.body.date,
  };
  try {
    const result = await Event.updateMany(
      { eventId: eventId },
      { $set: updateEvent }
    ).exec();

    res.status(200).json({
      message: "Event Updated",
      newEvent: updateEvent,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error from event Update method",
      error: error,
    });
  }
});

// For Deleting Events
router.delete("/:eventId", async (req, res, next) => {
  const eventId = req.params.eventId;

  try {
    const result = await Event.deleteOne({ eventId: eventId }).exec();

    res.status(200).json({
      message: "Event Deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error from event Delete method",
      error: error,
    });
  }
});

module.exports = router;
