const WebSocket = require("ws");
const fs = require("fs");
const { initPipe } = require("./ffmpegSpawnStream");

const wss = new WebSocket.Server({ port: 8080 });

const writeStream = fs.createWriteStream(`./out/sample-${Date.now()}.mp4`);

writeStream.on("finish", () => {
  console.log("video saved");
  // Video url should be consumed or gives as response in this point of time.
});

wss.on("connection", (ws) => {
  // Initializing ffmpeg pipe connection.
  const inputWritableStream = initPipe(writeStream);

  ws.on("message", (message) => {
    console.log("saving video with octet stream");
    inputWritableStream.stdin.write(message);
  });
  ws.send("Hello! Message From Server!!");
  
  ws.on("close", function () {
    writeStream.end();
  });
});
