const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const user = require("./routes/user_controller.js");
const note = require("./routes/note_controller.js");
const typeOrm = require("typeorm");
const config = require("./config/db.config")
const userEntity = require("./entities/user.js");
const noteEntity = require("./entities/note.js");
const cors=require("cors")

typeOrm.createConnection({
  type: "mysql",
  host: config.HOST,
  port: 3306,
  username: config.USER,
  password: config.PASSWORD,
  database: config.DB,
  synchronize: true,
  entities: [
    userEntity,
    noteEntity
  ]
}).then(connection => {
}).catch(error => console.log(error));
// parse requests of content-type: application/json
app.use(bodyParser.json());
app.use(cors());
// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome." });
});
app.use(user)
app.use(note)

// set port, listen for requests
app.listen(8083, () => {
  console.log("Server is running on port 8083.");
});

module.exports = app;