# ![logo](https://cdn.jsdelivr.net/gh/Ouyang-Zhaoxing/drcobj@master/logo.png) Draco 3D Object

![releases](https://img.shields.io/badge/releases-1.0.3.2-blue.svg?style=flat-square)
![license](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)

### [简体中文](https://github.com/Ouyang-Zhaoxing/drcobj/blob/master/README_CN.md)

Draco is an open-source library for compressing and decompressing 3D geometric meshes and point clouds. It is intended to improve the storage and transmission of 3D graphics.

You can use **drcobj_exporter.js** to convert a threejs-object (.json) file to a draco-compressed threejs-object (.drcobj) file, **drcobj_loader.js** is the loader for the drcobj file.

## How to use

### drcobj_loader:

```html
<script src="./three.min.js"></script>

<script src="./src/vendor/draco_decoder.js"></script>
<script src="./src/vendor/draco_loader.js"></script>
<script src="./src/js/drcobj_loader.js"></script>

<script>

var drcobjLoader = new THREE.DrcobjLoader();

drcobjLoader.setDecoderPath("./src/vendor/");

drcobjLoader.load("model.drcobj", function (object) {

    scene.add(object);

    drcobjLoader.dispose();

});

</script>
```