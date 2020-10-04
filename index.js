const express = require("express");
const bodyParser = require("body-parser");
var cors = require("cors");
require("dotenv").config();
const connection = require("./db.config");

// create express app
const app = express();

// Setup server port
const port = process.env.PORT || 5000;

app.use(cors());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse requests of content-type - application/json
app.use(bodyParser.json());

require("./routes")(app);

// define a root route
app.get("/", (req, res) => {
  res.send("Hello World");
});

// listen for requests
app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});
