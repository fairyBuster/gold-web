r"""Probe: cek rumus Biaya Admin TarikDana vs data backend asli.

1. Ambil Withdrawal terbaru + user pemiliknya, mint JWT.
2. GET /api/banks/user/ -> field fee pada objek bank yang dipakai step 3/4.
3. GET /api/withdraw/settings/ -> require_withdraw_service dll.
4. Print WithdrawalService aktif (fee_percent/fee_fixed) + baris Withdrawal
   terakhir (amount/fee/net_amount) + bandingkan estimasi FE vs backend.

Jalankan: D:\webbarubackend\venv\Scripts\python.exe tmp-html\withdrawfee_probe.py
"""
import sys, json, base64, urllib.request
from decimal import Decimal
sys.path.insert(0, r'D:\webbarubackend\web-day-backend')
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
import django
django.setup()

from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
from withdrawal.models import Withdrawal, WithdrawalService, WithdrawalSettings

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


wd = Withdrawal.objects.select_related('user', 'bank_account', 'bank_account__bank', 'withdrawal_service').order_by('-created_at').first()
if wd is None:
    print('NO WITHDRAWAL in DB — buat satu lewat app dulu.')
    sys.exit(0)

user = wd.user
print(f'user: {user.phone} | newest withdrawal id={wd.id} amount={wd.amount} fee={wd.fee} net={wd.net_amount}')
token = str(RefreshToken.for_user(user).access_token)

print('\n--- GET /api/banks/user/ ---')
for row in get('/api/banks/user/', token):
    print({k: row.get(k) for k in ('id', 'bank', 'bank_name', 'bank_code', 'withdrawal_fee', 'withdrawal_fee_fixed', 'is_default')})

print('\n--- GET /api/withdraw/settings/ ---')
print(json.dumps(get('/api/withdraw/settings/', token), ensure_ascii=False, indent=2))

print('\n--- WithdrawalService aktif (DB) ---')
for svc in WithdrawalService.objects.filter(is_active=True):
    print({'id': svc.id, 'name': svc.name, 'fee_percent': str(svc.fee_percent), 'fee_fixed': str(svc.fee_fixed)})

print('\n--- 5 Withdrawal terakhir (DB) ---')
for w in Withdrawal.objects.select_related('bank_account', 'bank_account__bank', 'withdrawal_service').order_by('-created_at')[:5]:
    bank = w.bank_account.bank if w.bank_account else None
    svc = w.withdrawal_service
    print({
        'id': w.id,
        'amount': str(w.amount),
        'fee': str(w.fee),
        'net': str(w.net_amount),
        'bank': bank.name if bank else None,
        'bank_pct': str(bank.withdrawal_fee) if bank else None,
        'bank_fixed': str(bank.withdrawal_fee_fixed) if bank else None,
        'service': svc.name if svc else None,
    })

# Estimasi FE (rumus TarikDana.jsx) vs rumus backend untuk bank default user.
bank_row = next((r for r in get('/api/banks/user/', token) if r.get('is_default')), None)
if bank_row:
    pct = Decimal(str(bank_row.get('withdrawal_fee') or 0))
    fixed = Decimal(str(bank_row.get('withdrawal_fee_fixed') or 0))
    amount = Decimal('100000')
    fe_estimate = round(float(amount) * float(pct) / 100 + float(fixed), 2)
    print(f'\nFE estimate (frontend rumus) utk amount=100000 di {bank_row.get("bank_name")}: {fe_estimate}')
