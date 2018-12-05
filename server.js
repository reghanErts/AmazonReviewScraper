var express = require("express");

var app = express();

var http = require("http");

var server = http.Server(app);

var socketio = require("socket.io");

var io = socketio(server);

var sanitizeHtml = require("sanitize-html");

var mongodb = require("mongodb");

var MongoClient = mongodb.MongoClient;

var ObjectID = mongodb.ObjectID;

var client = new MongoClient("mongodb://localhost", { useNewUrlParser: true });

var db;

app.use(express.static("pub"));

// get review array-> find review_text-> split the long 
//string into an array of strings to find the word count.
// from the exampledata.json 


var fs = require('fs');
var data = fs.readFileSync('.\\scrape\\ExampleData.json', 'utf8');
var reviewText = JSON.parse(data);
var bodyparser = require('body-parser');

//console.log(data);

//console.log(reviewText[0].reviews);
//console.log( count);
var realData = [];

for(var i = 0; i < reviewText.length; i++ ){
    var bad = 0;
    var good =0;
    var ratings = 0;
    var name = reviewText[i].name;
    for( var j = 0; j < reviewText[i].reviews.length; j++) {
        var process = reviewText[i].reviews[j].review_text;// prints the review text only
        var rating = reviewText[i].reviews[j].review_rating;
        rating = parseFloat(rating);
        //console.log(process);
        var wordSplit = process.split(" "); // splits the long output string into single strings so my compressArray can process it
        //wordSplit = process.replace(/\s+/g, '');
        //wordSplit = process.toLowerCase();// i need to map the array to tolowercase 
       var toLower = wordSplit.map((eachWord)=>eachWord.toLowerCase());
       var noPuc = toLower.map((eachWord)=>eachWord.replace(/[.,\/#!$%\^&\*;:{}=\-_'~()]/g,''));
       var noSpace = noPuc.map((eachWord)=> eachWord.replace(/\s+/g, ''));
    
        //console.log(toLower);
        function getOccurrence(array, value){
            var count = 0;
            array.forEach((v) => (v === value && count ++));
            return count;
        }
        bad = bad + (getOccurrence(noSpace, "bad"));
       // console.log ("hello");
        good = good + (getOccurrence(noSpace, "good"));
        ratings = ratings +  rating ;
        
   }
    console.log(name);
  console.log("bad: " + bad);
  console.log("good: " + good);
  ratings = ratings / reviewText[i].reviews.length;
  console.log("ratings: " +ratings);
  console.log(name);
  //console.log ( reviewText[i].reviews.length)

  //realData.push({"bad:" bad, "good":good, "ratings":ratings});

}
/*var express = require("express");
var server = express();
server.use(express.static("pub"));
var bodyParser = require("body-parser");
server.use(bodyParser.urlencoded({
    extended: true
}));

var MLR = require('ml-regression-multivariate-linear');

var dataInputs = [];
var dataOutputs = [];

for (let i = 0; i < 100; i++) {
    var x1 = bad;//Math.random() * 10;
    var x2 =  good;//Math.random() * 10;

    var y =  ratings;//2 * x1 + 4 * x2 + (2 * Math.random() - 1); //y = 2*x1 + 4*x2 + randomNoise

    dataInputs.push([x1, x2]);
    dataOutputs.push([y]);
}

var mlr = new MLR(dataInputs, dataOutputs);

console.log(mlr.predict([time, the])); //Should get roughly 2*3 + 4*3 = 18
console.log(mlr.predict([bad, good])); //Should get roughly 2*1 + 4*8 = 34
console.log(mlr.predict([4, 0])); //Should get roughly 2*4 + 4*0 = 8
*/

//import { RandomForestRegression as RFRegression} from 'node_modules/ml-random-forest';
var RFRegression = require('ml-random-forest').RandomForestRegression;

 dataset = realData;

 /*dataset = [
     [1, 1, 2.8],
     [0, 2, 3.625],
    [0, 4, 3.6666666666666665],
    [0, 1, 5],
     [1, 1, 4.5],
     [1, 3, 4.333333333333333],
     [1, 3, 3.625],
     [0, 1, 4.25],
     [0, 0, 4.375],
     [0, 3, 3.7142857142857144],
     [1, 2, 4],
     [1, 0, 4.857142857142857],
     [0, 1, 2.875],
     [0, 0, 4.375],
     [0, 0, 4.125],
     [0, 0, 4.875],
     [1, 1, 4],
     [0, 3, 4.375],
     [0, 0, 4.5],
     [1, 0, 2.875],
     [0, 0, 4.75],
     [0, 1, 4.625],
     [1, 2, 4.375],
     [0, 0, 4.25],
     [1, 0, 3.75],
     [0, 1, 4.25],
     [1, 2, 4],
     [1, 0, 3.625],
     [0, 1, 4.375],
     [0, 2, 4.5],
     [0, 0, 5],
     [0, 7, 4.625],
     [0, 1, 4.5],
     [0, 2, 4.714285714285714],
     [2, 3, 4],
     [0, 2, 4.5],
     [0, 1, 4.625],
     [2, 1, 3.625],
     [0, 1, 4.625],
     [0, 2, 4.25],
     [1, 1, 3.75],
     [0, 3, 4.75],
     [3, 5, 4.625],
     [0, 3, 2.5],
     [0, 0, 4.5],
     [0, 0, 4.25],
     [1, 4, 4.875],
     [1, 3, 4.375],
     [0, 3, 4.625],
     [0, 5, 4.875],
     [0, 0, 5],
     [0, 1, 4.375],
     [0, 2, 4.125],
     [0, 1, 4.125],
     [0, 0, 5],
     [0, 0, 3.6666666666666665],
     [0, 1, 2.75],
     [0, 0, 5],
     [0, 0, 4.375],
     [0, 0, 3.5],
     [0, 0, 3.6],
     [0, 0, 4.5],
     [0, 0, 4.25],
     [1, 0, 3],
     [1, 0, 4.5],
     [1, 2, 4.75],
     [1, 0, 4.5],
     [0, 0, 4.875],
     [0, 3, 4.166666666666667],
     [0, 3, 4.375],
     [0, 1, 5],
     [0, 3, 4.375],
     [0, 2, 4.125]
 ];

var dataset = [
    //number of times the word is used 
    [2, 120, 1.223333333333333222],
    [2, 88, 2.3],
    [2, 91, 4.6],
    [2, 98, 3.5],
    [2, 66, 3.4],
    [2, 46, 4.6],
    [2, 74, 2.1],
    [2, 56, 3.5],
    [2, 79, 3.6],
    [2, 70, 5.0],
    [2, 70, 3.5],
    [2, 65, 3.5],
    [2, 95, 3.4],
    [2, 80, 4.7],
    [2, 73, 2.6],
    [2, 89, 4.5],
    [2, 75, 3.8],
    [2, 90, 3.8],
    [2, 92, 1.1],
    [2, 83, 4.1],
    [2, 86, 2.2],
    [2, 82, 3.2],
    [2, 83, 3.2],
    [2, 83, 3.6],
    [2, 93, 4]
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
console.log(result);*/

var nameForSocket = [];

io.on("connection", function (socket) {
    console.log("someone connected");

    socket.on("disconnect", function () {
        console.log(nameForSocket[socket.id] + "disconnected");
    });

    // The client has requested to find a product.
    socket.on("findItem", function (ClientMessage) {
        let InfoFromClient = sanitizeHtml(ClientMessage);
        // The product must be at least 2 letters long.
        if (data[InfoFromClient] !== "undefined" && InfoFromClient.length > 2) {
            // We want to limit data transfer, and client knowledge of how many items we have, and where they are.
            let productNames = []
            let productPos = []
            // Find all products that match what the client sent.
            for (let i = 0; i < reviewText.length; i++) {
                // Make sure the name exists before trying to check if it contains what the client is looking for.
                if (typeof reviewText[i].name !== "undefined" &&
                    reviewText[i].name.toLowerCase().includes(InfoFromClient.toLowerCase())) {
                    productNames.push(reviewText[i].name);
                    productPos.push(i);
                }
            }
            if (productNames.length > 1) {
                // The server has found numerous matches; send all potential matches to the client to be specified.
                socket.emit("productList", productNames);
            } else if (productNames.length == 1) {
                // If there's only one product, send that products' information.
                socket.emit("reviews", reviewText[productPos[0]]);
            } else {
                // The server has no matches for what the client requested.
                socket.emit("searchError", "No products were found contianing that name.");
            }
        } else {
            // The server has no matches for what the client requested.
            socket.emit("searchError", "The product name you're searching for is too short.");
        }
    });
});

client.connect(function(err){
    if(err != null) throw err;
    else{
        db = client.db("keywords");
        console.log("Database is up");
    }
});
//Start of database manipulation functions

function addDocuments(objectList){ //pass an array of objects to be added
    db.collection("words").insertMany(objectList, function(err, res){
        if(err) throw err;
        console.log(res.insertedCount + " documents inserted.");
    });
}

function getDocuments(){ //Gets contents of whole table, returns result
    db.collection("words").find({}).toArray(function(err, result){
        if(err) throw err;
        console.log(result);
        return result;
    });
}

function purgeDocuments(){ //Deletes all dcouments in table. Use to purge test data!
    db.collection("words").drop(function(err, deleteOkay){
        if(err) throw err;
        if(deleteOkay) console.log("*!*Documents have been purged*!*");
    });
}
//End of database manipulation functions
server.listen(80, function () {
    console.log("Server with socket.io is ready.");
});
