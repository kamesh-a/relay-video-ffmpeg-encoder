const WebSocket = require("ws");
const fs = require("fs");
// const { worker } = require("./workerThreads");
// const { getBufferFromBlob, transcodeData } = require("./ffmpegWorker");
// const fleuntFP = require('fluent-ffmpeg');
// cosnt command = fleuntFP();
const { initPipe, initPipeWithFilePath, initPipeWithOnlyOuputFilePath } = require("./ffmpegSpawnStream");

const wss = new WebSocket.Server({ port: 8080 });

const writeStream = fs.createWriteStream(`out/sample-${Date.now()}.mp4`);
// const writeStream = fs.createWriteStream(`out/temp-original.webm`);

// const ffmpegWritableStream = initPipe(writeStream);

writeStream.on("finish", () => {
  console.log("video saved");
});

wss.on("connection", (ws) => {
  // const oPath = './out/transcoded-original.mp4'
  // const inputWritableStream = initPipeWithOnlyOuputFilePath(oPath);

  const inputWritableStream = initPipe(writeStream);

  ws.on("message", (message) => {
    // if (message.video) {
    console.log("saving video with octet stream");

    // writeStream.write(message);
    inputWritableStream.stdin.write(message)

    // transcodeData(message, writeStream)
    // } else if (message.end) {
    //   console.log('end saving video');
    //   writeStream.end();
    // }
  });
  ws.send("Hello! Message From Server!!");
  
  // experiment-2 working
  // ws.on("close", function () {
  //   const iPath = './out/temp-original.webm'
  //   const oPath = './out/transcoded-original.mp4'
  //   initPipeWithFilePath(iPath, oPath)
  // });

  ws.on("close", function () {
    writeStream.end();
  });
});
