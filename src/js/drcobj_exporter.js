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

  parse: function (object) {

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

    jsonData = this.reduceGeometriesAccuracy(jsonData);

    // Convert all geometry to draco geometry buffer

    var drcGeometries = this.drcParse(jsonData);

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

  reduceGeometriesAccuracy: function (jsonData, accuracyLevel = 2) {

    for (let i = 0; i < jsonData.geometries.length; i++) {

      var attributes = jsonData.geometries[i].data.attributes;

      var vertices = attributes.position.array;
      var normals = attributes.normal.array;
      var uvs = attributes.uv.array;

      if (vertices !== undefined) {
        for (let j = 0; j < vertices.length; j++) { vertices[j] = vertices[j].toFixed(accuracyLevel); }
      }

      if (normals !== undefined) {
        for (let j = 0; j < normals.length; j++) { normals[j] = normals[j].toFixed(accuracyLevel); }
      }

      if (uvs !== undefined) {
        for (let j = 0; j < uvs.length; j++) { uvs[j] = uvs[j].toFixed(accuracyLevel); }
      }

    }

    return jsonData;

  },

  drcParse: function (jsonData) {

    var drcGeometries = [];

    var dracoExporter = new THREE.DRACOExporter();
    var bufferGeometryLoader = new THREE.BufferGeometryLoader();

    for (let i = 0; i < jsonData.geometries.length; i++) {

      var geometry = bufferGeometryLoader.parse(jsonData.geometries[i]);

      var drcGeometry = dracoExporter.parse(geometry);

      drcGeometries.push(drcGeometry);

    }

    return drcGeometries;

  }

};
