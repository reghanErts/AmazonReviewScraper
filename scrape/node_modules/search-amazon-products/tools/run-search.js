var searchProducts = require('../amazonsearch');

if (process.argv.length < 5) {
  console.log('Usage: node tools/run-search.js <AWSAccessKeyId> <secret> <keyword>');
  process.exit();
}

var AWSAccessKeyId = process.argv[2];
var secret = process.argv[3];
var keyword = process.argv[4];

var creds = {
  AWSAccessKeyId: AWSAccessKeyId,
  secret: secret
};

var params = {
  Keywords: keyword,
  ResponseGroup: 'Medium'
};

searchProducts(creds, params, logResult);

function logResult(error, result) {
  console.log(JSON.stringify(result, null, '  '));
}
