r"""Probe live rank endpoints pakai token dari d:\webbaru\e2e-token.json.

Jalankan: D:\webbarubackend\venv\Scripts\python.exe tmp-html\vip-rank\probe.py
"""
import base64
import json
import urllib.request

SALT = 'KXXADFDFDF'
BASE = 'https://backend.scagerwebsite.uk'


def decode(body):
    if isinstance(body, dict) and isinstance(body.get('data'), str):
        reversed_ = body['data'][::-1]
        if reversed_.endswith(SALT):
            raw = base64.b64decode(reversed_[:-len(SALT)])
            return json.loads(raw.decode('utf-8'))
    return body


with open(r'd:\webbaru\e2e-token.json', encoding='utf-8') as fh:
    token = json.load(fh)['access']

for path in ('/api/auth/rank-status/', '/api/auth/rank-levels/'):
    req = urllib.request.Request(BASE + path, headers={
        'Authorization': f'Bearer {token}',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36',
    })
    with urllib.request.urlopen(req, timeout=30) as resp:
        body = json.loads(resp.read().decode('utf-8'))
    print('====', path)
    print(json.dumps(decode(body), indent=2, ensure_ascii=False))
