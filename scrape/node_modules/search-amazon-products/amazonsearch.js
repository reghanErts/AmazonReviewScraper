var CryptoJS = require('./hmac-sha256-base64-node');
var http = require('http');
var _ = require('lodash');
var xml2js = require('xml2js');

var baseQuery = {
  Condition: 'All',
  Keywords: null,
  Operation: 'ItemSearch',
  ResponseGroup: 'Images,ItemAttributes',
  SearchIndex: 'All',
  Service: 'AWSECommerceService'
};

function searchProducts(creds, searchParams, done) {
  searchParams.AWSAccessKeyId = creds.AWSAccessKeyId;
  searchParams.AssociateTag = creds.AssociateTag;
  var reqURL = getAmazonSearchURL(creds.secret, searchParams);

  var req = http.request(reqURL, onResponse);

  req.on('error', function onError(error) {
    console.log('Error while making searchProducts request', error);
    done(error);
  });
  req.end();

  function onResponse(res) {
    readResponse(res, function onBodyComplete(body) {
      xml2js.parseString(body, function parsed(err, results) {
        if ('ItemSearchErrorResponse' in results) {
          done(new Error('Throttled.'));
        }
        else {
          try {
            var items = results.ItemSearchResponse.Items[0].Item;

            if (!items || items.length < 1) {
              done(new Error('No items found.'));
            }
            else {
              var result = null;
              var error = new Error('No non-book items found');

              items.forEach(function checkItem(item, index) {
                // Skip any book results unless it's the last one.
                if (item.ItemAttributes[0].ProductTypeName.length > 0 && 
                  -1 === item.ItemAttributes[0].ProductTypeName.indexOf('BOOK')) {

                  if (index !== items.length - 1) {
                    return true;
                  }
                }

                error = null;
                result = item;
              });

              done(error, result);
            }
          }
          catch (e) {
            done(e);
          }
        }
      });
    });
  }
};

function getAmazonSearchURL(secret, queryObj) {
  _.defaults(queryObj, baseQuery);
  queryObj.Timestamp = (new Date()).toISOString();
  var sortedKeys = Object.keys(queryObj).sort();
  var queryString = '';
  sortedKeys.forEach(function encodePair(key) {
    if (queryString.length > 0) {
      queryString += '&';
    }
    queryString += (key + '=' + encodeURIComponent(queryObj[key])); 
  });
  var signature = signRequest('GET', 'webservices.amazon.com', queryString, 
    secret);
  queryString += ('&Signature=' + signature);
  return 'http://webservices.amazon.com/onca/xml?' + queryString;
}

function signRequest(method, domain, paramsString, secret) {
  var stringToSign = method + '\n' + domain + '\n' + '/onca/xml' + '\n' + 
    paramsString;
  var hash = CryptoJS.HmacSHA256(stringToSign, secret);
  var signature = CryptoJS.enc.Base64.stringify(hash);
  return encodeURIComponent(signature);
}

function readResponse(res, onBodyComplete) {
  var body = '';
  res.setEncoding('utf8');
  res.on('data', function receiveChunk(chunk) {
    body += chunk;
  });
  res.on('end', function onEnd() {
    onBodyComplete(body);
  });
}

module.exports = searchProducts;
