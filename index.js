var http = require("http");
const app = require("./app");

// npm run dev
const port = process.env.PORT || 3000;
const server = http.createServer(app);
server.listen(port);
