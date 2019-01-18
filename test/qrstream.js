'use strict';

const fs = require('fs');
const mock = require('mock-fs');
var expect = require('chai').expect;

var md5 = require('md5');

var {Encoder, Decoder} = require('../index');

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
});