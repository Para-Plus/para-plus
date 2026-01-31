# 🔐 Configuration Google OAuth - Guide Rapide

## 📋 Étapes de Configuration

### 1️⃣ Créer un Projet Google Cloud

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Cliquez sur le menu déroulant du projet (en haut)
3. Cliquez sur **"Nouveau projet"**
4. Nom : `Para-plus-TN`
5. Cliquez sur **"Créer"**

### 2️⃣ Activer l'API Google Identity

1. Dans le menu ☰ → **"APIs & Services"** → **"Bibliothèque"**
2. Recherchez **"Google Identity"** ou **"Google+ API"**
3. Cliquez sur **"Activer"**

### 3️⃣ Créer des Identifiants OAuth 2.0

1. Menu ☰ → **"APIs & Services"** → **"Identifiants"**
2. Cliquez sur **"+ Créer des identifiants"**
3. Sélectionnez **"ID client OAuth"**
4. Si demandé, configurez d'abord l'écran de consentement :
   - Type d'utilisateur : **Externe**
   - Nom de l'application : `Para-plus.tn`
   - E-mail d'assistance : votre email
   - Domaines autorisés :
     - `para-plus.tn`
     - `vercel.app`
   - Champs d'application :
     - ✅ email
     - ✅ profile
     - ✅ openid

5. Créer les identifiants :
   - Type d'application : **Application Web**
   - Nom : `Para-plus Web Client`

### 4️⃣ Configurer les URLs

#### Origines JavaScript autorisées :
```
http://localhost:3000
http://localhost:8000
https://para-plus.tn
https://para-plus-tn.vercel.app
https://para-plus-api.onrender.com
```

#### URI de redirection autorisées :
```
http://localhost:3000
http://localhost:3000/connexion
http://localhost:3000/inscription
https://para-plus.tn
https://para-plus-tn.vercel.app
```

### 5️⃣ Copier les Identifiants

Après la création, vous obtiendrez :

```
Client ID : 123456789-abcdefghijklmnop.apps.googleusercontent.com
Client Secret : GOCSPX-xxxxxxxxxxxxxxxxxxxx
```

⚠️ **IMPORTANT** : Gardez ces informations secrètes !

### 6️⃣ Configurer les Variables d'Environnement

#### Backend (`backend/.env`)
```env
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxx
```

#### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
```

### 7️⃣ Tester Localement

```bash
# Terminal 1 - Backend
cd backend
python manage.py runserver

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Allez sur http://localhost:3000/connexion et testez le bouton Google !

---

## 🚀 Déploiement en Production

### Sur Render.com (Backend)

1. Dashboard Render → Votre service
2. **Environment** → **Add Environment Variable**
3. Ajoutez :
   ```
   GOOGLE_CLIENT_ID = votre_client_id
   GOOGLE_CLIENT_SECRET = votre_client_secret
   ```

### Sur Vercel (Frontend)

1. Dashboard Vercel → Votre projet → **Settings** → **Environment Variables**
2. Ajoutez :
   ```
   NEXT_PUBLIC_GOOGLE_CLIENT_ID = votre_client_id
   ```

### Mettre à jour Google Cloud Console

Retournez sur Google Cloud Console → **Identifiants** → Votre OAuth Client ID

Ajoutez vos URLs de production :

**Origines JavaScript** :
```
https://para-plus-api.onrender.com
https://para-plus-tn.vercel.app
https://para-plus.tn
```

**URI de redirection** :
```
https://para-plus-tn.vercel.app
https://para-plus.tn
```

---

## ✅ Vérification

Pour vérifier que tout fonctionne :

1. ✅ Bouton Google s'affiche sur la page de connexion
2. ✅ Clic sur le bouton ouvre la popup Google
3. ✅ Après connexion, redirection vers la page d'accueil
4. ✅ L'utilisateur est créé dans MongoDB avec `auth_provider: 'google'`
5. ✅ Le JWT est généré et stocké
6. ✅ La photo de profil Google est sauvegardée

---

## 🐛 Dépannage

### Erreur : "redirect_uri_mismatch"
→ Vérifiez que l'URL dans Google Cloud Console correspond EXACTEMENT à celle utilisée

### Erreur : "Invalid Client ID"
→ Vérifiez que `NEXT_PUBLIC_GOOGLE_CLIENT_ID` est correct

### Le bouton ne s'affiche pas
→ Ouvrez la console du navigateur (F12) pour voir les erreurs
→ Vérifiez que la variable d'environnement est bien définie

### Erreur : "Token validation failed"
→ Vérifiez que le `GOOGLE_CLIENT_ID` backend correspond au frontend

---

## 📚 Ressources

- [Google Cloud Console](https://console.cloud.google.com/)
- [Documentation Google OAuth](https://developers.google.com/identity/protocols/oauth2)
- [Documentation @react-oauth/google](https://www.npmjs.com/package/@react-oauth/google)

---

## 🎯 Fonctionnalités

✅ Connexion avec Google en un clic
✅ Inscription automatique (nouveau compte)
✅ Liaison de compte (email existant)
✅ Photo de profil récupérée
✅ Email vérifié automatiquement
✅ One-Tap connexion automatique

---

**Besoin d'aide ?** Contactez l'équipe de développement.
