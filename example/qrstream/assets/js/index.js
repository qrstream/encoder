
"use strict;"

let MAX_FILE_SIZE = 50 * 1024;
var qrstream = require('../../../../index')

var intervalId;
var metaImage;
var payloadImages = [];

let metaImageElement = document.getElementById("metaImage");
let streamImageElement = document.getElementById("streamImage");
let missingImageElement = document.getElementById("missingImage");

let inputFileLabel = document.getElementById("inputFileLabel");
let inputFile = document.getElementById("inputFile");
let missingFrame = document.getElementById("missingFrame");
let generateButton = document.getElementById("generateButton");
let clearButton = document.getElementById("clearButton");
let findMissingButton = document.getElementById("findMissingButton");

_clearAll = function() {
  metaImageElement.src = "";
  streamImageElement.src = "";
  missingImageElement.src = "";

  inputFileLabel.innerText = "Choose File";
  inputFile.files = undefined;
  missingFrame.value = "";
  missingFrame.placeholder= "Frame ID: 1";

  clearInterval(intervalId);
}
inputFile.addEventListener("change", function() {
  var x = inputFile;
  if ('files' in x) {
    if (x.files.length > 0) {
      _clearAll();
      var file = x.files[0];
      if (file) {
        if(file.size >= MAX_FILE_SIZE) {
          alert("File size too large for QRStream: " + file.size + "\n" + "Keep it smaller than " + MAX_FILE_SIZE);
          return;
        }
        let filename = file.name;
        inputFileLabel.innerText = filename;
      }
    }
  } else {
    if (x.value == "") {
      alert("Select one or more files.");
    } else {
      var txt = "The files property is not supported by your browser!";
      txt  += "<br>The path of the selected file: " + x.value; // If the browser does not support the files property, it will return the path of the selected file instead.
      alert(txt);
    }
  }
});

generateButton.addEventListener("click", function() {
  var x = inputFile;
  if ('files' in x) {
    if (x.files.length > 0) {
      _clearAll();
      var file = x.files[0];
      if (file) {
        let filename = file.name;
        inputFileLabel.innerText = filename;
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function (evt) {
          let content = evt.target.result;
          var qr = qrstream(500, 640);
          qr.load("FILE", content, filename);
          let {meta, images} = qr.encode();
          metaImage = meta;
          payloadImages = images;
          metaImageElement.src = meta;
          if (payloadImages && payloadImages.length >= 1) {
            missingFrame.placeholder = "[1, " + payloadImages.length + "]";
          }

          let total = images.length;
          let index = 0;
          intervalId = setInterval(function(){
            streamImageElement.src = images[index];
            index++;
            index = index % total;
          }, 1000);
        }
        reader.onerror = function (evt) {
          alert("文件读取错误,请重试!");
        }
      }
    }
  } else {
    if (x.value == "") {
      alert("Select one or more files.");
    } else {
      var txt = "The files property is not supported by your browser!";
      txt  += "<br>The path of the selected file: " + x.value; // If the browser does not support the files property, it will return the path of the selected file instead.
      alert(txt);
    }
  }
});
clearButton.addEventListener("click", function() {
  _clearAll();
});
missingFrame.addEventListener("keyup", function (e) {
  if (e.keyCode == 13) {
    findMissingButton.click();
  }
});
findMissingButton.addEventListener("click", function() {
  if (payloadImages.length <= 0) {
    alert("Frame not generated yet!");
  } else {
    let id = missingFrame.value - 1;
    if (id >= payloadImages.length || id < 0) {
      alert("Frame ID exceeds the range [1, " + payloadImages.length + "]!");
    } else {
      missingImageElement.src = payloadImages[id];
    }
  }
});
