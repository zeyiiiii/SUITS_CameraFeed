import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Setup() {
    const [ev1, setEv1] = useState('');
    const [ev2, setEv2] = useState('');
    const navigate = useNavigate();

    const saveConfig = e => {
        e.preventDefault();
        fetch('/set_config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ EV1_HOLO_IP: ev1, EV2_HOLO_IP: ev2 })
        })
            .then(r => r.json())
            .then(() => navigate('/stream'))
            .catch(err => alert('Error saving config: ' + err));
    };

    return (
        <form onSubmit={saveConfig} style={{ maxWidth: 400, margin: '0 auto' }}>
            <h2>Setup HoloLens IPs</h2>
            <label>
                EV1 HoloLens IP:
                <input
                    type="text"
                    value={ev1}
                    onChange={e => setEv1(e.target.value)}
                    required
                    style={{ width: '100%', marginBottom: '1rem' }}
                />
            </label>
            <label>
                EV2 HoloLens IP:
                <input
                    type="text"
                    value={ev2}
                    onChange={e => setEv2(e.target.value)}
                    style={{ width: '100%', marginBottom: '1rem' }}
                />
            </label>
            <button type="submit">Save & View Stream</button>
        </form>
    );
}
