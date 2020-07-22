/**
 * Spawn a process to get input from stream
 * Spawn a process to emit output froms tream
 * ffmpeg command
 */

/**
 * Documentation used for FFmpeg transcoding
 * 1. https://ffmpeg.org/ffmpeg.html
 * 2. https://ffmpeg.org/ffmpeg-formats.html#mov_002fmp4_002f3gp muxer -movflags
 * 3. https://jscomplete.com/learn/node-beyond-basics/child-processes
 * 4. https://stackoverflow.com/questions/47815475/spawn-ffmpeg-in-nodejs-and-pipe-to-expresss-response ( Direct answer )
 * 5. https://blog.addpipe.com/converting-webm-to-mp4-with-ffmpeg/ simple examples
 * 6. https://stackoverflow.com/questions/45899585/pipe-input-in-to-ffmpeg Input piping example
 * 7. https://jshakespeare.com/encoding-browser-friendly-video-files-with-ffmpeg/
 */

 /**
  * Creating GIF
  * 1. https://superuser.com/questions/556029/how-do-i-convert-a-video-to-gif-using-ffmpeg-with-reasonable-quality
  * 2. http://blog.pkh.me/p/21-high-quality-gif-with-ffmpeg.html
  */
const { spawn } = require("child_process");

function getFFmpegCommand(iPath, oPath) {
  console.log("What you got: ", iPath, oPath);
  if (iPath && oPath) {
    return `ffmpeg -i ${iPath} -movflags faststart -f mp4 -c:v copy ${oPath}`;
  } else if (oPath) {
    return `ffmpeg -i pipe:0 -movflags faststart -f mp4 -c:v copy ${oPath}`;
  }

  return "ffmpeg -i pipe:0 -c:v copy -f mp4 -movflags frag_keyframe+empty_moov pipe:1";
}

// Return and child process detached
function spinSeparateThread(iPath, oPath) {
  const ffmpeg = getFFmpegCommand(iPath, oPath);
  console.log(`Using ffmpeg command : ${ffmpeg}`);
  const command = spawn(`${ffmpeg}`, {
    detached: true,
    shell: true,
  });

  return command;
}

// Experiment-2 ( Particial success ) but not efficient as it needs
// An intermediate files are required example input file and output file
// in the disk, Source is in index.js
function initPipeWithFilePath(inputFilePath, outputFilePath) {
  const ffmpegStreamReadableStream = spinSeparateThread(
    inputFilePath,
    outputFilePath
  );

  if (ffmpegStreamReadableStream) {
    ffmpegStreamReadableStream.stdout.on("data", (data) => {
      console.log(`child stdout:\n${data}`);
    });

    ffmpegStreamReadableStream.stderr.on("data", (data) => {
      console.error(`child stderr:\n${data}`);
    });
  }

  return ffmpegStreamReadableStream;
}

// Experiment-3 (FAILED) as we didn't add -moveflags to use with fragments
// Another downside here we need locally written input file and piped to output
// Source is in index.js
function initPipeWithOnlyOuputFilePath(outputFilePath) {
  const ffmpegStreamReadableStream = spinSeparateThread(null, outputFilePath);

  if (ffmpegStreamReadableStream) {
    ffmpegStreamReadableStream.stdout.on("data", (data) => {
      console.log(`child stdout:\n${data}`);
    });

    ffmpegStreamReadableStream.stderr.on("data", (data) => {
      console.error(`child stderr:\n${data}`);
    });
  }

  return ffmpegStreamReadableStream;
}

// Experiment-4 (Success) final Proof Of Concept where
// fileOutputStream is a writable stream which in this case is a local
// file but it can be any writable stream
// Source is in Transcoding.js
function initPipe(fileWriteOutStream) {
  const childProcess = spinSeparateThread();

  if (fileWriteOutStream && childProcess) {
    childProcess.stdout.on("data", (data) => {
      //   console.log(`child stdout:\n${data}`);
      //   Writes the transcoded output on the fly.
      fileWriteOutStream.write(data);
    });

    childProcess.stderr.on("data", (data) => {
      console.error(`child stderr:\n${data}`);
    });
  }

  return childProcess;
}

module.exports = {
  initPipe,
  initPipeWithFilePath,
  initPipeWithOnlyOuputFilePath,
};
