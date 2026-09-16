import sys, json, base64, urllib.request
sys.path.insert(0, r'D:\webbarubackend\web-day-backend')
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
import django
django.setup()

from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from gold.models import GoldSettings

User = get_user_model()
user = User.objects.filter(is_superuser=True).first() or User.objects.first()
print('user:', user.phone if user else None)
token = str(RefreshToken.for_user(user).access_token)

gs = GoldSettings.load()
print('GoldSettings:', gs and {
    'is_active': gs.is_active,
    'printing_fee_per_gram': str(gs.printing_fee_per_gram),
    'shipping_cost': str(gs.shipping_cost),
})

req = urllib.request.Request(
    'http://localhost:8000/api/gold/info/',
    headers={'Authorization': f'Bearer {token}'},
)
raw = urllib.request.urlopen(req, timeout=20).read().decode()
obj = json.loads(raw)
salt = getattr(settings, 'RESPONSE_ENCODE_SALT', 'KXXADFDFDF')
data = obj.get('data') if isinstance(obj, dict) else None
if isinstance(data, str):
    rev = data[::-1]
    if rev.endswith(salt):
        payload = json.loads(base64.b64decode(rev[:-len(salt)]).decode('utf-8'))
        print('info payload:')
        print(json.dumps(payload, indent=2, ensure_ascii=False))
    else:
        print('NO SALT SUFFIX:', raw[:300])
else:
    print('plain:', json.dumps(obj, indent=2, ensure_ascii=False))
