#!/usr/bin/env python3
"""Tiny localhost save-server for the OG card render.

The IDE browser agent can rasterize pages (html2canvas) but cannot save
files (screenshots/downloads are blocked in this environment). So the card
page is served from here, and the agent POSTs the rendered PNG data URI
back to /save — the file lands on disk server-side.

Usage:  python3 serve.py            -> http://localhost:3999/card
"""
import base64
import os
import re
from http.server import BaseHTTPRequestHandler, HTTPServer

HERE = os.path.dirname(os.path.abspath(__file__))
CARD = os.path.join(HERE, 'card.html')
OUT = os.path.join(HERE, 'og-render.png')


class Handler(BaseHTTPRequestHandler):
    def _send(self, code, ctype, data):
        self.send_response(code)
        self.send_header('Content-Type', ctype)
        self.send_header('Content-Length', str(len(data)))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(data)

    def do_GET(self):
        if self.path == '/card':
            with open(CARD, 'rb') as f:
                self._send(200, 'text/html; charset=utf-8', f.read())
        elif self.path == '/health':
            self._send(200, 'text/plain', b'ok')
        else:
            self._send(404, 'text/plain', b'not found')

    def do_POST(self):
        length = int(self.headers.get('Content-Length') or 0)
        body = self.rfile.read(length)
        if self.path == '/save':
            match = re.match(rb'data:image/png;base64,', body)
            data = base64.b64decode(body.split(b',', 1)[1]) if match else body
            with open(OUT, 'wb') as f:
                f.write(data)
            self._send(200, 'text/plain', ('saved %d bytes' % len(data)).encode())
        else:
            self._send(404, 'text/plain', b'not found')

    def log_message(self, *args):
        pass


if __name__ == '__main__':
    print('serving card at http://localhost:3999/card (out: %s)' % OUT, flush=True)
    HTTPServer(('127.0.0.1', 3999), Handler).serve_forever()
