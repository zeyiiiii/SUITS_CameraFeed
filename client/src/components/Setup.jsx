// client/src/components/Setup.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Setup() {
    const [ev1, setEv1] = useState('10.206.60.7');
    const [ev2, setEv2] = useState('');
    const navigate      = useNavigate();

    const save = e => {
        e.preventDefault();
        // Build payload dynamically – include only non-empty fields
        const body = {};
        if (ev1.trim()) body.EV1_HOLO_IP = ev1.trim();
        if (ev2.trim()) body.EV2_HOLO_IP = ev2.trim();

        fetch('/set_config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })
            .then(() => navigate('/stream'))   // default to EV1 stream
            .catch(err => alert(`Save failed: ${err}`));
    };

    return (
        <form onSubmit={save} style={{ maxWidth: 400, margin: '2rem auto' }}>
            <h2>Setup HoloLens IPs</h2>

            <label style={{ display: 'block', marginBottom: '1rem' }}>
                EV1 HoloLens&nbsp;IP<br />
                <input
                    type="text"
                    value={ev1}
                    onChange={e => setEv1(e.target.value)}
                    placeholder="e.g. 10.206.60.7"
                    style={{ width: '100%' }}
                />
            </label>

            <label style={{ display: 'block', marginBottom: '1.5rem' }}>
                EV2 HoloLens&nbsp;IP&nbsp;(optional)<br />
                <input
                    type="text"
                    value={ev2}
                    onChange={e => setEv2(e.target.value)}
                    placeholder="leave blank if none"
                    style={{ width: '100%' }}
                />
            </label>

            <button type="submit">Save &nbsp;✓</button>
        </form>
    );
}
