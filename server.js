var express = require("express");

var app = express();

var http = require("http");

var server = http.Server(app);

var socketio = require("socket.io");

var io = socketio(server);

var sanitizeHtml = require("sanitize-html");

app.use(express.static("pub"));

// get review array-> find review_text-> split the long 
//string into an array of strings to find the word count.
// from the exampledata.json 

function compressArray(original) {
 
	var compressed = [];
	// make a copy of the input array
	var copy = original.slice(0);
 
	// first loop goes over every element
	for (var i = 0; i < original.length; i++) {
 
		var myCount = 0;	
		// loop over every element in the copy and see if it's the same
		for (var w = 0; w < copy.length; w++) {
			if (original[i] == copy[w]) {
				// increase amount of times duplicate is found
				myCount++;
				// sets item to undefined
				delete copy[w];
			}
		}
 
		if (myCount > 0) {
			var a = new Object();
			a.value = original[i];
			a.count = myCount;
			compressed.push(a);
		}
	}
 
	return compressed;
};

/*var testArray = new Array("you", "are", "cool", "and", "all", "cool");
var newArray = compressArray(testArray);
console.log(newArray);*/

var fs = require('fs');
var data = fs.readFileSync('.\\scrape\\ExampleData.json', 'utf8');
var reviewText = JSON.parse(data);
var bodyparser = require('body-parser');

//console.log(reviewText[0].reviews);
//Note: some products do not have a name.
 var newArray = []; 
 var longArray = [];
for(var i = 0; i < reviewText.length; i++ ){
    for( var j = 0; j < reviewText[i].reviews.length; j++) {
        var process = reviewText[i].reviews[j].review_text;// prints the review text only
        //console.log(process);
        var wordSplit = process.split(" "); // splits the long output string into single strings so my compressArray can process it
        //wordSplit = process.replace(/\s+/g, '');
       //wordSplit = process.toLowerCase();// i need to map the array to tolowercase 
       var toLower = wordSplit.map((eachWord)=>eachWord.toLowerCase());
       var replace = toLower.map((eachWord)=> eachWord.replace(/\s+/g, ''));
    
        //console.log(toLower);
        newArray = compressArray(toLower);// does the count but processes each review text seperately and doesnt add them all together 
        //console.log(newArray);
        for (var a = 0; a < newArray.length; a++) { // trying to concatinate them all together to get one list
            //console.log("hello you got here");
            longArray = longArray.concat(newArray[a]);
            //console.log("hello i'm here");
            console.log(longArray[a]);
        } 
   }
}
    console.log(longArray);

//import { RandomForestRegression as RFRegression} from 'node_modules/ml-random-forest';
 var RFRegression = require('ml-random-forest').RandomForestRegression;

var dataset = [//number of times the word is used, word count, star rating 
    [2, 120, 1.2],
    [2, 88,  2.3],
    [2, 91,  4.6],
    [2, 98,  3.5],
    [2, 66, 3.4],
    [2, 46,  4.6],
    [2, 74,  2.1],
    [2, 56,  3.5],
    [2, 79,  3.6],
    [2, 70,  5.0],
    [2, 70,  3.5],
    [2, 65,  3.5],
    [2, 95,  3.4],
    [2, 80,  4.7]/*,
    [2, 73, 78, 2.6],
    [2, 89, 96, 4.5],
    [2, 75, 68, 3.8],
    [2, 90, 93, 3.8],
    [2, 92, 86, 1.1],
    [2, 83, 77, 4.1],
    [2, 86, 90, 2.2],
    [2, 82, 89, 3.2],
    [2, 83, 85, 3.2],
    [2, 83, 71, 3.6],
    [2, 93, 95, 4]*/
];

var trainingSet = new Array(dataset.length);
var predictions = new Array(dataset.length);

for (var i = 0; i < dataset.length; ++i) {
    trainingSet[i] = dataset[i].slice(0, 3);
    predictions[i] = dataset[i][2];
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
//console.log(result);


var nameForSocket = [];

io.on("connection", function(socket){
    console.log("someone connected");

    socket.on("disconnect",function(){
        console.log(nameForSocket[socket.id]+"disconnected");
    })

    socket.on("findItem", function(data) {
        console.log(data);
        console.log("Callback.");
    })
});

server.listen(80, function() {
	console.log("Server with socket.io is ready.");
});

// maybe have the clients be able to talk to  a help line?