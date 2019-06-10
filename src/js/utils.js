// Import
var form = document.createElement("form");
document.body.appendChild(form);

var fileInput = document.createElement("input");
fileInput.type = "file";

fileInput.addEventListener("change", function (event) {

  importLoader.loadFiles(fileInput.files);
  form.reset();

});

form.appendChild(fileInput);

// Export
var link = document.createElement("a");
link.style.display = "none";
document.body.appendChild(link);

function save(blob, filename) {

  link.href = URL.createObjectURL(blob);
  link.download = filename || "data.json";
  link.click();

}

function saveArrayBuffer(buffer, filename) {

  save(new Blob([buffer], { type: "application/octet-stream" }), filename);

}

function saveString(text, filename) {

  save(new Blob([text], { type: "text/plain" }), filename);

}

// ImportLoader
var ImportLoader = function () {

  var self = this;

  self.object = null;

  self.loadFiles = function (files) {

    if (files.length > 0) { for (var i = 0; i < files.length; i++) { self.loadFile(files[i]); } }

  };

  self.loadFile = function (file) {

    var filename = file.name;
    var extension = filename.split(".").pop().toLowerCase();

    var reader = new FileReader();

    switch (extension) {

      case "json": loadJsonHandler(file); break;

      default: break;

    }

  };

  function loadJsonHandler(file) {

    var filename = file.name;

    reader.addEventListener("load", function (event) {

      var data, contents = event.target.result;

      try { data = JSON.parse(contents); } catch (error) { return; }

      saveArrayBuffer(drcobjExporter.parse(data, { quantization: [20, 16, 16, 16, 16] }), filename.split(".").shift() + ".drcobj");

    }, false);

    reader.readAsText(file);

  }

};

