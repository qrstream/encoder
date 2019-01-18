QRStream
=========

[![Build Status](https://travis-ci.org/huajianmao/qrstream.js.svg?branch=master)](https://travis-ci.org/huajianmao/qrstream.js)
[![Coverage Status](https://coveralls.io/repos/github/huajianmao/qrstream.js/badge.svg)](https://coveralls.io/github/huajianmao/qrstream.js)

## This is a Work In Progress!!! ⚠

A javascript library for transfer data using QR Code streaming

## Installation

  `npm install qrstream`

## Usage

### Use as npm package
  ``` javascript
    var qrstream = require('qrstream');
    var qr = qrstream(500, 640);
    qr.load("TEXT", "Hello world");
    var {meta, images} = qr.encode();
  ```

### Use in browser

  1 create a `app.js` file using qrstream
  ``` shell
    "use strict;"
    var qrstream = require('qrstream');
    var qr = qrstream(500, 640);
    qr.load("TEXT", "this is for the example");

    let {meta, images} = qr.encode();
    document.getElementById("metaImage").src = meta;
  ```

  2 bundle the js
  ``` shell
    browserify app.js -o you.bundle.js
  ```

  3 include it in your html file
  ``` html
    <script type="text/javascript" src="assets/js/qrstream.bundle.js"> </script>
  ```

## Tests

  `npm test`

## Contributing

