var express = require("express");

var app = express();
var fs = reqire('fs');
var request = require('request');
var cheerio = require('cheerio');

var http = require("http");

var server = http.Server(app);

var socketio = require("socket.io");

var io = socketio(server);

var sanitizeHtml = require("sanitize-html");

app.use(express.static("pub"));

app.get('/scrape',function(req,res){

});

var nameForSocket = [];

io.on("connection", function(){
    console.log("someone connected");

    socket.on("disconnect",function(){
        console.log(nameForSocket[socket.id]+"disconnected");
    })
});

server.listen(80, function() {
	console.log("Server with socket.io is ready.");
});

app.listen('8081');
exports = module.exports = app;
// maybe have the clients be able to talk to  a help line?