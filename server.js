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
    //The URL we will scrape from- the example URL
      url = 'http://www.imdb.com/title/tt1229340/';

      // The structureof our request call
      // The first parameter is our URL
      // The callback function takes 3 params, an error, response status code and the html

      request(url, function(error, response, html){
          //check errors first
        if(!error){
            //use cheerio lib.on returned html which will give jQuery functionality
            var $ = cheerio.load(html);
            // define vars captures
            var title, release, rating;
            var json = {title:"", release:"", rating:""};

            //use unique header class as a start
            $('.header').filter(function(){
                //store the data filtered into a var so we can use later
                var data= $(this);
                 // In examining the DOM we notice that the title rests within the first child element of the header tag. 
                 // Utilizing jQuery we can easily navigate and get the text by writing the following code:

                 title = data.children().first().text();

                 // Once we have our title, we'll store it to the our json object.

                 json.title = title;
            });
        }
      });
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