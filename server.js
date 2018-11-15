var express = require("express");

var app = express();
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

var http = require("http");

var server = http.Server(app);

var socketio = require("socket.io");

var io = socketio(server);

var sanitizeHtml = require("sanitize-html");

app.use(express.static("pub"));

//linear model
//import { RandomForestRegression as RFRegression} from 'node_modules/ml-random-forest';
 var RFRegression = require('ml-random-forest').RandomForestRegression;

var dataset = [
    //number of times the word is used 
    [2, 5, 75, 152],
    [93, 88, 93, 185],
    [89, 91, 90, 180],
    [96, 98, 100, 196],
    [73, 66, 70, 142],
    [53, 46, 55, 101],
    [69, 74, 77, 149],
    [47, 56, 60, 115],
    [87, 79, 90, 175],
    [79, 70, 88, 164],
    [69, 70, 73, 141],
    [70, 65, 74, 141],
    [93, 95, 91, 184],
    [79, 80, 73, 152],
    [70, 73, 78, 148],
    [93, 89, 96, 192],
    [78, 75, 68, 147],
    [81, 90, 93, 183],
    [88, 92, 86, 177],
    [78, 83, 77, 159],
    [82, 86, 90, 177],
    [86, 82, 89, 175],
    [78, 83, 85, 175],
    [76, 83, 71, 149],
    [96, 93, 95, 192]
];

var trainingSet = new Array(dataset.length);
var predictions = new Array(dataset.length);

for (var i = 0; i < dataset.length; ++i) {
    trainingSet[i] = dataset[i].slice(0, 3);
    predictions[i] = dataset[i][3];
}

var options = {
    seed: 3,
    maxFeatures: 2,
    replacement: false,
    nEstimators: 200
};

var regression = new RFRegression(options);
regression.train(trainingSet, predictions);
var result = regression.predict(trainingSet);
console.log(result);

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