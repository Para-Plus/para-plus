# 🔧 Fix Erreur CORS - Render Backend

## ❌ Erreur actuelle

```
Access to XMLHttpRequest at 'https://para-plus-tn.onrender.com/auth/google/'
from origin 'https://para-plus-tn.vercel.app' has been blocked by CORS policy:
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## 🔍 Diagnostic

**Problème :** Le backend Render ne renvoie pas les bons headers CORS pour autoriser les requêtes depuis Vercel.

**Cause :** La variable d'environnement `CORS_ALLOWED_ORIGINS` n'est pas configurée sur Render OU ne contient pas `https://para-plus-tn.vercel.app`.

---

## ✅ Solution : Configurer CORS sur Render

### 1️⃣ Vérifier si le backend est déployé

**Test rapide :**
1. Ouvrez votre navigateur
2. Allez sur : `https://para-plus-tn.onrender.com/health/`
3. Vous devriez voir : `{"status": "ok", "service": "para-plus-api"}`

**Si ça ne fonctionne pas :**
- Le backend n'est pas encore déployé sur Render
- Suivez le guide [DEPLOIEMENT_RENDER.md](DEPLOIEMENT_RENDER.md) d'abord

---

### 2️⃣ Configurer les variables d'environnement Render

**Allez sur Render Dashboard :**
```
https://dashboard.render.com/
```

**Étapes :**

1. **Sélectionnez votre service** (ex: `para-plus-api`)

2. **Allez dans "Environment"** (menu de gauche)

3. **Vérifiez/Ajoutez la variable `CORS_ALLOWED_ORIGINS`** :

   | Key | Value |
   |-----|-------|
   | `CORS_ALLOWED_ORIGINS` | `https://para-plus-tn.vercel.app,https://para-plus.tn,http://localhost:3000` |

   **⚠️ IMPORTANT :**
   - Pas d'espaces entre les URLs
   - Séparez avec des virgules
   - Incluez le protocole (`https://` ou `http://`)
   - PAS de slash à la fin

4. **Cliquez sur "Save Changes"**

5. **Le service va redéployer automatiquement** (~2-3 minutes)

---

### 3️⃣ Variables d'environnement complètes pour Render

Voici TOUTES les variables nécessaires sur Render :

```bash
# Django Configuration
SECRET_KEY=django-para-plus-prod-GENEREZ-UNE-CLE-TRES-LONGUE-ET-ALEATOIRE
DEBUG=False
ALLOWED_HOSTS=para-plus-tn.onrender.com,.onrender.com,para-plus.tn,api.para-plus.tn

# MongoDB Atlas
MONGODB_URI=mongodb+srv://paraplus:VOTRE_MONGODB_PASSWORD@para-plus.g9zicn9.mongodb.net
MONGODB_NAME=para_plus_db

# JWT Configuration
JWT_SECRET_KEY=jwt-para-plus-GENEREZ-AUSSI-UNE-CLE-DIFFERENTE

# CORS Configuration (IMPORTANT!)
CORS_ALLOWED_ORIGINS=https://para-plus-tn.vercel.app,https://para-plus.tn,http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=VOTRE_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=VOTRE_GOOGLE_CLIENT_SECRET

# Cloudinary (pour stockage images)
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

**⚠️ Générer des clés sécurisées :**

Pour `SECRET_KEY` et `JWT_SECRET_KEY`, utilisez :
```python
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

---

### 4️⃣ Tester après le redéploiement

**Attendez 2-3 minutes** que Render redéploie, puis testez :

**Test 1 - Health Check :**
```bash
curl https://para-plus-tn.onrender.com/health/
```

Résultat attendu :
```json
{"status": "ok", "service": "para-plus-api"}
```

**Test 2 - Headers CORS :**
```bash
curl -I -X OPTIONS https://para-plus-tn.onrender.com/api/auth/google/ \
  -H "Origin: https://para-plus-tn.vercel.app" \
  -H "Access-Control-Request-Method: POST"
```

Vous devriez voir :
```
Access-Control-Allow-Origin: https://para-plus-tn.vercel.app
Access-Control-Allow-Credentials: true
```

**Test 3 - Depuis le navigateur :**

1. Allez sur `https://para-plus-tn.vercel.app/connexion`
2. Ouvrez la console (F12)
3. Cliquez sur le bouton Google
4. **Vous ne devriez PLUS voir l'erreur CORS**

---

## 🐛 Dépannage

### Problème 1 : L'erreur CORS persiste

**Solutions :**

1. **Vérifiez que le service a bien redéployé :**
   - Render Dashboard → Logs
   - Cherchez "Deploy succeeded"

2. **Vérifiez la variable CORS_ALLOWED_ORIGINS :**
   - Environment → CORS_ALLOWED_ORIGINS
   - Valeur exacte : `https://para-plus-tn.vercel.app,https://para-plus.tn,http://localhost:3000`
   - Pas d'espaces, pas de slash final

3. **Redéployez manuellement :**
   - Render Dashboard → Manual Deploy → Deploy latest commit

4. **Videz le cache du navigateur :**
   - Ctrl + Shift + Delete
   - Cochez "Cache"
   - Redémarrez le navigateur

---

### Problème 2 : Le backend ne répond pas

**Vérifications :**

1. **Le service est-il actif ?**
   - Render Dashboard → Status devrait être "Live"

2. **Les logs montrent-ils des erreurs ?**
   - Render Dashboard → Logs
   - Cherchez les erreurs Django/Gunicorn

3. **Le build a-t-il réussi ?**
   - Render Dashboard → Events
   - Dernière ligne devrait être "Deploy succeeded"

**Erreurs courantes dans les logs :**

**Erreur : "No module named 'X'"**
```
Solution : Vérifiez requirements.txt et redéployez
```

**Erreur : "Invalid HTTP_HOST header"**
```
Solution : Vérifiez ALLOWED_HOSTS dans les variables d'environnement
```

**Erreur : "pymongo.errors.ServerSelectionTimeoutError"**
```
Solution :
1. Vérifiez MONGODB_URI
2. MongoDB Atlas → Network Access → Ajoutez 0.0.0.0/0
```

---

### Problème 3 : Service Render inactif (sleeping)

Le plan gratuit Render met le service en veille après 15 minutes d'inactivité.

**Solution temporaire :**
- Attendez 30-60 secondes que le service se réveille
- Rechargez la page

**Solution permanente (payante) :**
- Upgrade vers plan Starter ($7/mois)
- Pas de mise en veille
- Plus de ressources

---

## 📋 Checklist de résolution CORS

- [ ] Backend déployé sur Render et actif
- [ ] Variable `CORS_ALLOWED_ORIGINS` configurée
- [ ] Valeur contient `https://para-plus-tn.vercel.app`
- [ ] Pas d'espaces dans la valeur CORS
- [ ] Service redéployé après modification
- [ ] Attendu 2-3 minutes après le redéploiement
- [ ] Cache du navigateur vidé
- [ ] Test curl montre les bons headers CORS
- [ ] Test depuis Vercel fonctionne

---

## 🎯 Configuration finale attendue

**Render Environment Variables :**
```
CORS_ALLOWED_ORIGINS = https://para-plus-tn.vercel.app,https://para-plus.tn,http://localhost:3000
```

**Vercel Environment Variables :**
```
NEXT_PUBLIC_API_URL = https://para-plus-tn.onrender.com/api
```

**Google Cloud Console - Authorized JavaScript origins :**
```
https://para-plus-tn.vercel.app
http://localhost:3000
```

**Tout doit correspondre exactement !**

---

## ✅ Résultat attendu

Après avoir suivi ces étapes :

1. ✅ Le backend Render répond avec les bons headers CORS
2. ✅ Le frontend Vercel peut faire des requêtes à l'API
3. ✅ La connexion Google fonctionne sans erreur CORS
4. ✅ Les utilisateurs peuvent se connecter/s'inscrire

---

## 💡 Astuce

Pour déboguer les problèmes CORS en temps réel :

**Console du navigateur (F12) :**
```javascript
// Tester une requête depuis le frontend
fetch('https://para-plus-tn.onrender.com/api/auth/google/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ credential: 'test' })
})
.then(r => console.log('Success:', r))
.catch(e => console.error('Error:', e))
```

Si vous voyez une erreur CORS, le problème vient de Render.
Si vous voyez une erreur 400/401 (validation), CORS fonctionne !

---

**Une fois résolu, supprimez ce fichier !**
