QRStream Encoder
=========

[![Build Status](https://travis-ci.org/qrstream/encoder.svg?branch=master)](https://travis-ci.org/qrstream/encoder)
[![Coverage Status](https://coveralls.io/repos/github/qrstream/encoder/badge.svg?branch=master)](https://coveralls.io/github/qrstream/encoder?branch=master)

A javascript library for transfer data using QR Code streaming

## Installation

  `npm install qrstream/encoder`

## Usage

### Use as npm package
  ``` javascript
    var qrstream = require('qrstream-encoder');
    var capacity = 500;
    var qr = qrstream(capacity);
    qr.load("TEXT", "Hello world");
    var {meta, images} = qr.encode();
  ```

### Use in browser
  0 install `qrstream-encoder`
  ``` shell
  # It is OK to use npm in a blank directory.
  # If the package.json file does not exist, it will warn you. Just ignore it.
  npm install qrstream/encoder
  ```

  1 create a `app.js` file using qrstream
  ``` javascript
    "use strict;"
    var qrstream = require('qrstream-encoder');
    var capacity = 500;
    var qr = qrstream(capacity);
    qr.load("TEXT", "this is for the example");

    let {meta, images} = qr.encode();

    // Show the images on your page with javascript
    document.getElementById("metaImage").src = meta;
  ```

  2 bundle the js
  ``` shell
    sudo npm install -g browserify
    browserify app.js -o somename.bundle.js
  ```

  3 include it in your html file
  ``` html
    <script type="text/javascript" src="assets/js/somename.bundle.js"> </script>
  ```

## Tests

  `npm test`

## Contributing

