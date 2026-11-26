# /// script
# requires-python = ">=3.10,<3.14"
# dependencies = ["kokoro-onnx>=0.4,<0.7"]
# ///
"""
Neural voices for the Formula Book, served from your own computer.

    uv run scripts/voice-server.py            # from a clone of the repository
    npm run voices                            # the same thing
    uv run https://raw.githubusercontent.com/garyleebairdjr-cmyk/mathematics-chemistry-physics-formula-book/main/scripts/voice-server.py

The first run downloads the Kokoro-82M voice model (about 90 MB, Apache-2.0)
into ~/.cache/formula-book-voices. After that it works offline.

It speaks the OpenAI-style API the book already knows:
    GET  /health              status and the voice list
    GET  /v1/voices           the voice list
    POST /v1/audio/speech     {"input": "...", "voice": "af_heart", "speed": 1.0} -> audio/wav

It only listens on 127.0.0.1, and it allows requests from any web page
(CORS, plus Chrome's private-network header), so both a local copy of the
book and the published site can use it. It only turns text into speech.
"""

from __future__ import annotations

import argparse
import io
import json
import os
import sys
import threading
import urllib.request
import wave
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

RELEASE = "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0"
MODELS = {
    "int8": "kokoro-v1.0.int8.onnx",  # about 88 MB, fast on a CPU
    "fp32": "kokoro-v1.0.onnx",  # about 310 MB, a little cleaner
}
VOICES_FILE = "voices-v1.0.bin"

# English voices, labelled for the picker. Kokoro has more (other languages) in the same file.
LABELS = {
    "af_heart": "Heart (US, warm)",
    "af_bella": "Bella (US)",
    "af_nicole": "Nicole (US, soft)",
    "af_sarah": "Sarah (US)",
    "af_sky": "Sky (US)",
    "am_michael": "Michael (US)",
    "am_fenrir": "Fenrir (US)",
    "am_puck": "Puck (US)",
    "am_adam": "Adam (US)",
    "bf_emma": "Emma (UK)",
    "bf_isabella": "Isabella (UK)",
    "bm_george": "George (UK)",
    "bm_fable": "Fable (UK)",
    "bm_lewis": "Lewis (UK)",
}

_tts = None
_lock = threading.Lock()
_status = "loading"


def download(url: str, dest: Path) -> None:
    if dest.exists() and dest.stat().st_size > 0:
        return
    dest.parent.mkdir(parents=True, exist_ok=True)
    tmp = dest.with_suffix(dest.suffix + ".part")
    print(f"Downloading {dest.name} …", flush=True)
    with urllib.request.urlopen(url) as res, open(tmp, "wb") as out:
        total = int(res.headers.get("Content-Length") or 0)
        done = 0
        while chunk := res.read(1 << 20):
            out.write(chunk)
            done += len(chunk)
            if total:
                print(f"\r  {done * 100 // total:3d}%  {done >> 20} / {total >> 20} MB", end="", flush=True)
    print(flush=True)
    tmp.replace(dest)


def load(cache: Path, quality: str) -> None:
    global _tts, _status
    from kokoro_onnx import Kokoro

    model = cache / MODELS[quality]
    voices = cache / VOICES_FILE
    download(f"{RELEASE}/{MODELS[quality]}", model)
    download(f"{RELEASE}/{VOICES_FILE}", voices)
    _tts = Kokoro(str(model), str(voices))
    _tts.create("The voice engine is ready.", voice="af_heart", speed=1.0, lang="en-us")
    _status = "ok"


def voice_list() -> list[dict]:
    names = sorted(_tts.get_voices()) if _tts is not None else sorted(LABELS)
    return [
        {"id": name, "name": LABELS.get(name, name)}
        for name in names
        if name[:2] in ("af", "am", "bf", "bm")
    ]


def to_wav(samples, rate: int) -> bytes:
    import numpy as np

    pcm = (np.clip(samples, -1.0, 1.0) * 32767).astype("<i2").tobytes()
    buf = io.BytesIO()
    with wave.open(buf, "wb") as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(rate)
        wav.writeframes(pcm)
    return buf.getvalue()


class Handler(BaseHTTPRequestHandler):
    server_version = "FormulaBookVoices/1.0"

    def log_message(self, format, *args):  # noqa: A002
        sys.stderr.write("%s %s\n" % (self.address_string(), format % args))

    def _cors(self) -> None:
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        # Lets a page on the public web reach this loopback server in Chrome.
        self.send_header("Access-Control-Allow-Private-Network", "true")
        self.send_header("Access-Control-Max-Age", "600")

    def _send(self, code: int, body: bytes, content_type: str) -> None:
        self.send_response(code)
        self._cors()
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def _json(self, code: int, payload: dict) -> None:
        self._send(code, json.dumps(payload).encode(), "application/json")

    def do_OPTIONS(self) -> None:  # noqa: N802
        self.send_response(204)
        self._cors()
        self.end_headers()

    def do_GET(self) -> None:  # noqa: N802
        path = self.path.split("?", 1)[0]
        if path in ("/health", "/v1/health"):
            self._json(200, {"status": _status, "engine": "kokoro", "voices": voice_list()})
        elif path == "/v1/voices":
            self._json(200, {"voices": voice_list()})
        else:
            self._json(404, {"error": "not found"})

    def do_POST(self) -> None:  # noqa: N802
        if self.path.split("?", 1)[0] != "/v1/audio/speech":
            self._json(404, {"error": "not found"})
            return
        if _tts is None:
            self._json(503, {"error": "The voice model is still loading."})
            return
        try:
            length = int(self.headers.get("Content-Length") or 0)
            data = json.loads(self.rfile.read(min(length, 64_000)) or b"{}")
        except (ValueError, json.JSONDecodeError):
            self._json(400, {"error": "Invalid JSON."})
            return
        text = " ".join(str(data.get("input") or "").split())
        if not text:
            self._json(400, {"error": "Nothing to read."})
            return
        if len(text) > 4000:
            self._json(400, {"error": "That piece is too long; send one sentence at a time."})
            return
        voice = str(data.get("voice") or "af_heart")
        if voice not in _tts.get_voices():
            voice = "af_heart"
        try:
            speed = min(2.0, max(0.5, float(data.get("speed") or 1.0)))
        except (TypeError, ValueError):
            speed = 1.0
        lang = "en-gb" if voice.startswith("b") else "en-us"
        try:
            with _lock:
                samples, rate = _tts.create(text, voice=voice, speed=speed, lang=lang)
        except Exception as err:  # noqa: BLE001
            self._json(500, {"error": f"Speech failed: {err}"})
            return
        self._send(200, to_wav(samples, rate), "audio/wav")


def main() -> int:
    parser = argparse.ArgumentParser(description="Neural voices for the Formula Book, on 127.0.0.1.")
    parser.add_argument("--port", type=int, default=int(os.environ.get("FORMULA_VOICES_PORT", "3939")))
    parser.add_argument("--quality", choices=sorted(MODELS), default="int8", help="int8 (88 MB, fast) or fp32 (310 MB)")
    parser.add_argument(
        "--cache",
        default=os.environ.get("FORMULA_VOICES_CACHE", str(Path.home() / ".cache" / "formula-book-voices")),
    )
    args = parser.parse_args()

    httpd = ThreadingHTTPServer(("127.0.0.1", args.port), Handler)
    print(f"Formula Book voices on http://127.0.0.1:{args.port}  (Ctrl+C to stop)", flush=True)

    def warm() -> None:
        global _status
        try:
            load(Path(args.cache).expanduser(), args.quality)
            print("Voices ready. In the book, open Settings > Voice > On this computer.", flush=True)
        except Exception as err:  # noqa: BLE001
            _status = "error"
            print(f"Could not load the voice model: {err}", file=sys.stderr, flush=True)

    # Answer /health right away (status "loading") while the model downloads.
    threading.Thread(target=warm, daemon=True).start()
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
