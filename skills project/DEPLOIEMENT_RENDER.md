# 🚀 Déploiement de Para-plus sur Render.com

Guide complet pour déployer le backend Django sur Render avec gestion des images via Cloudinary.

---

## 📋 Pré-requis

1. ✅ Compte GitHub (votre code est déjà poussé)
2. ✅ Compte MongoDB Atlas (base de données configurée)
3. ✅ Compte Google Cloud Console (OAuth configuré)
4. 🆕 Compte Render.com (gratuit)
5. 🆕 Compte Cloudinary (gratuit)

---

## 🌥️ ÉTAPE 1: Créer un compte Cloudinary

### Pourquoi Cloudinary?
Sur Render, le système de fichiers est **éphémère** - les images uploadées disparaissent au redémarrage du serveur. Il faut donc un stockage cloud permanent.

### Configuration Cloudinary

1. **Créer un compte gratuit:**
   - Allez sur [https://cloudinary.com](https://cloudinary.com)
   - Cliquez sur **"Sign Up for Free"**
   - Inscrivez-vous (Email ou Google)

2. **Récupérer les credentials:**
   - Une fois connecté, allez sur le Dashboard
   - Vous verrez une section **"Account Details"**
   - Notez ces 3 valeurs:
     ```
     Cloud Name: dxxxxxxxxx
     API Key: 123456789012345
     API Secret: aBcDeFgHiJkLmNoPqRsTuVwXyZ
     ```

3. **Optionnel - Configurer les transformations:**
   - Settings → Upload → Upload presets
   - Créer un preset pour optimiser les images produits
   - Taille recommandée: 800x800px, qualité: 80%

---

## 🔧 ÉTAPE 2: Préparer le projet

### 1. Vérifier les fichiers

Assurez-vous que ces fichiers existent dans `backend/`:

**✅ `requirements.txt`** (déjà mis à jour avec Cloudinary)
```txt
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

**✅ `build.sh`** (si pas déjà créé)
```bash
#!/usr/bin/env bash
# exit on error
set -o errexit

pip install -r requirements.txt

# Collecter les fichiers statiques
python manage.py collectstatic --no-input
```

**✅ `wsgi.py`** (dans `paraplus/wsgi.py` - déjà configuré)

### 2. Pousser sur GitHub

```bash
git add .
git commit -m "Config: Cloudinary storage for production images"
git push origin main
```

---

## 🚀 ÉTAPE 3: Créer le service sur Render

### 1. Se connecter à Render

1. Allez sur [https://render.com](https://render.com)
2. Cliquez sur **"Get Started for Free"**
3. Connectez-vous avec GitHub

### 2. Créer un nouveau Web Service

1. Sur le dashboard Render, cliquez sur **"New +"**
2. Sélectionnez **"Web Service"**
3. Connectez votre repository GitHub `para-plus`
4. Si le repo n'apparaît pas:
   - Cliquez sur **"Configure account"**
   - Donnez accès à votre repository

### 3. Configurer le service

Remplissez les champs:

| Champ | Valeur |
|-------|--------|
| **Name** | `para-plus-api` |
| **Region** | `Frankfurt (EU Central)` ou proche de vous |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Python 3` |
| **Build Command** | `bash build.sh` |
| **Start Command** | `gunicorn paraplus.wsgi:application --bind 0.0.0.0:$PORT` |
| **Instance Type** | `Free` |

---

## 🔐 ÉTAPE 4: Configurer les variables d'environnement

Dans Render, section **Environment**, ajoutez ces variables:

### Variables essentielles

```bash
# Django Configuration
SECRET_KEY=votre-cle-secrete-tres-longue-et-aleatoire-changez-moi
DEBUG=False
ALLOWED_HOSTS=para-plus-api.onrender.com,.onrender.com,para-plus.tn,api.para-plus.tn

# MongoDB Atlas
MONGODB_URI=mongodb+srv://paraplus:VOTRE_MONGODB_PASSWORD@para-plus.g9zicn9.mongodb.net
MONGODB_NAME=para_plus_db

# JWT
JWT_SECRET_KEY=votre-jwt-secret-key-changez-aussi

# CORS (URLs frontend)
CORS_ALLOWED_ORIGINS=https://para-plus-tn.vercel.app,https://para-plus.tn,http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=VOTRE_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=VOTRE_GOOGLE_CLIENT_SECRET

# Cloudinary (IMPORTANT!)
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret

# Email (optionnel pour l'instant)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=
EMAIL_HOST_PASSWORD=
DEFAULT_FROM_EMAIL=noreply@para-plus.tn
```

### ⚠️ IMPORTANT: Générer de nouvelles clés secrètes

**Ne réutilisez PAS les clés de développement en production!**

Pour générer `SECRET_KEY` et `JWT_SECRET_KEY`:

```bash
# Ouvrir un terminal Python
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

---

## ✅ ÉTAPE 5: Déployer

1. Cliquez sur **"Create Web Service"**
2. Render va:
   - Cloner votre repository
   - Installer les dépendances
   - Exécuter `build.sh`
   - Lancer le serveur avec Gunicorn

3. **Suivez les logs** dans la section "Logs"
   - Recherchez les erreurs éventuelles
   - Le déploiement prend ~3-5 minutes

4. **Votre API sera disponible à:**
   ```
   https://para-plus-api.onrender.com
   ```

---

## 🧪 ÉTAPE 6: Tester le déploiement

### 1. Health Check

```bash
curl https://para-plus-api.onrender.com/health/
```

Réponse attendue:
```json
{"status": "ok", "service": "para-plus-api"}
```

### 2. Tester l'API Produits

```bash
# Lister les produits
curl https://para-plus-api.onrender.com/api/produits/

# Lister les catégories
curl https://para-plus-api.onrender.com/api/produits/categories/
```

### 3. Créer des données de test

**Option A: Via la console Render**

1. Dans Render → Votre service → Shell
2. Exécutez:
```bash
python create_test_data.py
```

**Option B: Créer un vendeur manuellement**

Via l'API:
```bash
curl -X POST https://para-plus-api.onrender.com/api/auth/inscription/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "vendeur@test.com",
    "mot_de_passe": "Test123456!",
    "prenom": "Vendeur",
    "nom": "Test",
    "role": "vendeur",
    "telephone": "12345678"
  }'
```

### 4. Tester l'upload d'images

1. Connectez-vous en tant que vendeur
2. Uploadez une image:

```bash
# D'abord se connecter
TOKEN=$(curl -X POST https://para-plus-api.onrender.com/api/auth/connexion/ \
  -H "Content-Type: application/json" \
  -d '{"email": "vendeur@test.com", "mot_de_passe": "Test123456!"}' \
  | jq -r '.access')

# Puis uploader une image
curl -X POST https://para-plus-api.onrender.com/api/produits/upload-image/ \
  -H "Authorization: Bearer $TOKEN" \
  -F "image=@/path/to/image.jpg"
```

L'image sera uploadée sur Cloudinary et l'URL ressemblera à:
```
https://res.cloudinary.com/dxxxxxxxxx/image/upload/v1234567890/produits/uuid.jpg
```

---

## 🔄 ÉTAPE 7: Mettre à jour Google OAuth

Retournez sur [Google Cloud Console](https://console.cloud.google.com):

1. **APIs & Services** → **Identifiants**
2. Cliquez sur votre **OAuth 2.0 Client ID**
3. Ajoutez dans **Origines JavaScript autorisées:**
   ```
   https://para-plus-api.onrender.com
   ```
4. Ajoutez dans **URI de redirection autorisées:**
   ```
   https://para-plus-api.onrender.com/api/auth/google/
   ```
5. Cliquez sur **Enregistrer**

---

## 🌐 ÉTAPE 8: Configurer le Frontend (Vercel)

### Mettre à jour les variables d'environnement

Dans Vercel → Votre projet → **Settings** → **Environment Variables**:

```bash
NEXT_PUBLIC_API_URL=https://para-plus-api.onrender.com/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=VOTRE_GOOGLE_CLIENT_ID
```

### Redéployer le frontend

```bash
# Dans le dossier frontend
git add .
git commit -m "Config: Update API URL for production"
git push origin main
```

Vercel redéployera automatiquement.

---

## 🐛 Dépannage

### Erreur: "Application failed to start"

**Vérifier les logs:**
- Render → Logs
- Recherchez l'erreur exacte

**Causes courantes:**
1. Variable d'environnement manquante
2. Erreur dans `requirements.txt`
3. Erreur dans `build.sh`

### Erreur: "No module named X"

**Solution:** Vérifiez `requirements.txt` et redéployez

### Images ne s'uploadent pas

**Vérifier:**
1. Variables Cloudinary correctement configurées
2. Logs Cloudinary: Dashboard → Reports → Usage
3. Quota Cloudinary non dépassé (25GB gratuit)

### MongoDB connection failed

**Vérifier:**
1. `MONGODB_URI` correct
2. MongoDB Atlas → Network Access → Whiteliste IP `0.0.0.0/0` (autoriser toutes les IPs)
3. Utilisateur MongoDB a les bonnes permissions

### CORS Errors

**Vérifier:**
1. `CORS_ALLOWED_ORIGINS` contient l'URL de votre frontend
2. Format: `https://para-plus-tn.vercel.app` (sans trailing slash)

---

## 📊 Monitoring et Logs

### Voir les logs en temps réel

Render → Votre service → **Logs**

### Alertes

Render → Votre service → **Settings** → **Alerts**
- Configurez des alertes email si le service tombe

### Métriques

Render → Votre service → **Metrics**
- CPU, Mémoire, Requêtes

---

## 💰 Plan Gratuit Render

### Limitations du plan gratuit:

- ⏰ Le service s'endort après 15 minutes d'inactivité
- ⚡ Redémarrage lent (~30-60 secondes)
- 🔄 Redémarrages automatiques quotidiens
- 💾 750 heures/mois de service gratuit

### Solutions:

1. **Garder le service actif** (ping toutes les 14 min)
2. **Upgrader vers plan payant** ($7/mois)
   - Pas de mise en veille
   - Plus de ressources
   - Support prioritaire

---

## ✅ Checklist finale

- [ ] Cloudinary configuré et testé
- [ ] Service Render créé et déployé
- [ ] Toutes les variables d'environnement ajoutées
- [ ] Health check fonctionne
- [ ] API Produits répond
- [ ] Upload d'images fonctionne (Cloudinary)
- [ ] Google OAuth mis à jour
- [ ] Frontend configuré avec nouvelle API URL
- [ ] MongoDB Atlas accessible depuis Render
- [ ] CORS configuré correctement

---

## 🎯 URLs Finales

| Service | URL | Status |
|---------|-----|--------|
| **Backend API** | https://para-plus-api.onrender.com | ✅ |
| **Health Check** | https://para-plus-api.onrender.com/health/ | ✅ |
| **API Produits** | https://para-plus-api.onrender.com/api/produits/ | ✅ |
| **Frontend** | https://para-plus-tn.vercel.app | ✅ |
| **MongoDB** | mongodb+srv://para-plus.g9zicn9.mongodb.net | ✅ |
| **Cloudinary** | https://res.cloudinary.com/[your-cloud-name] | ✅ |

---

## 📚 Ressources

- [Documentation Render](https://render.com/docs)
- [Documentation Cloudinary](https://cloudinary.com/documentation)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Google Cloud Console](https://console.cloud.google.com)

---

## 🆘 Besoin d'aide?

1. Vérifiez les logs Render
2. Vérifiez les variables d'environnement
3. Testez en local d'abord
4. Consultez la documentation Render

---

**Votre API Para-plus est maintenant déployée et prête à être utilisée! 🎉**
