const express = require("express");
const router = express.Router();

let url = "https://cms-api-heraldcollege.vercel.app";
if (process.env.NODE_ENV === "development") {
  url = "http://127.0.0.1:3000";
}

// Each app.use(middleware) is called everytime a request is sent to the server
router.get("/", (req, res) => {
  res.status(200).json({
    message:
      "Hello and Welcome to the Content Management System for Herlad College/!!",
    HTTP: "200 OK",
    type: "GET",
    request: {
      Courses: `${url}/courses`,
      Events: `${url}/events`,
      Gallery: `${url}/gallery`,
    },
  });
});

module.exports = router;
