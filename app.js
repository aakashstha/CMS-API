const express = require("express");
const mongoose = require("mongoose");
const app = express();
const morgan = require("morgan");
require("dotenv").config(); 

const homeRoutes = require("./api/routes/home");
const courseRoutes = require("./api/routes/courses");
const eventsRoutes = require("./api/routes/events");
const galleryRoutes = require("./api/routes/galleries");
const adminRoutes = require("./api/routes/admin");


// For Searching Course
const Course = require("./api/models/course");

// For Database Connection
const URI =
  "mongodb+srv://cms-api-hck:" +
  process.env.MONGO_DB_PW +
  "@cms-api-hck.5ptwa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose.connect(URI, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// express.json() is a built express middleware that convert request body to JSON.
app.use(express.json());
// For logging incoming request
app.use(morgan("dev"));
// It makes folder publically available
app.use("/uploads", express.static("uploads"));

// For handling CORS (Cross-Origin Resource Sharing)
// It must be done before reaching our routes which is down below
app.use((req, res, next) => {
  // It will not send response it just adjust it.
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  // Browser will always send an option request first when you send a post or put request
  if (req.method == "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, PATCH");
    return res.status(200).json({});
  }
  // Right now we would always block our incoming requests
  // So we need to pass next to carry on
  next();
});

// Our CMS main Routes
app.use("/", homeRoutes);
app.use("/courses", courseRoutes);
app.use("/events", eventsRoutes);
app.use("/gallery", galleryRoutes);
app.use("/admin", adminRoutes);

// Search API
app.get("/search/:courseAcronym", async (req, res) => {
  try {
    var regex = new RegExp(req.params.courseAcronym, "i");

    const result = await Course.find({ courseAcronym: regex });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "Error from Search API",
      error: error,
    });
  }
});

// For Errors
// Here we create error and forward it with next()
app.use((req, res, next) => {
  const error = new Error("Not Found from app");
  error.status = 404;
  next(error);
});

// For handling all kind of errors
// errors thrown from anywhere in our application
app.use((error, req, res) => {
  res.status(error.status || 500);
  res.json({
    error: {
      error: "Error thrown from anywhere in our application",
      message: error.message,
    },
  });
});

module.exports = app;
