var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:8081/mydb"; //URL for where DB will be located
console.log("Okay so it started");
MongoClient.connect(url, {useNewUrlParser: true}, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    dbo.createCollection("keywords",function(err,db){
        if(err) throw err;
        console.log("collection created.");
    });
    console.log("Database created.");
    db.close();
});