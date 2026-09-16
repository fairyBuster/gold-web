r"""Mint JWT for a user owning roulette tickets -> d:\webbaru\e2e-token.json
(hapus file setelah run harness).

Jalankan: D:\webbarubackend\venv\Scripts\python.exe tmp-html\poinmall\mint.py
"""
import json
import sys
sys.path.insert(0, r'D:\webbarubackend\web-day-backend')
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
import django
django.setup()

from rest_framework_simplejwt.tokens import RefreshToken
from roulette.models import RouletteTicketWallet
from gold.models import GoldOrder

user = None
wallet = (
    RouletteTicketWallet.objects.filter(balance__gt=0)
    .select_related('user')
    .order_by('-updated_at')
    .first()
)
if wallet:
    user = wallet.user
if user is None:
    order = GoldOrder.objects.select_related('user').order_by('-created_at').first()
    if order:
        user = order.user
if user is None:
    raise SystemExit('no user found — buat user dulu lewat app')

refresh = RefreshToken.for_user(user)
payload = {
    'access': str(refresh.access_token),
    'refresh': str(refresh),
    'user': f'{user.pk}:{getattr(user, "phone", None) or getattr(user, "email", "")}',
}
with open(r'd:\webbaru\e2e-token.json', 'w', encoding='utf-8') as fh:
    json.dump(payload, fh)
tickets = RouletteTicketWallet.objects.filter(user=user).first()
print('wrote e2e-token.json for', payload['user'],
      '| tickets', getattr(tickets, 'balance', 0))
