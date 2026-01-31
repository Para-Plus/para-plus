# 🚀 Guide de Déploiement sur serv00

Ce guide explique comment déployer Para-plus.tn sur le serveur serv00.

## 📋 Informations de Connexion

```
Serveur: s3.serv00.com
Utilisateur: Paraplus
Mot de passe: Hfy1Gz1MRzRp
```

## 🔗 Connexion SSH

```bash
ssh Paraplus@s3.serv00.com
```

## 📂 Structure sur le Serveur

```
/home/Paraplus/
├── domains/
│   └── para-plus.tn/
│       ├── public_html/          # Frontend (Next.js)
│       └── public_python/        # Backend (Django)
│           ├── para-plus/        # Code du projet
│           ├── venv/             # Environnement virtuel
│           └── logs/             # Logs de l'application
```

## 🛠️ Installation Backend Django

### Étape 1: Connexion et Navigation

```bash
ssh Paraplus@s3.serv00.com
cd ~/domains/para-plus.tn/public_python
```

### Étape 2: Cloner le Repository

```bash
git clone https://github.com/Gas1212/para-plus.git
cd para-plus/backend
```

### Étape 3: Créer l'Environnement Virtuel

```bash
# Vérifier la version Python disponible
python3 --version

# Créer l'environnement virtuel
python3 -m venv ../../venv

# Activer l'environnement virtuel
source ../../venv/bin/activate
```

### Étape 4: Installer les Dépendances

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### Étape 5: Configurer les Variables d'Environnement

```bash
# Créer le fichier .env
nano .env
```

Copier le contenu suivant:

```env
# Configuration Django
SECRET_KEY=django-para-plus-2026-prod-4k9m2n8v7b6c5x4z3w2q1p0o9i8u7y6t5r4e3w2q1
DEBUG=False
ALLOWED_HOSTS=para-plus.tn,www.para-plus.tn,api.para-plus.tn,s3.serv00.com

# MongoDB Configuration
MONGODB_URI=mongodb+srv://paraplus:VOTRE_MONGODB_PASSWORD@para-plus.g9zicn9.mongodb.net
MONGODB_NAME=para_plus_db

# JWT Configuration
JWT_SECRET_KEY=jwt-para-plus-secure-2026-7h8j9k0l1m2n3b4v5c6x7z8a9s0d1f2g3h4j5k6

# CORS Configuration
CORS_ALLOWED_ORIGINS=https://para-plus.tn,https://www.para-plus.tn

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=contact@para-plus.tn
EMAIL_HOST_PASSWORD=VOTRE_PASSWORD_EMAIL
DEFAULT_FROM_EMAIL=noreply@para-plus.tn
```

### Étape 6: Collecter les Fichiers Statiques

```bash
python manage.py collectstatic --noinput
```

### Étape 7: Tester le Serveur

```bash
# Test local
python manage.py runserver 0.0.0.0:8000
```

## ⚙️ Configuration uWSGI

### Créer le fichier de configuration uWSGI

```bash
nano uwsgi.ini
```

Contenu du fichier:

```ini
[uwsgi]
# Chemins
chdir = /home/Paraplus/domains/para-plus.tn/public_python/para-plus/backend
module = paraplus.wsgi:application
home = /home/Paraplus/domains/para-plus.tn/public_python/venv

# Process
master = true
processes = 4
threads = 2

# Socket
socket = /home/Paraplus/domains/para-plus.tn/para-plus.sock
chmod-socket = 666
vacuum = true

# Logs
logto = /home/Paraplus/domains/para-plus.tn/public_python/logs/uwsgi.log
log-maxsize = 50000000
log-backupname = /home/Paraplus/domains/para-plus.tn/public_python/logs/uwsgi.old.log

# Optimisation
max-requests = 5000
harakiri = 60
buffer-size = 32768

# Environnement
env = DJANGO_SETTINGS_MODULE=paraplus.settings
```

### Lancer uWSGI

```bash
# Créer le dossier logs
mkdir -p ~/domains/para-plus.tn/public_python/logs

# Lancer uWSGI
uwsgi --ini uwsgi.ini --daemonize ~/domains/para-plus.tn/public_python/logs/uwsgi.log
```

## 🌐 Configuration Nginx (Reverse Proxy)

### Créer la configuration Nginx

Contacter l'admin serv00 ou créer le fichier:

```nginx
server {
    listen 80;
    server_name para-plus.tn www.para-plus.tn;

    # Redirection HTTPS (recommandé)
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name para-plus.tn www.para-plus.tn;

    # SSL Certificates (Let's Encrypt)
    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/key.pem;

    # API Backend
    location /api/ {
        include uwsgi_params;
        uwsgi_pass unix:/home/Paraplus/domains/para-plus.tn/para-plus.sock;
    }

    location /admin/ {
        include uwsgi_params;
        uwsgi_pass unix:/home/Paraplus/domains/para-plus.tn/para-plus.sock;
    }

    # Static files
    location /static/ {
        alias /home/Paraplus/domains/para-plus.tn/public_python/para-plus/backend/staticfiles/;
    }

    # Media files
    location /media/ {
        alias /home/Paraplus/domains/para-plus.tn/public_python/para-plus/backend/media/;
    }

    # Frontend Next.js (à configurer plus tard)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔄 Mise à Jour du Code

Pour mettre à jour le code après un push GitHub:

```bash
# Connexion SSH
ssh Paraplus@s3.serv00.com

# Navigation
cd ~/domains/para-plus.tn/public_python/para-plus

# Pull des changements
git pull origin main

# Activer l'environnement virtuel
source ~/domains/para-plus.tn/public_python/venv/bin/activate

# Installer les nouvelles dépendances (si nécessaire)
cd backend
pip install -r requirements.txt

# Collecter les fichiers statiques
python manage.py collectstatic --noinput

# Redémarrer uWSGI
pkill -f uwsgi
uwsgi --ini uwsgi.ini --daemonize ~/domains/para-plus.tn/public_python/logs/uwsgi.log
```

## 📊 Commandes Utiles

### Vérifier les Processus

```bash
# Voir les processus uWSGI
ps aux | grep uwsgi

# Voir les logs
tail -f ~/domains/para-plus.tn/public_python/logs/uwsgi.log
```

### Arrêter/Redémarrer uWSGI

```bash
# Arrêter
pkill -f uwsgi

# Démarrer
uwsgi --ini uwsgi.ini --daemonize ~/domains/para-plus.tn/public_python/logs/uwsgi.log

# Redémarrer (reload graceful)
uwsgi --reload /tmp/uwsgi-reload.pid
```

### Vérifier MongoDB

```bash
# Test de connexion depuis Python
cd ~/domains/para-plus.tn/public_python/para-plus/backend
source ~/domains/para-plus.tn/public_python/venv/bin/activate
python manage.py shell

# Dans le shell Python
>>> from mongoengine import connect
>>> connect(host='mongodb+srv://paraplus:VOTRE_MONGODB_PASSWORD@para-plus.g9zicn9.mongodb.net/para_plus_db')
>>> from apps.authentication.models import User
>>> User.objects.count()
```

## 🔒 Sécurité

### 1. Configurer le Firewall

```bash
# Vérifier les règles iptables (si disponible)
sudo iptables -L
```

### 2. Configurer SSL avec Let's Encrypt

```bash
# Installer certbot (si disponible sur serv00)
certbot certonly --webroot -w /home/Paraplus/domains/para-plus.tn/public_html -d para-plus.tn -d www.para-plus.tn
```

### 3. Sécuriser les Fichiers

```bash
# Permissions des fichiers
chmod 600 ~/domains/para-plus.tn/public_python/para-plus/backend/.env
chmod 644 ~/domains/para-plus.tn/public_python/para-plus/backend/manage.py
```

## 🐛 Debugging

### Logs à Vérifier

```bash
# Logs uWSGI
tail -f ~/domains/para-plus.tn/public_python/logs/uwsgi.log

# Logs Django (si configuré)
tail -f ~/domains/para-plus.tn/public_python/logs/django.log

# Logs Nginx
tail -f /var/log/nginx/error.log
```

### Tests de Connexion

```bash
# Test de l'API
curl http://para-plus.tn/api/auth/

# Test avec headers
curl -H "Content-Type: application/json" http://para-plus.tn/api/auth/connexion/
```

## ✅ Checklist de Déploiement

- [ ] Connexion SSH établie
- [ ] Code cloné depuis GitHub
- [ ] Environnement virtuel créé et activé
- [ ] Dépendances installées
- [ ] Fichier .env configuré
- [ ] Fichiers statiques collectés
- [ ] uWSGI configuré et lancé
- [ ] Nginx configuré
- [ ] SSL configuré (Let's Encrypt)
- [ ] Tests API fonctionnels
- [ ] MongoDB accessible
- [ ] Logs vérifiés

## 📞 Support

En cas de problème:
- Vérifier les logs: `tail -f ~/domains/para-plus.tn/public_python/logs/uwsgi.log`
- Tester la connexion MongoDB
- Vérifier les permissions des fichiers
- Contacter le support serv00: https://www.serv00.com/

## 🔄 Automatisation (Optionnel)

### Script de Déploiement Automatique

```bash
nano ~/deploy.sh
```

Contenu:

```bash
#!/bin/bash
cd ~/domains/para-plus.tn/public_python/para-plus
git pull origin main
source ~/domains/para-plus.tn/public_python/venv/bin/activate
cd backend
pip install -r requirements.txt
python manage.py collectstatic --noinput
pkill -f uwsgi
uwsgi --ini uwsgi.ini --daemonize ~/domains/para-plus.tn/public_python/logs/uwsgi.log
echo "Déploiement terminé!"
```

```bash
chmod +x ~/deploy.sh
```

Utilisation:
```bash
~/deploy.sh
```
