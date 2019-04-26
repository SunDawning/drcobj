/**
 * @author Blinking / https://blinking.fun/
 * 
 * MIT License
 * 
 * Copyright (c) 2019 Blinking
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 */

'use strict';

THREE.DrcobjExporter = function () { };

THREE.DrcobjExporter.prototype = {

  constructor: THREE.DrcobjExporter,

  parse: function (object, options) {

    var outputDataBuffer;

    var stringToByteArray = function (str) {

      var buffer = new ArrayBuffer(str.length);
      var bufferView = new Uint8Array(buffer);

      for (let i = 0, strLen = str.length; i < strLen; i++) { bufferView[i] = str.charCodeAt(i); }

      return buffer;

    };

    // parse

    var jsonData = object.toJSON();

    // Reduce geometries accuracy
    // Omit unnecessary decimal places

    // jsonData = this.reduceGeometriesAccuracy(jsonData);

    // Convert all geometry to draco geometry buffer

    var drcGeometries = this.drcParse(jsonData, options);

    // Save all converted draco geometry buffer byte lengths to the model data and calculate the sum

    var sumGeometryBuffersByteLength = 0;

    for (let i = 0; i < jsonData.geometries.length; i++) {

      var geometryBufferByteLength = drcGeometries[i].byteLength;

      jsonData.geometries[i].data = { offset: sumGeometryBuffersByteLength, byteLength: geometryBufferByteLength };

      sumGeometryBuffersByteLength += geometryBufferByteLength;

    }

    // Convert model json data to byte array

    var jsonDataBuffer = stringToByteArray(JSON.stringify(jsonData));

    // Create an output data buffer and write data

    outputDataBuffer = new ArrayBuffer(4 + jsonDataBuffer.byteLength + sumGeometryBuffersByteLength);

    var modelDataSize = new Uint32Array(outputDataBuffer, 0, 1);
    var modelData = new Uint8Array(outputDataBuffer, 4, jsonDataBuffer.byteLength);
    var modelGeometries = new Int8Array(outputDataBuffer, 4 + jsonDataBuffer.byteLength, sumGeometryBuffersByteLength);

    modelDataSize[0] = jsonDataBuffer.byteLength;

    modelData.set(new Uint8Array(jsonDataBuffer));

    for (let i = 0, offset = 0; i < drcGeometries.length; i++) {

      modelGeometries.set(drcGeometries[i], offset);

      offset += drcGeometries[i].byteLength;

    }

    // Output data buffer

    return outputDataBuffer;

  },

  drcParse: function (jsonData, options) {

    var drcGeometries = [];

    var dracoExporter = new THREE.DRACOExporter();
    var bufferGeometryLoader = new THREE.BufferGeometryLoader();

    var options = {};

    if (options.decodeSpeed === undefined) { options.decodeSpeed = 5; }
    if (options.encodeSpeed === undefined) { options.encodeSpeed = 5; }
    if (options.encoderMethod === undefined) { options.encoderMethod = THREE.DRACOExporter.MESH_EDGEBREAKER_ENCODING; }
    if (options.quantization === undefined) { options.quantization = [16, 8, 8, 8, 8]; }
    if (options.exportUvs === undefined) { options.exportUvs = true; }
    if (options.exportNormals === undefined) { options.exportNormals = true; }
    if (options.exportColor === undefined) { options.exportColor = false; }

    for (let i = 0; i < jsonData.geometries.length; i++) {

      var geometry = bufferGeometryLoader.parse(jsonData.geometries[i]);

      var drcGeometry = dracoExporter.parse(geometry, options);

      drcGeometries.push(drcGeometry);

    }

    return drcGeometries;

  }

};
