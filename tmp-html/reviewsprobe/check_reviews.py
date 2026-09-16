"""Fetch and decode a salted API endpoint (default: GET /api/reviews/).

Usage:
  python3 tmp-html/reviewsprobe/check_reviews.py [url|-]
  (use '-' to decode a raw response piped from curl instead of fetching)

The server wraps every response as {"data": "<reverse(base64(json)+salt)>"}.
Salt must match RESPONSE_ENCODE_SALT (see .env VITE_RESPONSE_SALT).
"""
import base64
import json
import sys
import urllib.request

SALT = 'KXXADFDFDF'
UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36'


def decode(raw):
    body = json.loads(raw)
    data = body.get('data')
    if not isinstance(data, str):
        return body
    reversed_str = data[::-1]
    if not reversed_str.endswith(SALT):
        return body
    return json.loads(base64.b64decode(reversed_str[: -len(SALT)]))


def main():
    arg = sys.argv[1] if len(sys.argv) > 1 else 'https://richnetworkers.online/api/reviews/'
    if arg == '-':
        raw = sys.stdin.read()
    else:
        req = urllib.request.Request(arg, headers={'User-Agent': UA})
        with urllib.request.urlopen(req, timeout=20) as resp:
            raw = resp.read().decode('utf-8')
    payload = decode(raw)
    print(json.dumps(payload, indent=2, ensure_ascii=False)[:4000])


if __name__ == '__main__':
    main()

