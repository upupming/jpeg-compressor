import 'should';
// const JpegEncoder = require('../dist/index')
import JpegEncoder = require('../src/index')
import { resolve } from 'path';

describe('compressor', function() {
  it('should compress bmp to jpeg', function() {
    const encoder = new JpegEncoder();
    encoder.readFromBMP(resolve(__dirname, 'bmp/field.bmp'));
    encoder.encodeToJPG(resolve(__dirname, 'jpeg/field.jpg'), 50);
  });
});
