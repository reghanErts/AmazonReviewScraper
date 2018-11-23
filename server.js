var express = require("express");

var app = express();

var http = require("http");

var server = http.Server(app);

var socketio = require("socket.io");

var io = socketio(server);

var sanitizeHtml = require("sanitize-html");

app.use(express.static("pub"));

var myArray = [["you are  coll and all c0ol"]];

for (var i = 0; i < myArray.length; i++) {
    for (var j = 0; j < myArray[i].length; j++) {
        console.log(myArray[i][j]);
        /*if(typeof myArray[j] === "undefined"){
            myArray[j]=1;
        }
        else{
            myArray[j]++;
        }*/
    }
}

for( var a in myArray){
    console.log(a +" is "+ myArray[a]);
}

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


var nameForSocket = [];

io.on("connection", function(){
    console.log("someone connected");

    socket.on("disconnect",function(){
        console.log(nameForSocket[socket.id]+"disconnected");
    })

    socket.on("findItem", function(req, res) {
        console.log(req);
    })
});

server.listen(80, function() {
	console.log("Server with socket.io is ready.");
});

app.listen('8081');
exports = module.exports = app;
// maybe have the clients be able to talk to  a help line?