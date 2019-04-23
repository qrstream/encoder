"use strict";

var fs = require('fs');
var md5 = require('md5');

var QRCode = require('qrcode-generator');
const QRCODE_TYPE = 0;
const QRCODE_LEVEL = "Q";
const QRCODE_CELL_SIZE = 6;
const QRCODE_MARGIN = 4;

const CONTENT_TYPE = ["FILE", "TEXT"];
const SEQ_NUM_LENGTH = 3;
const TAG_LENGTH = 5;

/**
 * METADATA layout:
 * ================
 * metadata: {
 *   qrcode: {capacity},
 *   payload: {tag, seqlen, count, type, size, md5sum, content, *name*, *path*},
 *   stream: {interval, loop}
 * }
 *
 * METADATA Image Data Format:
 * ===========================
 * tag|seqlen|count|type|size|md5sum{|name}
 *
 * PAYLOAD Image Data Format:
 * ==========================
 * tag seq content
 * (no space between those three part)
 */

var qrstream = function () {
  var Encoder = function (qrCapacity) {
    var _this = {};

    /**
     * Load content to encode
     * @param type
     * @param content
     * @returns errorCode
     */
    _this.load = function (type, content, filename) {
      var errorCode = 0;

      var payload = _this.metadata.payload;

      payload.seqlen = SEQ_NUM_LENGTH;
      if (type) {
        type = type.toUpperCase();
      }
      switch (type) {
        case "TEXT":
          payload.type = "TEXT";
          payload.content = content;
          payload.size = content.length;
          payload.md5sum = md5(content);
          break;
        case "FILE":
          payload.type = "FILE";
          payload.name = filename; // payload.path.split("/").pop();
          payload.content = content; // fs.readFileSync(payload.path, "utf8");
          payload.size = payload.content.length;
          payload.md5sum = md5(payload.content);
          break;
        default:
          errorCode = -1;
          payload.type = undefined;
          return errorCode;
      }

      payload.count = Math.ceil(payload.size / _netPayloadSize());
      payload.tag = _tag(payload);
    };

    const _netPayloadSize = function () {
      return _this.metadata.qrcode.capacity - SEQ_NUM_LENGTH - TAG_LENGTH;
    };
    const _tag = function(payload) {
      return payload.md5sum.substr(0, TAG_LENGTH);
    };

    const _metadataImage = function(metadata) {
      let payload = metadata.payload;
      return [
        payload.tag, payload.seqlen, payload.count, payload.type, payload.size, payload.md5sum, payload.name
      ].join("|");
    };
    const _payloadImage = function(tag, seq, content) {
      seq = seq.toString(16);
      seq = seq.length >= SEQ_NUM_LENGTH ? seq : new Array(SEQ_NUM_LENGTH - seq.length + 1).join('0') + seq;
      return tag + seq + content;
    };
    const _format = function(content) {
      let qrcode = QRCode(QRCODE_TYPE, QRCODE_LEVEL);
      qrcode.addData(content);
      qrcode.make();
      // Image size = (_typeNumber * 4 + 17) * 6
      let image = qrcode.createDataURL(QRCODE_CELL_SIZE, QRCODE_MARGIN);
      return image;
    };

    // FIXME:
    _this.encode = function() {
      let text = _this.metadata.payload.content;
      let tag = _this.metadata.payload.tag;
      let size = _netPayloadSize();

      const length = text.length;
      let images = [];
      let index = 0;
      let seq = 1;

      while (index < length) {
        let end = Math.min(index + size, length);
        let image = _format(_payloadImage(tag, seq, text.substring(index, end)));
        images.push(image);
        seq++;
        index = end;
      }

      let meta = _format(_metadataImage(_this.metadata))

      return {meta, images};
    };

    _this.metadata = {}
    var qrcode = {};
    qrcode.capacity = qrCapacity;

    _this.metadata.qrcode = qrcode;
    _this.metadata.payload = {};
    _this.metadata.stream = {};

    return _this;
  }

  return Encoder;
}();

(function (factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  }
}(function () {
  return qrstream;
}));

