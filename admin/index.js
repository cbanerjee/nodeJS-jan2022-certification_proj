const express = require("express");
const bodyParser = require("body-parser");
const mongodb = require("./config/mongodb");
const path = require("path");

const server = express();

server.set("view engine", "ejs");
server.set("views",
    [path.join(__dirname, "./views/")]);

mongodb.connect();


server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

server.listen(3100);
server.get("/", (req, res) => {
    res.send("Hi, you're connected to Express MVC for Admin App");
    // res.sendFile(path.join(__dirname,"./src/shared/views/home.html"));
})

console.log("Server listening at 3100");