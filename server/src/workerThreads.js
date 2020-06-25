// Trail:1d Failure 

const { Worker } = require("webworker-threads");
const fs = require("fs");
const { getBufferFromBlob, transcodeData } = require("./ffmpegWorker");

// const writeStream = fs.createWriteStream(`out/ffmpeg-sample-${Date.now()}.mp4`);

const worker = new Worker(function () {

  // async function getTranscodedData(data) {
  //   const buf = await getBufferFromBlob(data);
  //   const convertedBuff = transcodeData(buf);
  //   return convertedBuff.data;
  // }

  this.onmessage = async function (event) {
    const { type, data } = event.data;
    switch (type) {
      case "run": {
        // block for running ffmpeg
        // const buf = await getTranscodedData(data);
        console.log('inside worker', data);
        // writeStream.write(buf);
      }
    }
    // self.close();
  };
});

worker.onmessage = function (event) {
  console.log("Worker said : ");
};

module.exports = { worker };
