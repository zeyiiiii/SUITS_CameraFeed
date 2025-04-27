import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import NoVid from '../assets/Images/NoVid.png';
import '../streamcomponent.css';

const StreamComponent = ({ evNumber }) => {
    const [isConnected, setIsConnected] = useState(true);
    const [holoIp,      setHoloIp]      = useState(null);

    useEffect(() => {
        fetch('/get_config')
            .then(r => r.json())
            .then(data => {
                const ip = evNumber === 1 ? data.EV1_HOLO_IP : data.EV2_HOLO_IP;
                setHoloIp(ip);
            })
            .catch(err => {
                console.error('Config error', err);
                setIsConnected(false);
            });
    }, [evNumber]);

    if (!isConnected || !holoIp) {
        return (
            <div className="stream-container">
                <h1>HoloLens Not Connected</h1>
                <p>
                    To see stream, input the HoloLens IP on the <Link to="/client/src/components/Setup">Setup</Link> page.
                </p>
                <img
                    src={NoVid}
                    alt="No Stream"
                    style={{ display: 'block', margin: '10px auto 0', width: 200, height: 200 }}
                />
            </div>
        );
    }

    const proxyUrl = `/stream?ip=${holoIp}`;

    return (
        <div className="stream-container">
            <img
                className="stream-video"
                src={proxyUrl}
                alt="Live HoloLens feed"
                onError={() => setIsConnected(false)}
            />
        </div>
    );
};

export default StreamComponent;
