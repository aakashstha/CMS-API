const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");

const Gallery = require("../models/gallery");
const checkAuth = require("../middleware/check-auth");

// To store any kind of files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // null is for error
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    // To store current date-time as image name
    let date = new Date();
    let fileName = file.originalname.split(" ").join("");
    let today =
      date.getFullYear() +
      "-" +
      date.getMonth() +
      "-" +
      date.getDate() +
      "-" +
      date.getHours() +
      "-" +
      date.getMinutes() +
      "-" +
      date.getSeconds();

    cb(null, today + "_" + fileName);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/jpeg" ||
    file.mimetype == "image/png"
  ) {
    // store file with this extension
    cb(null, true);
  } else {
    // reject a file with different extension
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});
//const upload = multer({ dest: 'uploads/' });

// For Posting Image
// Here we can pass form data because upload.single() which parses form data and extracts the file from there.
// otherwise we have to manually add middleware in app.js
router.post("/", upload.single("imagePath"), async (req, res, next) => {
  // req.file is new object which is availabe due to upload.single() middleware being executed first.
  console.log(req.file);
  const gallery = new Gallery({
    _id: new mongoose.Types.ObjectId(),
    imageId: req.body.imageId,
    imagePath: req.file.path,
  });

  try {
    await gallery.save();

    res.status(201).json({
      message: "Image Added Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error from gallery POST method",
      error: error,
    });
  }
});

// For Getting  All Image
router.get("/", async (req, res, next) => {
  try {
    const result = await Gallery.find().exec();

    const response = {
      count: result.length,

      gallery: result.map((doc) => {
        return {
          imageId: doc.imageId,
          imagePath: doc.imagePath,
          request: {
            type: "GET",
            url: "http://127.0.0.1:3000/" + doc.imagePath,
          },
        };
      }),
    };
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      message: "Error from gallery GET All method",
      error: error,
    });
  }
});

// For Getting  One Image
router.get("/:imageId", async (req, res, next) => {
  const imageId = req.params.imageId;

  try {
    const result = await Gallery.findOne({ imageId: imageId }).exec();

    if (doc) {
      res.status(200).json({
        gallery: doc,
      });
      return;
    }

    res.status(404).json({
      message: "No such ID exist in our gallery",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error from GET One Image",
      error: error,
    });
  }
});

// For Updating Image
router.put("/:imageId", upload.single("imagePath"), async (req, res, next) => {
  const imageId = req.params.imageId;

  const updateImage = {
    imageId: req.body.imageId,
    imagePath: req.file.path,
  };

  try {
    // To find and delete image
    const result = await Gallery.findOne({ imageId: imageId }).exec();

    // image path from database
    const path = result.imagePath;

    if (result.imageId == imageId) {
      // To delete image from uploads folder
      fs.unlinkSync(path);
    }

    await Gallery.updateMany(
      { imageId: imageId },
      { $set: updateImage }
    ).exec();

    res.status(200).json({
      message: "Image Updated",
      newImage: updateImage,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error from gallery Update method",
      error: error,
    });
  }
});

// For Deleting Image
router.delete("/:imageId", async (req, res, next) => {
  const imageId = req.params.imageId;
  try {
    const result = await Gallery.findOne({ imageId: imageId }).exec();

    // image path from database
    const path = result.imagePath;

    if (result.imageId == imageId) {
      Gallery.deleteOne({ imageId: imageId }).exec();

      // To delete image from uploads folder
      fs.unlinkSync(path);

      res.status(200).json({
        message: "Image Deleted",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error from gallery Delete method",
      error: error,
    });
  }
});

module.exports = router;
