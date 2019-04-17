# jpeg-compressor

<a href="https://www.npmjs.com/package/jpeg-compressor"><img src="https://img.shields.io/npm/v/jpeg-compressor.svg?style=flat-square" alt="npm"></a>
<a href="https://coveralls.io/github/upupming/jpeg-compressor?branch=master"><img src="https://img.shields.io/coveralls/github/upupming/jpeg-compressor.svg?style=flat-square" alt="Coveralls"></a>
<a href="https://travis-ci.com/upupming/jpeg-compressor/builds"><img src="https://img.shields.io/travis/com/upupming/jpeg-compressor.svg?style=popout-square" alt="travis build status"></a>
<a href="https://github.com/upupming/jpeg-compressor/blob/master/LICENSE"><img src="https://img.shields.io/github/license/mashape/apistatus.svg?style=popout-square" alt="License"></a>

This is a implementation of jpeg compressor.

## Installation

```bash
npm install jpeg-compressor
```

## Usage

```js
const JpegEncoder = require('../dist/index')
const encoder = new JpegEncoder();
encoder.readFromBMP('/xxx/xxx.bmp');
encoder.encodeToJPG('/xxx/xxx.jpg', 50);
```

## Performance

| Original bmp    | Compressed jpg | Compression ratio | Time used|
| --------------- | -------------- | ----------------- |----|
| 1,440,054 bytes | 68,888 bytes   | 0.047,8           |3,843ms|

This project is for education only, and it's my lab homework at Harbin Institute of Technology, if you would like to use it in your project, please fork and try to improve its performance as you like.
