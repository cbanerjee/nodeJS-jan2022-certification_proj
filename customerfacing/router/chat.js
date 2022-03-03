const express = require("express");
const socket = require("socket.io");
const path = require('path');

const server = express();

const http = require("http").Server(server);

const io = socket(http);

io.on("connection", (sCon)=>{
    console.log("Connection is made");
    sCon.on("message", (name, message)=>{
        io.emit("server_message", name, message);
    })

    sCon.on('name_',(name_)=>{
        // console.log("name received? "+name_);
        sCon.name_ = name_;
        io.emit("nameset", name_);
    })
})

server.set("view engine", "ejs");
server.set("views",
    [path.join(__dirname, "../views/")]);

server.get("/", (req, res)=>{
    res.render('chat');
});

http.listen(3300, ()=>{
    console.log("Server is listening on 3300");
})