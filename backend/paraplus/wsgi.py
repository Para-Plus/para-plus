"""
Configuration WSGI pour Para-plus.
Compatible avec serv00.
"""

import os
from django.core.wsgi import application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'paraplus.settings')
