import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

import StreamComponent from './components/StreamComponent';
import Setup from './components/Setup';

export default function App() {
    return (
        <div>
            <header style={{ padding: '1rem', background: '#282c34', color: 'white' }}>
                <h1>HoloLens Stream App</h1>
                <nav>
                    <Link to="/stream" style={{ marginRight: '1rem', color: 'white' }}>
                        Live Stream
                    </Link>
                    <Link to="/setup" style={{ color: 'white' }}>
                        Setup
                    </Link>
                </nav>
            </header>
            <main style={{ padding: '1rem' }}>
                <Routes>
                    <Route path="/stream" element={<StreamComponent evNumber={1} />} />
                    <Route path="/setup"  element={<Setup />} />
                    <Route path="*"       element={<div>Page not found</div>} />
                </Routes>
            </main>
        </div>
    );
}
