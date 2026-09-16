"""Mint a JWT session for E2E runs and write it to d:\\webbaru\\e2e-token.json.

Run with the backend venv python:
  D:\\webbarubackend\\venv\\Scripts\\python.exe tmp-html/allpages-desktop/mint-token.py
The file is picked up by the all-pages audit harness over the dev server
(same-origin fetch) and must be deleted after the run.
"""
import json
import os
import sys

sys.path.insert(0, r'D:\webbarubackend\web-day-backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django  # noqa: E402

django.setup()

from django.contrib.auth import get_user_model  # noqa: E402
from rest_framework_simplejwt.tokens import RefreshToken  # noqa: E402

User = get_user_model()
user = User.objects.filter(is_active=True).order_by('id').first()
if user is None:
    raise SystemExit('no active user found')

refresh = RefreshToken.for_user(user)
payload = {
    'access': str(refresh.access_token),
    'refresh': str(refresh),
    'user': f'{user.pk}:{getattr(user, "phone_number", None) or getattr(user, "phone", None) or getattr(user, "email", "")}',
}

with open(r'd:\webbaru\e2e-token.json', 'w', encoding='utf-8') as fh:
    json.dump(payload, fh)

print('wrote e2e-token.json for user', payload['user'])
