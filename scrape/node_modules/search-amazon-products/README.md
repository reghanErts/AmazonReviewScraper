search-amazon-products
==================

Search for products via the [Amazon Product Advertising API](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/ItemSearch.html). (Filters out book results.)

(Lifted mostly from an [old project of mine](http://nonstopscrollshop.com). Not how I'd write it now, two years in the future, but hey, it works.)

Installation
------------

    npm install search-amazon-products

Usage
-----

First, you have to [get your API keys](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/becomingDev.html). The two values you need are your Access Key ID and Secret Key

    var search = require('search-amazon-products');

    var creds = {
      AWSAccessKeyId: '<your access key id>',
      secret: 'your secret key'
    };

    var params = {
      Keywords: keyword,
      ResponseGroup: 'Medium'
    };

    search(creds, params, logResult);

    function logResult(error, result) {
      console.log(JSON.stringify(result, null, '  '));
    }

Output: Usually a huge mess of JSON for you to pick through.

You can try it out with the provided `run-search` utility like so:

    node tools/run-search.js <AWSAccessKeyId> <secret> minions

License
-------

The MIT License (MIT)

Copyright (c) 2015 Jim Kang

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
