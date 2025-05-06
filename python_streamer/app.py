import subprocess
import sys
from flask import Flask, Response, render_template, request, abort

app = Flask(__name__)

@app.route('/')
def index():
    """Serves the main HTML page."""
    return render_template('index.html')

def generate_stream(holo_ip):
    """Generates the MJPEG stream using ffmpeg."""
    ffmpeg_cmd = [
        'ffmpeg',
        '-i', f'http://{holo_ip}/api/holographic/stream/live_high.mp4',
        '-re',             # Read input at native frame rate
        '-f', 'mjpeg',      # Output format: MJPEG
        '-q:v', '5',       # Quality level (1-31, lower is better quality)
        '-vf', 'scale=640:-1', # Optional: Scale video width to 640px, maintain aspect ratio
        '-an',             # Disable audio
        '-',               # Output to stdout
    ]

    print(f"Starting ffmpeg for {holo_ip}: {' '.join(ffmpeg_cmd)}", file=sys.stderr)
    process = subprocess.Popen(ffmpeg_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    try:
        while True:
            chunk = process.stdout.read(4096) # Read in chunks
            if not chunk:
                print("FFmpeg stream ended.", file=sys.stderr)
                break
            yield (
                b'--frame\r\n'
                b'Content-Type: image/jpeg\r\n'
                b'Content-Length: ' + str(len(chunk)).encode() + b'\r\n\r\n' +
                chunk +
                b'\r\n'
            )
    except GeneratorExit:
        print("Client disconnected.", file=sys.stderr)
    except Exception as e:
        print(f"Error reading ffmpeg stream: {e}", file=sys.stderr)
    finally:
        print("Killing ffmpeg process.", file=sys.stderr)
        process.terminate()
        try:
            process.wait(timeout=5) # Wait a bit for graceful termination
        except subprocess.TimeoutExpired:
            process.kill() # Force kill if necessary
        print("FFmpeg process finished.", file=sys.stderr)

@app.route('/stream')
def stream():
    """Endpoint to serve the MJPEG stream."""
    holo_ip = request.args.get('ip')
    if not holo_ip:
        abort(400, 'Missing IP parameter')

    return Response(
        generate_stream(holo_ip),
        mimetype='multipart/x-mixed-replace; boundary=frame'
    )

if __name__ == '__main__':
    # Use 0.0.0.0 to make it accessible on the network
    app.run(host='0.0.0.0', port=5000, debug=True) 