# Draco 3D Object

Draco is an open-source library for compressing and decompressing 3D geometric meshes and point clouds. It is intended to improve the storage and transmission of 3D graphics.

You can use **drcobj_exporter.js** to convert a threejs-object (.json) file to a draco-compressed threejs-object (.drcobj) file, **drcobj_loader.js** is the loader for the drcobj file.

## How to use

```javascript
var drcobjLoader = new THREE.DrcobjLoader();

drcobjLoader.load("test.drcobj", function (object) {

    screen.add(object);

});

```