r"""Mint JWT for the user owning the newest Investment -> d:\webbaru\e2e-token.json
(hapus file setelah run harness).

Jalankan: D:\webbarubackend\venv\Scripts\python.exe tmp-html\asset-total\mint.py
"""
import json
import sys
sys.path.insert(0, r'D:\webbarubackend\web-day-backend')
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
import django
django.setup()

from rest_framework_simplejwt.tokens import RefreshToken
from products.models import Investment

inv = Investment.objects.select_related('user').order_by('-created_at').first()
if inv is None:
    raise SystemExit('no investment found')
user = inv.user
refresh = RefreshToken.for_user(user)
payload = {
    'access': str(refresh.access_token),
    'refresh': str(refresh),
    'user': f'{user.pk}:{getattr(user, "phone", None) or getattr(user, "email", "")}',
}
with open(r'd:\webbaru\e2e-token.json', 'w', encoding='utf-8') as fh:
    json.dump(payload, fh)
print('wrote e2e-token.json for', payload['user'], '| investment', inv.id)
