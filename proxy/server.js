const express = require('express');
const ffmpeg = require('fluent-ffmpeg');
const { PassThrough } = require('stream');

const app = express();

app.get('/stream', (req, res) => {
    const holoIp = req.query.ip;
    if (!holoIp) {
        return res.status(400).send('Missing ?ip=<HOLO_IP>');
    }

    // Tell the browser we’re doing MJPEG over HTTP:
    res.writeHead(200, {
        'Content-Type': 'multipart/x-mixed-replace; boundary=frame'
    });

    // Create a passthrough for FFmpeg’s output
    const stream = new PassThrough();

    ffmpeg(`http://${holoIp}/api/holographic/stream/live_high.mp4`)
        .addInputOption('-re')               // read at native rate
        .outputOptions('-f mjpeg')           // JPEG stream
        .outputOptions('-q:v 5')             // quality level (1–31)
        .on('start', cmd => console.log('FFmpeg:', cmd))
        .on('error', err => console.error('FFmpeg error:', err))
        .pipe(stream, { end: true });

    // As FFmpeg spits out JPEG buffers, wrap them in the multipart boundary
    stream.on('data', chunk => {
        res.write(
            `--frame\r\nContent-Type: image/jpeg\r\nContent-Length: ${chunk.length}\r\n\r\n`
        );
        res.write(chunk);
    });

    // When the client disconnects, kill FFmpeg
    res.on('close', () => {
        stream.destroy();
    });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`MJPEG proxy listening on :${PORT}`));
