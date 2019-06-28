# Draco 3D Object

Draco is an open-source library for compressing and decompressing 3D geometric meshes and point clouds. It is intended to improve the storage and transmission of 3D graphics.

You can use **drcobj_exporter.js** to convert a threejs-object (.json) file to a draco-compressed threejs-object (.drcobj) file, **drcobj_loader.js** is the loader for the drcobj file.

## How to use

### drcobj_loader:

```html
<script src="https://cdn.jsdelivr.net/gh/Ouyang-Zhaoxing/drcobj@v0.9.3-pre/src/vendor/draco_decoder.js"></script>
<script src="https://cdn.jsdelivr.net/gh/Ouyang-Zhaoxing/drcobj@v0.9.3-pre/src/vendor/drace_loader.js"></script>
<script src="https://cdn.jsdelivr.net/gh/Ouyang-Zhaoxing/drcobj@v0.9.3-pre/src/js/drcobj_loader.js"></script>

<script>

var drcobjLoader = new THREE.DrcobjLoader();

drcobjLoader.load("test.drcobj", function (object) {

    screen.add(object);

});

</script>
```

### [online file conversion ( fbx / json to drcobj )](https://blinking.fun/drcobj/)
