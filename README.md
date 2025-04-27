# Usage

Follow these steps to start the live HoloLens camera stream:

1. **Start the Proxy Server**
   ```bash
   cd camera-feed/proxy
   npm install
   npm start
   ```
    - Runs on port **8000** by default.

2. **Start the Client App**
   ```bash
   cd camera-feed/client
   npm install
   npm start
   ```
    - Opens a React dev server at <http://localhost:3000>.

3. **Configure & View Stream**
    - In your browser, go to <http://localhost:3000/setup>.
    - Enter your HoloLens IP address and click **Save & View Stream**.
    - You’ll be redirected to <http://localhost:3000/stream> to see the live MJPEG feed.

That's it! Your HoloLens camera will now stream in real time via the web UI.