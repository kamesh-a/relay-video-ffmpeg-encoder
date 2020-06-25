// Trail:1b Failure 

const fleuntFP = require('fluent-ffmpeg');
const command = fleuntFP('./out/sample-original.mp4');
command
.inputOptions([
    '-c:v'
])
.output('./out/sample-compiled.mp4')
.run();