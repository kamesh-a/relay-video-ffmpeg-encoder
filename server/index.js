const WebSocket = require('ws')
const fs = require('fs');

const wss = new WebSocket.Server({ port: 8080 })

const writeStream = fs.createWriteStream(`sample-${Date.now()}.webm`);

writeStream.on('finish', () => {
  console.log('video saved');
});

wss.on('connection', ws => {
  ws.on('message', message => {
    // if (message.video) {
      console.log('saving video with octet stream');
      writeStream.write(message);
    // } else if (message.end) {
    //   console.log('end saving video');
    //   writeStream.end();
    // }
  })
  ws.send('Hello! Message From Server!!')
})
