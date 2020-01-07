
// client.js

const url = 'ws://localhost:8080'
const connection = new WebSocket(url)

connection.onopen = () => {
  // connection.send('Message From Client')
}

connection.onerror = (error) => {
  console.log(`WebSocket error: ${error}`)
}

connection.onmessage = (e) => {
  console.log(e.data)
}
window.connection = connection;

// window.steamData = steamData;
async function steamData () {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  const options = { mimeType: 'video/webm' };
  const mediaRecorder = new MediaRecorder(stream, options);
  mediaRecorder.addEventListener('dataavailable', (e) => {
    connection.send(e.data);
  });
  mediaRecorder.start();
  window.time = setInterval(() => {
    mediaRecorder.requestData()
  }, 2000);
}

steamData()