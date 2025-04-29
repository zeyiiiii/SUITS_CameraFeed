// proxy/server.js   (CommonJS version)
require('dotenv').config();            // ← replace import line
const express = require('express');
const cors    = require('cors');
const ffmpeg  = require('fluent-ffmpeg');
const { PassThrough } = require('stream');

const app = express();
app.use(cors());
app.use(express.json());

// ───── Config API (optional, for React setup page) ─────
let config = { EV1_HOLO_IP: '', EV2_HOLO_IP: '' };

app.get('/get_config', (_, res) => res.json(config));
app.post('/set_config', (req, res) => {
    const { EV1_HOLO_IP, EV2_HOLO_IP } = req.body;
    if (EV1_HOLO_IP) config.EV1_HOLO_IP = EV1_HOLO_IP;
    if (EV2_HOLO_IP) config.EV2_HOLO_IP = EV2_HOLO_IP;
    res.json({ status: 'ok', config });
});

// ───── MJPEG endpoint ─────
app.get('/stream', (req, res) => {
    const ip = req.query.ip;
    if (!ip) return res.status(400).send('Missing ?ip=');

    res.writeHead(200, {
        'Content-Type': 'multipart/x-mixed-replace; boundary=frame'
    });

    const b64 = Buffer
        .from(`${process.env.HOLOLENS_USER}:${process.env.HOLOLENS_PASS}`)
        .toString('base64');

    const src = `https://${ip}:10443/api/holographic/stream/live_high.mp4`;
    const pipe = new PassThrough();

    ffmpeg(src)
        .addInputOption('-re')
        .addInputOption('-headers', `Authorization: Basic ${b64}\r\n`)
        .addInputOption('-tls_verify', '0')
        .format('mjpeg')
        .outputOptions(['-q:v', '5'])
        .on('error', e => console.error('FFmpeg', e.message))
        .pipe(pipe, { end: true });

    pipe.on('data', buf => {
        res.write(
            `--frame\r\nContent-Type:image/jpeg\r\nContent-Length:${buf.length}\r\n\r\n`
        );
        res.write(buf);
    });
    res.on('close', () => pipe.destroy());
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Proxy running at http://localhost:${PORT}`));
