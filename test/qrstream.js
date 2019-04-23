'use strict';

const fs = require('fs');
const mock = require('mock-fs');
var expect = require('chai').expect;

var md5 = require('md5');

var Encoder = require('../index');

describe('#qrstream', function() {
  it('should return correct payload for text', function() {
    var content = "Hello world";
    var qrstream = Encoder(500);
    qrstream.load("text", content);
    const payload = qrstream.metadata.payload
    expect(payload.content).to.equal(content);
    expect(payload.size).to.equal(content.length);
    expect(payload.md5sum).to.equal(md5(content));
  });

  it('should return correct payload for file', function() {
    var qrstream = Encoder(500);
    var content = "This content is for mock file!";
    mock({
      'mock.file': content
    });
    qrstream.load("file", content, "mock.file");
    const payload = qrstream.metadata.payload
    expect(payload.content).to.equal(content);
    expect(payload.size).to.equal(content.length);
    expect(payload.md5sum).to.equal(md5(content));
    mock.restore();
  });

  it('should return errorCode -1', function() {
    var qrstream = Encoder(500);
    var errorCode = qrstream.load("WRONG_TYPE", "", "");
    expect(errorCode).to.equal(-1);
  });

  it('should encode correctly', function() {
    var qrstream = Encoder(500);
    var errorCode = qrstream.load("TEXT", "Hello world");
    let {meta, images} = qrstream.encode();
    expect(meta).to.equal("data:image/gif;base64,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");
    expect(images.length).to.equal(1);
    expect(images[0]).to.equal("data:image/gif;base64,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");
  });
});