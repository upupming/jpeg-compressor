import { openSync, readFileSync, writeSync, closeSync } from 'fs'
import * as bmp from 'bmp-js'

export class JpegEncoder {
  _bmpData;

  m_YTable = new Array(64).fill(0);
  m_CbCrTable = new Array(64).fill(0);

  Luminance_Quantization_Table = [
    16,
    11,
    10,
    16,
    24,
    40,
    51,
    61,
    12,
    12,
    14,
    19,
    26,
    58,
    60,
    55,
    14,
    13,
    16,
    24,
    40,
    57,
    69,
    56,
    14,
    17,
    22,
    29,
    51,
    87,
    80,
    62,
    18,
    22,
    37,
    56,
    68,
    109,
    103,
    77,
    24,
    35,
    55,
    64,
    81,
    104,
    113,
    92,
    49,
    64,
    78,
    87,
    103,
    121,
    120,
    101,
    72,
    92,
    95,
    98,
    112,
    100,
    103,
    99
  ];
  Chrominance_Quantization_Table = [
    17,
    18,
    24,
    47,
    99,
    99,
    99,
    99,
    18,
    21,
    26,
    66,
    99,
    99,
    99,
    99,
    24,
    26,
    56,
    99,
    99,
    99,
    99,
    99,
    47,
    66,
    99,
    99,
    99,
    99,
    99,
    99,
    99,
    99,
    99,
    99,
    99,
    99,
    99,
    99,
    99,
    99,
    99,
    99,
    99,
    99,
    99,
    99,
    99,
    99,
    99,
    99,
    99,
    99,
    99,
    99,
    99,
    99,
    99,
    99,
    99,
    99,
    99,
    99
  ];
  ZigZag = [
    0,
    1,
    5,
    6,
    14,
    15,
    27,
    28,
    2,
    4,
    7,
    13,
    16,
    26,
    29,
    42,
    3,
    8,
    12,
    17,
    25,
    30,
    41,
    43,
    9,
    11,
    18,
    24,
    31,
    40,
    44,
    53,
    10,
    19,
    23,
    32,
    39,
    45,
    52,
    54,
    20,
    22,
    33,
    38,
    46,
    51,
    55,
    60,
    21,
    34,
    37,
    47,
    50,
    56,
    59,
    61,
    35,
    36,
    48,
    49,
    57,
    58,
    62,
    63
  ];

  _YDCHuffmanTable;
  _YACHuffmanTable;
  _CbCrDCHuffmanTable;
  _CbCrACHuffmanTable;

  _emptyHuffmanTables () {
    this._YDCHuffmanTable = this._getEmptyTable(12)
    this._YACHuffmanTable = this._getEmptyTable(256)
    this._CbCrDCHuffmanTable = this._getEmptyTable(12)
    this._CbCrACHuffmanTable = this._getEmptyTable(256)
  }
  _getEmptyTable (size: number) {
    return Array.from(Array(size), function () {
      return {
        length: 0,
        value: 0
      }
    })
  }

  //

  Standard_DC_Luminance_NRCodes = [
    0,
    0,
    7,
    1,
    1,
    1,
    1,
    1,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0
  ];
  Standard_DC_Luminance_Values = [4, 5, 3, 2, 6, 1, 0, 7, 8, 9, 10, 11];
  Standard_DC_Chrominance_NRCodes = [
    0,
    3,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    0,
    0,
    0,
    0,
    0
  ];
  Standard_DC_Chrominance_Values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  //

  Standard_AC_Luminance_NRCodes = [
    0,
    2,
    1,
    3,
    3,
    2,
    4,
    3,
    5,
    5,
    4,
    4,
    0,
    0,
    1,
    0x7d
  ];
  Standard_AC_Luminance_Values = [
    0x01,
    0x02,
    0x03,
    0x00,
    0x04,
    0x11,
    0x05,
    0x12,
    0x21,
    0x31,
    0x41,
    0x06,
    0x13,
    0x51,
    0x61,
    0x07,
    0x22,
    0x71,
    0x14,
    0x32,
    0x81,
    0x91,
    0xa1,
    0x08,
    0x23,
    0x42,
    0xb1,
    0xc1,
    0x15,
    0x52,
    0xd1,
    0xf0,
    0x24,
    0x33,
    0x62,
    0x72,
    0x82,
    0x09,
    0x0a,
    0x16,
    0x17,
    0x18,
    0x19,
    0x1a,
    0x25,
    0x26,
    0x27,
    0x28,
    0x29,
    0x2a,
    0x34,
    0x35,
    0x36,
    0x37,
    0x38,
    0x39,
    0x3a,
    0x43,
    0x44,
    0x45,
    0x46,
    0x47,
    0x48,
    0x49,
    0x4a,
    0x53,
    0x54,
    0x55,
    0x56,
    0x57,
    0x58,
    0x59,
    0x5a,
    0x63,
    0x64,
    0x65,
    0x66,
    0x67,
    0x68,
    0x69,
    0x6a,
    0x73,
    0x74,
    0x75,
    0x76,
    0x77,
    0x78,
    0x79,
    0x7a,
    0x83,
    0x84,
    0x85,
    0x86,
    0x87,
    0x88,
    0x89,
    0x8a,
    0x92,
    0x93,
    0x94,
    0x95,
    0x96,
    0x97,
    0x98,
    0x99,
    0x9a,
    0xa2,
    0xa3,
    0xa4,
    0xa5,
    0xa6,
    0xa7,
    0xa8,
    0xa9,
    0xaa,
    0xb2,
    0xb3,
    0xb4,
    0xb5,
    0xb6,
    0xb7,
    0xb8,
    0xb9,
    0xba,
    0xc2,
    0xc3,
    0xc4,
    0xc5,
    0xc6,
    0xc7,
    0xc8,
    0xc9,
    0xca,
    0xd2,
    0xd3,
    0xd4,
    0xd5,
    0xd6,
    0xd7,
    0xd8,
    0xd9,
    0xda,
    0xe1,
    0xe2,
    0xe3,
    0xe4,
    0xe5,
    0xe6,
    0xe7,
    0xe8,
    0xe9,
    0xea,
    0xf1,
    0xf2,
    0xf3,
    0xf4,
    0xf5,
    0xf6,
    0xf7,
    0xf8,
    0xf9,
    0xfa
  ];
  Standard_AC_Chrominance_NRCodes = [
    0,
    2,
    1,
    2,
    4,
    4,
    3,
    4,
    7,
    5,
    4,
    4,
    0,
    1,
    2,
    0x77
  ];
  Standard_AC_Chrominance_Values = [
    0x00,
    0x01,
    0x02,
    0x03,
    0x11,
    0x04,
    0x05,
    0x21,
    0x31,
    0x06,
    0x12,
    0x41,
    0x51,
    0x07,
    0x61,
    0x71,
    0x13,
    0x22,
    0x32,
    0x81,
    0x08,
    0x14,
    0x42,
    0x91,
    0xa1,
    0xb1,
    0xc1,
    0x09,
    0x23,
    0x33,
    0x52,
    0xf0,
    0x15,
    0x62,
    0x72,
    0xd1,
    0x0a,
    0x16,
    0x24,
    0x34,
    0xe1,
    0x25,
    0xf1,
    0x17,
    0x18,
    0x19,
    0x1a,
    0x26,
    0x27,
    0x28,
    0x29,
    0x2a,
    0x35,
    0x36,
    0x37,
    0x38,
    0x39,
    0x3a,
    0x43,
    0x44,
    0x45,
    0x46,
    0x47,
    0x48,
    0x49,
    0x4a,
    0x53,
    0x54,
    0x55,
    0x56,
    0x57,
    0x58,
    0x59,
    0x5a,
    0x63,
    0x64,
    0x65,
    0x66,
    0x67,
    0x68,
    0x69,
    0x6a,
    0x73,
    0x74,
    0x75,
    0x76,
    0x77,
    0x78,
    0x79,
    0x7a,
    0x82,
    0x83,
    0x84,
    0x85,
    0x86,
    0x87,
    0x88,
    0x89,
    0x8a,
    0x92,
    0x93,
    0x94,
    0x95,
    0x96,
    0x97,
    0x98,
    0x99,
    0x9a,
    0xa2,
    0xa3,
    0xa4,
    0xa5,
    0xa6,
    0xa7,
    0xa8,
    0xa9,
    0xaa,
    0xb2,
    0xb3,
    0xb4,
    0xb5,
    0xb6,
    0xb7,
    0xb8,
    0xb9,
    0xba,
    0xc2,
    0xc3,
    0xc4,
    0xc5,
    0xc6,
    0xc7,
    0xc8,
    0xc9,
    0xca,
    0xd2,
    0xd3,
    0xd4,
    0xd5,
    0xd6,
    0xd7,
    0xd8,
    0xd9,
    0xda,
    0xe2,
    0xe3,
    0xe4,
    0xe5,
    0xe6,
    0xe7,
    0xe8,
    0xe9,
    0xea,
    0xf2,
    0xf3,
    0xf4,
    0xf5,
    0xf6,
    0xf7,
    0xf8,
    0xf9,
    0xfa
  ];

  constructor () {
    this._initHuffmanTables()
  }

  /**
   * 初始化 Huffman 表
   */
  _initHuffmanTables () {
    this._emptyHuffmanTables()

    this._computeHuffmanTable(
      this.Standard_DC_Luminance_NRCodes,
      this.Standard_DC_Luminance_Values,
      this._YDCHuffmanTable
    )
    this._computeHuffmanTable(
      this.Standard_AC_Luminance_NRCodes,
      this.Standard_AC_Luminance_Values,
      this._YACHuffmanTable
    )
    this._computeHuffmanTable(
      this.Standard_DC_Chrominance_NRCodes,
      this.Standard_DC_Chrominance_Values,
      this._CbCrDCHuffmanTable
    )
    this._computeHuffmanTable(
      this.Standard_AC_Chrominance_NRCodes,
      this.Standard_AC_Chrominance_Values,
      this._CbCrACHuffmanTable
    )
  }
  /**
   * 计算哈夫曼表
   * @param nrCodes
   * @param stdTable
   * @param huffmanTable
   */
  _computeHuffmanTable (
    nrCodes: number[],
    stdTable: number[],
    huffmanTable: BitString[]
  ) {
    let posInTable = 0
    let codeValue = 0

    for (let k = 1; k <= 16; k++) {
      for (let j = 1; j <= nrCodes[k - 1]; j++) {
        // console.log(`stdTable[posInTable] = ${stdTable[posInTable]}`)
        // console.log(`before, huffmanTable[stdTable[posInTable]] = ${JSON.stringify(huffmanTable[stdTable[posInTable]])}`)
        huffmanTable[stdTable[posInTable]].value = codeValue
        huffmanTable[stdTable[posInTable]].length = k
        posInTable++
        codeValue++
        // console.log(`after, huffmanTable[stdTable[posInTable]] = ${JSON.stringify(huffmanTable[stdTable[posInTable]])}`)
      }
      codeValue <<= 1
    }
    // console.log(huffmanTable)
  }

  readFromBMP (filePath: string): boolean {
    let succeed = false

    /**
     * 读取数据这部分不是我们要操心的
     * 直接使用库函数完成
     */
    this._bmpData = bmp.decode(readFileSync(filePath))
    // console.log(this._bmpData);

    return succeed
  }

  _initQualityTables (qualityScale: number) {
    if (qualityScale <= 0) {
      qualityScale = 1
    }
    if (qualityScale >= 100) {
      qualityScale = 99
    }

    for (let i = 0; i < 64; i++) {
      let temp = Math.floor(
        (this.Luminance_Quantization_Table[i] * qualityScale + 50) / 100
      )
      if (temp <= 0) {
        temp = 1
      }
      if (temp > 0xff) {
        temp = 0xff
      }
      this.m_YTable[this.ZigZag[i]] = temp

      temp = Math.floor(
        (this.Chrominance_Quantization_Table[i] * qualityScale + 50) / 100
      )
      if (temp <= 0) {
        temp = 1
      }
      if (temp > 0xff) {
        temp = 0xff
      }
      this.m_CbCrTable[this.ZigZag[i]] = temp
    }
  }

  _convertColorSpace (
    xPos: number,
    yPos: number,
    yData: number[],
    cbData: number[],
    crData: number[]
  ) {
    for (let y = 0; y < 8; y++) {
      let index = (y + yPos) * this._bmpData.width * 4 + xPos * 4
      for (let x = 0; x < 8; x++) {
        index++
        let B = this._bmpData.data[index++]
        let G = this._bmpData.data[index++]
        let R = this._bmpData.data[index++]
        // console.log(`G = ${G}`)
        yData[y * 8 + x] = (Math.floor(0.299 * R + 0.587 * G + 0.114 * B - 128))
        cbData[y * 8 + x] = (Math.floor(-0.1687 * R - 0.3313 * G + 0.5 * B))
        // console.log(`cbData[y * 8 + x] = ${cbData[y * 8 + x]}`)
        crData[y * 8 + x] = (Math.floor(0.5 * R - 0.4187 * G - 0.0813 * B))
      }
    }
  }

  _forward_FDC (channel_data: number[], fdc_data: number[]) {
    for (let v = 0; v < 8; v++) {
      for (let u = 0; u < 8; u++) {
        let alpha_u = u == 0 ? 1 / Math.sqrt(8.0) : 0.5
        let alpha_v = v == 0 ? 1 / Math.sqrt(8.0) : 0.5

        let temp = 0.0
        for (let x = 0; x < 8; x++) {
          for (let y = 0; y < 8; y++) {
            let data = channel_data[y * 8 + x]

            data *= Math.cos(((2 * x + 1) * u * Math.PI) / 16.0)
            data *= Math.cos(((2 * y + 1) * v * Math.PI) / 16.0)

            temp += data
          }
        }

        temp *= (alpha_u * alpha_v) / this.m_YTable[this.ZigZag[v * 8 + u]]
        fdc_data[this.ZigZag[v * 8 + u]] = Math.floor(
          Math.floor(temp + 16384.5) - 16384
        )
      }
    }
  }

  _getBitCode (value: number): BitString {
    let ret = {
      value: 0,
      length: 0
    }
    let v = value > 0 ? value : -value

    // bit 的长度
    let length = 0
    for (length = 0; v; v >>= 1) length++

    ret.value = value > 0 ? value : (1 << length) + value - 1
    ret.length = length

    return ret
  }

  _doHuffmanEncoding (
    DU: number[],
    HTDC: BitString[],
    HTAC: BitString[],
    outputBitString: BitString[],
    prevCounts: PrevCounts
  ) {
    // console.log(`prevCounts.prevDC = ${prevCounts.prevDC}`)
    let EOB = HTAC[0x00]
    let SIXTEEN_ZEROS = HTAC[0xf0]

    let index = 0

    // encode DC
    let dcDiff = Math.floor(DU[0] - prevCounts.prevDC)
    prevCounts.prevDC = DU[0]

    // console.log(`prevCounts.prevDC = ${prevCounts.prevDC}`)
    // console.log(`dcDiff = ${dcDiff}`)
    if (dcDiff == 0) outputBitString[index++] = HTDC[0]
    else {
      let bs = this._getBitCode(dcDiff)

      outputBitString[index++] = HTDC[bs.length]
      outputBitString[index++] = bs
    }

    // encode ACs
    let endPos = 63 // end0pos = first element in reverse order != 0
    while (endPos > 0 && DU[endPos] == 0) endPos--

    // console.log(`endPos = ${endPos}`);
    for (let i = 1; i <= endPos;) {
      let startPos = i
      while (DU[i] == 0 && i <= endPos) i++

      let zeroCounts = i - startPos
      if (zeroCounts >= 16) {
        for (let j = 1; j <= zeroCounts / 16; j++) { outputBitString[index++] = SIXTEEN_ZEROS }
        zeroCounts = zeroCounts % 16
      }

      let bs = this._getBitCode(DU[i])
      // console.log(`bs = ${bs.value}, ${bs.length}`);

      outputBitString[index++] = HTAC[(zeroCounts << 4) | bs.length]
      // console.log(`outputBitString = ${outputBitString[index-1].value}, ${outputBitString[index-1].length}`)
      outputBitString[index++] = bs
      // console.log(`outputBitString = ${outputBitString[index-1].value}, ${outputBitString[index-1].length}`)
      i++
    }

    if (endPos != 63) outputBitString[index++] = EOB

    prevCounts.bitStringCounts = index
    // console.log(`prevCounts.bitStringCounts = ${prevCounts.bitStringCounts}`)
  }

  _write_byte (value: number, fd: number) {
    writeSync(fd, Buffer.from([value]))
  }

  _write (values: number[], fd: number) {
    writeSync(fd, Buffer.from(values))
  }

  _write_bitstring_ (bs: BitString[], counts, bytePos: BytePos, fd: number) {
    let mask = [
      1,
      2,
      4,
      8,
      16,
      32,
      64,
      128,
      256,
      512,
      1024,
      2048,
      4096,
      8192,
      16384,
      32768
    ]

    for (let i = 0; i < counts; i++) {
      let value = bs[i].value
      let posval = bs[i].length - 1

      while (posval >= 0) {
        if ((value & mask[posval]) != 0) {
          bytePos.newByte = bytePos.newByte | mask[bytePos.newBytePos]
        }
        posval--
        bytePos.newBytePos--
        if (bytePos.newBytePos < 0) {
          // Write to stream
          this._write_byte(bytePos.newByte, fd)
          if (bytePos.newByte == 0xff) {
            // Handle special case
            this._write_byte(0x00, fd)
          }

          // Reinitialize
          bytePos.newBytePos = 7
          bytePos.newByte = 0
        }
      }
    }
  }
  _write_word (value: number, fd) {
    writeSync(fd, Buffer.from([(value >> 8) & 0xff, value & 0xff]))
  }

  _write_jpeg_header (fp: number) {
    // SOI
    this._write_word(0xffd8, fp) // marker = 0xFFD8

    // APPO
    this._write_word(0xffe0, fp) // marker = 0xFFE0
    this._write_word(16, fp) // length = 16 for usual JPEG, no thumbnail
    writeSync(fp, 'JFIF\0')
    this._write_byte(1, fp) // version_hi
    this._write_byte(1, fp) // version_low
    this._write_byte(0, fp) // xyunits = 0 no units, normal density
    this._write_word(1, fp) // xdensity
    this._write_word(1, fp) // ydensity
    this._write_byte(0, fp) // thumbWidth
    this._write_byte(0, fp) // thumbHeight

    // DQT
    this._write_word(0xffdb, fp) // marker = 0xFFDB
    this._write_word(132, fp) // size=132
    this._write_byte(0, fp) // QTYinfo== 0:  bit 0..3: number of QT = 0 (table for Y)
    //				bit 4..7: precision of QT
    //				bit 8	: 0
    // writeSync(fp, Buffer.from(this.m_YTable));
    for (let value of this.m_YTable) {
      this._write_byte(value, fp)
    }
    this._write_byte(1, fp) // QTCbinfo = 1 (quantization table for Cb,Cr)
    // writeSync(fp, Buffer.from(this.m_CbCrTable));
    for (let value of this.m_CbCrTable) {
      this._write_byte(value, fp)
    }

    // SOFO
    this._write_word(0xffc0, fp) // marker = 0xFFC0
    this._write_word(17, fp) // length = 17 for a truecolor YCbCr JPG
    this._write_byte(8, fp) // precision = 8: 8 bits/sample
    this._write_word(this._bmpData.height & 0xffff, fp) // height
    this._write_word(this._bmpData.width & 0xffff, fp) // width
    this._write_byte(3, fp) // nrofcomponents = 3: We encode a truecolor JPG

    this._write_byte(1, fp) // IdY = 1
    this._write_byte(0x11, fp) // HVY sampling factors for Y (bit 0-3 vert., 4-7 hor.)(SubSamp 1x1)
    this._write_byte(0, fp) // QTY  Quantization Table number for Y = 0

    this._write_byte(2, fp) // IdCb = 2
    this._write_byte(0x11, fp) // HVCb = 0x11(SubSamp 1x1)
    this._write_byte(1, fp) // QTCb = 1

    this._write_byte(3, fp) // IdCr = 3
    this._write_byte(0x11, fp) // HVCr = 0x11 (SubSamp 1x1)
    this._write_byte(1, fp) // QTCr Normally equal to QTCb = 1

    // DHT
    this._write_word(0xffc4, fp) // marker = 0xFFC4
    this._write_word(0x01a2, fp) // length = 0x01A2
    this._write_byte(0, fp) // HTYDCinfo bit 0..3	: number of HT (0..3), for Y =0
    //			bit 4		: type of HT, 0 = DC table,1 = AC table
    //			bit 5..7	: not used, must be 0
    this._write(this.Standard_DC_Luminance_NRCodes, fp) // DC_L_NRC
    this._write(this.Standard_DC_Luminance_Values, fp) // DC_L_VALUE
    this._write_byte(0x10, fp) // HTYACinfo
    this._write(this.Standard_AC_Luminance_NRCodes, fp)
    this._write(this.Standard_AC_Luminance_Values, fp) // we'll use the standard Huffman tables
    this._write_byte(0x01, fp) // HTCbDCinfo
    this._write(this.Standard_DC_Chrominance_NRCodes, fp)
    this._write(this.Standard_DC_Chrominance_Values, fp)
    this._write_byte(0x11, fp) // HTCbACinfo
    this._write(this.Standard_AC_Chrominance_NRCodes, fp)
    this._write(this.Standard_AC_Chrominance_Values, fp)

    // SOS
    this._write_word(0xffda, fp) // marker = 0xFFC4
    this._write_word(12, fp) // length = 12
    this._write_byte(3, fp) // nrofcomponents, Should be 3: truecolor JPG

    this._write_byte(1, fp) // Idy=1
    this._write_byte(0, fp) // HTY	bits 0..3: AC table (0..3)
    //		bits 4..7: DC table (0..3)
    this._write_byte(2, fp) // IdCb
    this._write_byte(0x11, fp) // HTCb

    this._write_byte(3, fp) // IdCr
    this._write_byte(0x11, fp) // HTCr

    this._write_byte(0, fp) // Ss not interesting, they should be 0,63,0
    this._write_byte(0x3f, fp) // Se
    this._write_byte(0, fp) // Bf
  }

  encodeToJPG (filePath: string, qualityScale: number) {
    let fd = openSync(filePath, 'w')

    if (!this._bmpData) {
      throw new Error('Please read from bmp first')
    }

    // 初始化量化表
    this._initQualityTables(qualityScale)

    // 文件头
    this._write_jpeg_header(fd)

    let prev_DC_Y = {
      prevDC: 0,
      bitStringCounts: 0
    }

    let prev_DC_Cb = {
      prevDC: 0,
      bitStringCounts: 0
    }

    let prev_DC_Cr = {
      prevDC: 0,
      bitStringCounts: 0
    }
    let bytePos = {
      newByte: 0,
      newBytePos: 7
    }

    for (let yPos = 0; yPos < this._bmpData.height; yPos += 8) {
      for (let xPos = 0; xPos < this._bmpData.width; xPos += 8) {
        let yData = new Array(64).fill(0)

        let cbData = new Array(64).fill(0)

        let crData = new Array(64).fill(0)
        let yQuant = new Array(64).fill(0)

        let cbQuant = new Array(64).fill(0)

        let crQuant = new Array(64).fill(0)

        // 转换颜色空间
        this._convertColorSpace(xPos, yPos, yData, cbData, crData)

        let outputBitString = this._getEmptyTable(128)

        // Y通道压缩
        // console.log(`压缩通道 Y...`)
        // console.log(`yData = ${Buffer.from(yData)}`)
        this._forward_FDC(yData, yQuant)
        // console.log(`yquant = ${yQuant}`);
        // console.log(prev_DC_Y.prevDC)
        this._doHuffmanEncoding(
          yQuant,
          this._YDCHuffmanTable,
          this._YACHuffmanTable,
          outputBitString,
          prev_DC_Y
        )

        // console.log(this._YDCHuffmanTable)
        // console.log()
        // console.log(this._YACHuffmanTable)
        // console.log()
        this._write_bitstring_(
          outputBitString,
          prev_DC_Y.bitStringCounts,
          bytePos,
          fd
        )

        // Cb通道压缩
        // console.log(`压缩通道 Cb...`)
        this._forward_FDC(cbData, cbQuant)
        this._doHuffmanEncoding(
          cbQuant,
          this._CbCrDCHuffmanTable,
          this._CbCrACHuffmanTable,
          outputBitString,
          prev_DC_Cb
        )
        // console.log(outputBitString);
        this._write_bitstring_(
          outputBitString,
          prev_DC_Cb.bitStringCounts,
          bytePos,
          fd
        )

        // Cr通道压缩
        // console.log(`压缩通道 Cr...`)
        this._forward_FDC(crData, crQuant)
        this._doHuffmanEncoding(
          crQuant,
          this._CbCrDCHuffmanTable,
          this._CbCrACHuffmanTable,
          outputBitString,
          prev_DC_Cr
        )
        this._write_bitstring_(
          outputBitString,
          prev_DC_Cr.bitStringCounts,
          bytePos,
          fd
        )
      }
    }
    closeSync(fd)
  }
}

interface BitString {
  length: number;
  value: number;
}

interface PrevCounts {
  prevDC: number;
  bitStringCounts: number;
}

interface BytePos {
  newByte: number;
  newBytePos: number;
}
