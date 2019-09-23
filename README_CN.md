# Draco 3D Object

![releases](https://img.shields.io/badge/releases-0.9.5.1--PRE-blue.svg?style=flat-square)
![license](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)

### [English](https://github.com/Ouyang-Zhaoxing/drcobj/blob/master/README.md)

Draco是一个用于压缩和解压缩3D几何网格和点云的开源库。它旨在改善3D图形的存储和传输。

你可以使用 **drcobj_exporter.js** 将 threejs-object (.json) 文件转换为 draco 压缩的 threejs-object (.drcobj) 文件， **drcobj_loader.js** 是 drcobj 文件的加载器。

## 如何使用

### drcobj_loader:

```html
<script src="https://cdn.jsdelivr.net/gh/mrdoob/three.js@r106/build/three.min.js"></script>

<script src="https://cdn.jsdelivr.net/gh/Ouyang-Zhaoxing/drcobj@v0.9.5.1-pre/src/vendor/draco_decoder.js"></script>
<script src="https://cdn.jsdelivr.net/gh/Ouyang-Zhaoxing/drcobj@v0.9.5.1-pre/src/vendor/draco_loader.js"></script>
<script src="https://cdn.jsdelivr.net/gh/Ouyang-Zhaoxing/drcobj@v0.9.5.1-pre/src/js/drcobj_loader.js"></script>

<script>

var drcobjLoader = new THREE.DrcobjLoader();

drcobjLoader.load("test.drcobj", function (object) {

    scene.add(object);

    drcobjLoader.dispose(); // 不再需要加载器时释放

});

</script>
```

### [在线文件转换 ( 支持 JSON / FBX )](https://blinking.fun/drcobj/)
