# 🔴 Debug Erreur 500 - Backend Render

## ❌ Erreur actuelle

```
Internal Server Error (500)
https://para-plus-tn.onrender.com/health/
```

Une erreur 500 signifie que le backend Django a un problème de configuration ou de code.

---

## 🔍 Diagnostic - Étape par étape

### 1️⃣ Vérifier les logs Render

**C'est la chose LA PLUS IMPORTANTE à faire !**

**Allez sur Render Dashboard :**
```
https://dashboard.render.com/
```

**Étapes :**

1. **Sélectionnez votre service** (ex: `para-plus-api`)

2. **Cliquez sur "Logs"** (menu de gauche)

3. **Regardez les dernières lignes** - cherchez les erreurs en rouge

**Erreurs courantes dans les logs :**

#### ❌ Erreur : Variables d'environnement manquantes
```
django.core.exceptions.ImproperlyConfigured:
The SECRET_KEY setting must not be empty.
```

**Solution :** Ajouter `SECRET_KEY` dans Environment variables

---

#### ❌ Erreur : MongoDB connection failed
```
pymongo.errors.ServerSelectionTimeoutError:
[SSL: CERTIFICATE_VERIFY_FAILED]
```

**Solution :**
1. Vérifier `MONGODB_URI` dans Environment
2. MongoDB Atlas → Network Access → Ajouter `0.0.0.0/0`

---

#### ❌ Erreur : Module not found
```
ModuleNotFoundError: No module named 'cloudinary'
```

**Solution :** Vérifier `requirements.txt` et redéployer

---

#### ❌ Erreur : ALLOWED_HOSTS
```
django.core.exceptions.DisallowedHost:
Invalid HTTP_HOST header: 'para-plus-tn.onrender.com'
```

**Solution :**
```
ALLOWED_HOSTS=para-plus-tn.onrender.com,.onrender.com
```

---

### 2️⃣ Vérifier le statut du déploiement

**Sur Render Dashboard → Events :**

Cherchez :
- ✅ "Deploy succeeded" (bon)
- ❌ "Deploy failed" (problème de build)

**Si "Deploy failed" :**
1. Cliquez sur le déploiement échoué
2. Lisez les logs de build
3. Corrigez l'erreur (souvent dans requirements.txt)
4. Redéployez

---

### 3️⃣ Vérifier les variables d'environnement

**Render Dashboard → Environment**

**Variables OBLIGATOIRES :**

| Variable | Exemple | Status |
|----------|---------|--------|
| `SECRET_KEY` | `django-para-plus-prod-abc123...` | ⚠️ |
| `DEBUG` | `False` | ⚠️ |
| `ALLOWED_HOSTS` | `para-plus-tn.onrender.com,.onrender.com` | ⚠️ |
| `MONGODB_URI` | `mongodb+srv://...` | ⚠️ |
| `MONGODB_NAME` | `para_plus_db` | ⚠️ |
| `JWT_SECRET_KEY` | `jwt-para-plus-xyz789...` | ⚠️ |
| `CORS_ALLOWED_ORIGINS` | `https://para-plus-tn.vercel.app,...` | ⚠️ |
| `GOOGLE_CLIENT_ID` | `733593700986-...` | ✅ (optionnel pour /health/) |
| `GOOGLE_CLIENT_SECRET` | `GOCSPX-...` | ✅ (optionnel pour /health/) |

**Si une variable manque :**
1. Cliquez sur "Add Environment Variable"
2. Ajoutez la variable
3. Cliquez sur "Save"
4. Attendez le redéploiement automatique (2-3 min)

---

### 4️⃣ Générer des clés secrètes valides

**Problème courant :** `SECRET_KEY` et `JWT_SECRET_KEY` trop courtes ou invalides.

**Solution - Générer des clés robustes :**

**Méthode 1 - Python (recommandé) :**
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

**Méthode 2 - En ligne :**
```
https://djecrety.ir/
```

**Méthode 3 - Bash :**
```bash
openssl rand -base64 50
```

**Exemple de SECRET_KEY valide :**
```
django-para-plus-2026-prod-k9m2n8v7b6c5x4z3w2q1p0o9i8u7y6t5r4e3w2q1a2s3d4f5
```

---

## 🔧 Solutions par type d'erreur

### Solution A : Variables manquantes

**Ajoutez TOUTES ces variables sur Render :**

```bash
# Django Configuration
SECRET_KEY=django-para-plus-prod-[GENEREZ_UNE_CLE_DE_50_CARACTERES]
DEBUG=False
ALLOWED_HOSTS=para-plus-tn.onrender.com,.onrender.com,para-plus.tn

# MongoDB Atlas
MONGODB_URI=mongodb+srv://paraplus:VOTRE_MONGODB_PASSWORD@para-plus.g9zicn9.mongodb.net
MONGODB_NAME=para_plus_db

# JWT Configuration
JWT_SECRET_KEY=jwt-para-plus-secure-[AUTRE_CLE_ALEATOIRE_50_CHARS]

# CORS Configuration
CORS_ALLOWED_ORIGINS=https://para-plus-tn.vercel.app,https://para-plus.tn,http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=VOTRE_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=VOTRE_GOOGLE_CLIENT_SECRET

# Cloudinary (pour images)
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret

# Email (optionnel)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
DEFAULT_FROM_EMAIL=noreply@para-plus.tn
```

---

### Solution B : MongoDB Atlas Network Access

Si les logs montrent `ServerSelectionTimeoutError` :

**1. Allez sur MongoDB Atlas :**
```
https://cloud.mongodb.com/
```

**2. Sélectionnez votre cluster**

**3. Security → Network Access**

**4. Ajoutez une IP :**
- Cliquez sur "Add IP Address"
- Sélectionnez "Allow Access from Anywhere"
- IP Address: `0.0.0.0/0`
- Cliquez sur "Confirm"

**⚠️ Note :** En production, limitez les IPs pour plus de sécurité.

---

### Solution C : Problème de build

Si le build échoue sur Render :

**Vérifiez `requirements.txt` :**

```bash
# Doit contenir exactement :
Django==4.2.9
djangorestframework==3.14.0
django-cors-headers==4.3.1
mongoengine==0.28.2
pymongo==4.6.3
dnspython==2.6.1
djangorestframework-simplejwt==5.3.1
python-decouple==3.8
bcrypt==4.1.2
Pillow==10.4.0
cloudinary==1.41.0
django-cloudinary-storage==0.3.0
python-dateutil==2.8.2
pytz==2024.1
gunicorn==21.2.0
whitenoise==6.6.0
google-auth==2.28.0
google-auth-oauthlib==1.2.0
requests==2.31.0
```

**Vérifiez `runtime.txt` :**
```
python-3.11.9
```

**Vérifiez `build.sh` :**
```bash
#!/usr/bin/env bash
set -o errexit

pip install --upgrade pip
pip install -r requirements.txt
python manage.py collectstatic --no-input
```

---

### Solution D : Problème WSGI

**Vérifiez la Start Command sur Render :**
```
gunicorn paraplus.wsgi:application --bind 0.0.0.0:$PORT
```

**⚠️ Important :** `paraplus` doit correspondre au nom du dossier avec `wsgi.py`

---

## 🧪 Tests de vérification

### Test 1 : Build réussi ?

**Render → Events → Dernier déploiement**

Devrait afficher :
```
✅ Deploy succeeded
```

Si non, lisez les logs de build.

---

### Test 2 : Service actif ?

**Render → Overview → Status**

Devrait afficher :
```
🟢 Live
```

Si "Suspended" ou "Failed", vérifiez les logs.

---

### Test 3 : Health endpoint

**Dans votre navigateur :**
```
https://para-plus-tn.onrender.com/health/
```

Devrait afficher :
```json
{"status": "ok", "service": "para-plus-api"}
```

Si erreur 500, regardez les logs Render !

---

### Test 4 : Logs en temps réel

**Render → Logs → Tail logs**

Ouvrez dans un onglet et laissez ouvert.
Puis testez `/health/` dans un autre onglet.
Vous verrez l'erreur exacte dans les logs !

---

## 📋 Checklist de résolution

- [ ] Aller sur Render Dashboard
- [ ] Vérifier Events → Deploy succeeded ?
- [ ] Vérifier Logs → Quelle erreur exacte ?
- [ ] Vérifier Environment → Toutes les variables présentes ?
- [ ] SECRET_KEY généré correctement (50+ caractères) ?
- [ ] ALLOWED_HOSTS contient `para-plus-tn.onrender.com` ?
- [ ] MONGODB_URI correct ?
- [ ] MongoDB Atlas Network Access = `0.0.0.0/0` ?
- [ ] requirements.txt complet ?
- [ ] runtime.txt = `python-3.11.9` ?
- [ ] Start Command correct ?
- [ ] Redéployer après modifications
- [ ] Attendre 2-3 minutes
- [ ] Tester `/health/` à nouveau

---

## 🎯 Actions immédiates

**1. Allez sur Render Dashboard → Logs MAINTENANT**

Copiez les 20 dernières lignes et envoyez-les moi.

**2. Vérifiez Environment → Variables**

Dites-moi quelles variables sont configurées.

**3. Vérifiez Events**

Le dernier déploiement a-t-il réussi ou échoué ?

---

## 💡 Astuce

**Pour voir l'erreur exacte en temps réel :**

1. Render → Logs → Laissez ouvert
2. Dans un autre onglet : `https://para-plus-tn.onrender.com/health/`
3. Revenez aux logs
4. L'erreur Django apparaîtra en rouge avec le traceback complet

**Envoyez-moi cette erreur et je pourrai vous aider précisément !**

---

## 🆘 Si vous êtes bloqué

**Envoyez-moi :**
1. Screenshot des logs Render (dernières lignes en rouge)
2. Liste des variables d'environnement configurées
3. Statut du dernier déploiement (succeeded/failed)

Je vous aiderai à résoudre le problème !

---

**Note :** Sans accès aux logs Render, impossible de diagnostiquer précisément. Les logs contiennent l'erreur exacte !
