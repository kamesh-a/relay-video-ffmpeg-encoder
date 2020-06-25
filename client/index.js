// client.js
/**
 * TODO:
 *
 * FIXME:
 *
 *
 *
 */
// const url = "wss://0-0-2-dot-flexible-dot-staging-connectaw.appspot.com";
const url = "ws://localhost:8080";
const connection = new WebSocket(url);

connection.onopen = () => {
  // connection.send('Message From Client')
};

connection.onerror = (error) => {
  console.log(`WebSocket error: ${error}`, error);
};

connection.onmessage = (e) => {
  console.log(e.data);
};

window.connection = connection;

let buffer = [];
let timer = 0;
let startTime = 0;
let endTime = 0;
// window.steamData = steamData;

function getSupportedMediaCodec() {
  var types = ["video/webm;codecs=h264", "video/webm;codecs=vp8", "video/webm"];
  // var types = ["video/webm;codecs=vp8", "video/webm"];

  for (var i in types) {
    codecType = types[i];
    if (MediaRecorder.isTypeSupported(codecType)) {
      return codecType;
    }
  }
}

async function steamData() {
  const codecType = getSupportedMediaCodec();
  console.log(`Using codec ${codecType}`);
  const stream = await navigator.mediaDevices.getDisplayMedia();
  const options = { mimeType: codecType };
  const mediaRecorder = new MediaRecorder(stream, options);
  mediaRecorder.addEventListener("start", (e) => {
    startTime = new Date();
    console.log(`Start Time ${startTime}}`, startTime.getTime());
    timer++;
  });

  mediaRecorder.addEventListener("dataavailable", (e) => {
    console.log(typeof e.data)
    connection.send(e.data);
    // buffer.push(e.data)
    timer++;
  });

  mediaRecorder.addEventListener("stop", (e) => {
    endTime = new Date();
    console.log(`End Time ${endTime}}`, endTime.getTime());
    connection.close(1000);
  });

  mediaRecorder.start(200);
}

steamData();
