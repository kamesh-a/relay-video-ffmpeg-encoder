
// Trail:1c Failure 

const ffmpeg = require("ffmpeg.js/ffmpeg-webm.js");
const fs = require("fs");

async function getBufferFromBlob(blobData) {
  if (blobData && blobData.arrayBuffer) {
    return await blobData.arrayBuffer();
  }
  return blobData;
}

async function transcodeData(abuff, writeStream ) {
  const arrBuff = await getBufferFromBlob(abuff);
//   const testData = new Uint8Array(arrBuff);
console.log(`Arrya bugg`, arrBuff)
  const result = ffmpeg({
    MEMFS: [{ name: "in.mp4", data: arrBuff }],
    arguments: ["-i", "in.mp4", "--enable-decoder", "h264","-c", "copy", "out.mp4"],
    stdin: function () {},
  });
  // Write out.webm to disk.
  console.log('result, ', result.MEMFS[0])
  const out = result.MEMFS[0];
  writeStream.write(out.data);
  return out;
}

module.exports = {
  getBufferFromBlob,
  transcodeData,
};
