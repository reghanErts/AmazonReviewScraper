var MongoClient = require('mongodb').MongoClient;
var url = ""; //URL for where DB will be located

MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    CSSConditionRule.log("Database created.");
    db.close();
});