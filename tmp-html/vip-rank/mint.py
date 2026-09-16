r"""Mint JWT for the user owning the newest Investment -> d:\webbaru\e2e-token.json
(hapus file setelah run harness). Bonus: cetak fakta rank dari DB lokal untuk
membandingkan dengan respons live.

Jalankan: D:\webbarubackend\venv\Scripts\python.exe tmp-html\vip-rank\mint.py
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
from accounts.models import RankLevel
from accounts.utils import get_rank_evaluation_flags, calculate_user_rank_progress_breakdown

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
print('wrote e2e-token.json for', payload['user'], '| investment', inv.id, '| rank', user.rank)
print('flags:', get_rank_evaluation_flags())
print('breakdown:', calculate_user_rank_progress_breakdown(user))
for lv in RankLevel.objects.order_by('rank'):
    print('level', lv.rank, repr(lv.title), '| missions', lv.missions_required_total,
          '| dl_total', lv.downlines_total_required, '| dl_active', lv.downlines_active_required,
          '| dep_self', lv.deposit_self_total_required, '| team_dep', lv.team_deposit_level_1_total_required)
