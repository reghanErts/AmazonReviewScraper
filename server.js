var express = require("express");

var app = express();

var http = require("http");

var server = http.Server(app);

var socketio = require("socket.io");

var io = socketio(server);

var sanitizeHtml = require("sanitize-html");

app.use(express.static("pub"));

var nameForSocket = [];

io.on("connection", function(){
    console.log("someone connected");

    socket.on("disconnect",function(){
        console.log(nameForSocket[socket.id]+"disconnected");
    })
});