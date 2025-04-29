// src/components/StreamComponent.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import NoVid from '../assets/Images/NoVid.png';
import '../streamcomponent.css';   // you already have this

export default function StreamComponent() {
    const [ev1, setEv1] = useState('');
    const [ev2, setEv2] = useState('');
    const [bad1, setBad1] = useState(false);
    const [bad2, setBad2] = useState(false);

    /* ─ fetch saved IPs once ─ */
    useEffect(() => {
        fetch('/get_config')
            .then(r => r.json())
            .then(cfg => {
                setEv1(cfg.EV1_HOLO_IP?.trim() || '');
                setEv2(cfg.EV2_HOLO_IP?.trim() || '');
            })
            .catch(() => {
                setBad1(true);
                setBad2(true);
            });
    }, []);

    /* ─ fallback when nothing configured ─ */
    if (!ev1 && !ev2) {
        return (
            <div className="stream-container">
                <h1>No HoloLens IPs saved</h1>
                <p>
                    Go to <Link to="/setup">Setup</Link> and enter one or both addresses.
                </p>
                <img src={NoVid} alt="No feed" style={{ width: 240 }} />
            </div>
        );
    }

    /* helper – returns a <video> element */
    const videoEl = (ip, idx) => (
        <video
            key={idx}
            src={`https://${ip}/api/holographic/stream/live_high.mp4`}
            autoPlay
            playsInline
            controls
            muted
            onError={() => (idx === 1 ? setBad1(true) : setBad2(true))}
            className="stream-video"
            style={{ width: '100%', maxWidth: 960 }}
        />
    );

    /* choose which videos to show */
    const videos = [];
    if (ev1 && !bad1) videos.push(videoEl(ev1, 1));
    if (ev2 && !bad2) videos.push(videoEl(ev2, 2));

    if (videos.length === 0) {
        return (
            <div className="stream-container">
                <h1>Stream unavailable</h1>
                <p>Check that this browser session is logged in to Device Portal.</p>
                <img src={NoVid} alt="No feed" style={{ width: 240 }} />
            </div>
        );
    }

    /* render one or two videos */
    return (
        <div
            style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center',
                flexWrap: 'wrap'
            }}
        >
            {videos}
        </div>
    );
}
