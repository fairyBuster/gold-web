r"""Probe: verifikasi endpoint baru untuk detail order dari riwayat.

1. Ambil GoldOrder terbaru + user pemiliknya, mint JWT.
2. GET /api/transactions/?type=SWAP&page=1 -> cek baris SWAP membawa gold_order_id.
3. GET /api/gold/orders/<id>/ -> detail order asli (bentuk yang dipakai layar step 3).

Jalankan: D:\webbarubackend\venv\Scripts\python.exe tmp-html\goldorder_probe.py
"""
import sys, json, base64, urllib.request
sys.path.insert(0, r'D:\webbarubackend\web-day-backend')
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
import django
django.setup()

from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
from gold.models import GoldOrder

SALT = getattr(settings, 'RESPONSE_ENCODE_SALT', 'KXXADFDFDF')


def decode(raw):
    obj = json.loads(raw)
    data = obj.get('data') if isinstance(obj, dict) else None
    if isinstance(data, str):
        rev = data[::-1]
        if rev.endswith(SALT):
            return json.loads(base64.b64decode(rev[:-len(SALT)]).decode('utf-8'))
        return {'__raw__': raw[:300]}
    return obj


def get(path, token):
    req = urllib.request.Request(
        f'http://localhost:8000{path}',
        headers={'Authorization': f'Bearer {token}'},
    )
    return decode(urllib.request.urlopen(req, timeout=20).read().decode())


order = GoldOrder.objects.order_by('-created_at').first()
if order is None:
    print('NO GOLD ORDER in DB — buat satu lewat app dulu.')
    sys.exit(0)

user = order.user
print(f'user: {user.phone} | newest order id={order.id} status={order.status} gram={order.gram}')
token = str(RefreshToken.for_user(user).access_token)

print('\n--- GET /api/transactions/?type=SWAP&page=1 ---')
rows = get('/api/transactions/?type=SWAP&page=1', token).get('results', [])
for row in rows[:6]:
    print({
        'id': row.get('id'),
        'trx_id': row.get('trx_id'),
        'wallet_type': row.get('wallet_type'),
        'status': row.get('status'),
        'amount': row.get('amount'),
        'gold_order_id': row.get('gold_order_id'),
    })

print(f'\n--- GET /api/gold/orders/{order.id}/ ---')
detail = get(f'/api/gold/orders/{order.id}/', token)
print(json.dumps(detail, indent=2, ensure_ascii=False))
