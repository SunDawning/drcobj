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

    if (files.length > 0) {

      var filesMap = createFileMap(files);

      var manager = new THREE.LoadingManager();

      manager.setURLModifier(function (url) {

        var file = filesMap[url];

        if (file) {

          return URL.createObjectURL(file);

        }

        return url;

      });

      for (var i = 0; i < files.length; i++) {

        self.loadFile(files[i], manager);

      }

    }

  };

  self.loadFile = function (file, manager) {

    var filename = file.name;
    var extension = filename.split(".").pop().toLowerCase();

    var reader = new FileReader();

    switch (extension) {

      case "json":

        reader.addEventListener("load", function (event) {

          var data, contents = event.target.result;

          try {

            data = JSON.parse(contents);

          } catch (error) { return; }

          objectLoader.parse(data, function (object) {

            saveArrayBuffer(drcobjExporter.parse(object, { quantization: [20, 16, 16, 16, 16] }), filename.split(".").shift() + ".drcobj");

          });

        }, false);

        reader.readAsText(file);

        break;

      default: break;

    }

  };

  function createFileMap(files) {

    var map = {};

    for (var i = 0; i < files.length; i++) {

      var file = files[i];
      map[file.name] = file;

    }

    return map;

  }

};
