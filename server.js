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

var client = new MongoClient("mongodb://localhost", {
    useNewUrlParser: true
});

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
var dataInputs = [];
var dataOutputs = [];

for (var i = 0; i < reviewText.length; i++) {
    var bad = 0;
    var good = 0;
    var ratings = 0;
    var name = reviewText[i].name;
    for (var j = 0; j < reviewText[i].reviews.length; j++) {
        var processedText = reviewText[i].reviews[j].review_text; // prints the review text only
        var rating = reviewText[i].reviews[j].review_rating;
        rating = parseFloat(rating);

        //formatting
        var wordSplit = processedText.split(" "); // splits the long output string into single strings so my compressArray can process it
        var toLower = wordSplit.map((eachWord) => eachWord.toLowerCase());
        var noPuc = toLower.map((eachWord) => eachWord.replace(/[.,\/#!$%\^&\*;:{}=\-_'~()]/g, ''));
        var noSpace = noPuc.map((eachWord) => eachWord.replace(/\s+/g, ''));

        function getOccurrence(array, value) {
            var count = 0;
            array.forEach((v) => (v === value && count++));
            return count;
        }
        bad = bad + (getOccurrence(noSpace, "bad"));
        good = good + (getOccurrence(noSpace, "good"));
        ratings = ratings + rating;
    }

    console.log(name);
    console.log("bad: " + bad);
    console.log("good: " + good);
    ratings = ratings / reviewText[i].reviews.length;
    console.log("ratings: " + ratings);
    //console.log (reviewText[i].reviews.length)

    ////HERE push new input/output
    dataInputs.push([bad, good]);
    dataOutputs.push([ratings]);

}
var MLR = require('ml-regression-multivariate-linear');
var mlr = new MLR(dataInputs, dataOutputs);

/*var express = require("express");
var server = express();
server.use(express.static("pub"));
var bodyParser = require("body-parser");
server.use(bodyParser.urlencoded({
    extended: true
}));*/

var MLR = require('ml-regression-multivariate-linear');
var mlr = new MLR(dataInputs, dataOutputs);

// to parse new enteries
var datas = fs.readFileSync('.\\scrape\\data.json', 'utf8');
var reviewNewText = JSON.parse(datas);
var bodyparser = require('body-parser');

for (var search = 0; search < reviewNewText.length; search++) {
    var badSearch = 0;
    var goodSearch = 0;
    var ratingsSearch = 0;
    var nameSearch = reviewNewText[search].name;
    for (var deepSearch = 0; deepSearch < reviewNewText[search].reviews.length; deepSearch++) {
        searchSearch = reviewNewText[search].reviews[deepSearch].review_text;
        var ratingSearch = reviewNewText[search].reviews[deepSearch].review_rating;
        ratingSearch = parseFloat(ratingSearch);
        //formatting 
        var searchProcess = searchSearch.split(" ");
        var toLowerSearch = searchProcess.map((eachWord) => eachWord.toLowerCase());
        var noPucSearch = toLowerSearch.map((eachWord) => eachWord.replace(/[.,\/#!$%\^&\*;:{}=\-_'~()]/g, ''));
        var noSpaceSearch = noPucSearch.map((eachWord) => eachWord.replace(/\s+/g, ''));

        // get the word count
        function getOccurrenceSearch(array, value) {
            var count = 0;
            array.forEach((v) => (v === value && count++));
            return count;
        }
        badSearch = badSearch + (getOccurrenceSearch(noSpaceSearch, "bad"));
        goodSearch = goodSearch + (getOccurrenceSearch(noSpaceSearch, "good"));
        ratingsSearch = ratingsSearch + ratingSearch;

        //.log(mlr.predict(searchSearch[search]));
    }
    if (nameSearch == "undefined") {
        nameSearch = "blank";
    } else {
        console.log(nameSearch);
    }
    // console.log(nameSearch);
    console.log("bad: " + badSearch);
    console.log("good: " + goodSearch);
    ratingsSearch = ratingsSearch / reviewNewText[search].reviews.length;
    console.log("ratings: " + ratingsSearch);

    console.log(mlr.predict([badSearch, goodSearch]));
    //console.log(mlr.predict(searchProcess));
}


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

<<<<<<< HEAD
*/
var nameForSocket = [];

=======
>>>>>>> 7b0e921d4a0f500dca1101aeb2ef56f944d009b8
io.on("connection", function (socket) {
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

client.connect(function (err) {
    if (err != null) throw err;
    else {
        db = client.db("keywords");
        console.log("Database is up");
    }
});
//Start of database manipulation functions

function addDocuments(objectList) { //pass an array of objects to be added
    db.collection("words").insertMany(objectList, function (err, res) {
        if (err) throw err;
        console.log(res.insertedCount + " documents inserted.");
    });
}

function getDocuments() { //Gets contents of whole table, returns result
    db.collection("words").find({}).toArray(function (err, result) {
        if (err) throw err;
        console.log(result);
        return result;
    });
}

function purgeDocuments() { //Deletes all dcouments in table. Use to purge test data!
    db.collection("words").drop(function (err, deleteOkay) {
        if (err) throw err;
        if (deleteOkay) console.log("*!*Documents have been purged*!*");
    });
}
//End of database manipulation functions
server.listen(80, function () {
    console.log("Server with socket.io is ready.");
});
var express = require("express");
var server = express();
server.use(express.static("pub"));
var bodyParser = require("body-parser");
server.use(bodyParser.urlencoded({
    extended: true
}));

var MLR = require('ml-regression-multivariate-linear');
