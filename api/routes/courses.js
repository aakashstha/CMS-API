const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Course = require("../models/course");
const checkAuth = require("../middleware/check-auth");

// For Posting Course
router.post("/", async (req, res, next) => {
  const course = new Course({
    _id: new mongoose.Types.ObjectId(),
    courseId: req.body.courseId,
    courseAcronym: req.body.courseAcronym,
    courseFullForm: req.body.courseFullForm,
    availability: req.body.availability,
  });

  try {
    const result = await course.save();
    res.status(201).json({
      message: "Course Added Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error from course POST method",
      error: err,
    });
  }
});

// For Getting All Course
router.get("/", async (req, res, next) => {
  try {
    const result = await Course.find().exec();

    const response = {
      count: result.length,
      course: result,
    };
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      message: "Error from course GET All method",
      error: error,
    });
  }
});

// For Getting One Course
router.get("/:courseId", async (req, res, next) => {
  const courseId = req.params.courseId;

  try {
    const result = await Course.findOne({ courseId: courseId }).exec();

    // if the courseId donot exist then it return null which means 0 and 0 again means false
    if (result) {
      res.status(200).json({
        course: result,
      });
      return;
    }
    res.status(404).json({
      message: "No such ID exist in our course",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error from GET ONE Course",
      error: error,
    });
  }
});

// For Updating Course
router.put("/:courseId", async (req, res, next) => {
  const courseId = req.params.courseId;
  const updateCourse = {
    courseId: courseId,
    courseAcronym: req.body.courseAcronym,
    courseFullForm: req.body.courseFullForm,
    availability: req.body.availability,
  };

  try {
    const result = await Course.updateMany(
      { courseId: courseId },
      { $set: updateCourse }
    ).exec();

    res.status(200).json({
      message: "Course Updated",
      newCourse: updateCourse,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error from course Update method",
      error: error,
    });
  }
});

// For Deleting Course
router.delete("/:courseId", async (req, res, next) => {
  const courseId = req.params.courseId;

  try {
    const result = await Course.deleteOne({ courseId: courseId }).exec();

    res.status(200).json({
      message: "Course Deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error from course Delete method",
      error: error,
    });
  }
});

module.exports = router;
