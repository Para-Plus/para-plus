# 🐛 Debug Erreur 401: invalid_client

## ❌ Erreur actuelle

```
Erreur 401 : invalid_client
Détails de la requête : flowName=GeneralOAuthFlow
```

Cette erreur signifie que le **Client ID** ou **Client Secret** ne correspond pas entre :
- Le code de votre application (Vercel/Frontend)
- Google Cloud Console

---

## 🔍 Étapes de vérification

### 1️⃣ Vérifier les identifiants dans Google Cloud Console

**Allez sur :**
```
https://console.cloud.google.com/apis/credentials
```

**Actions :**
1. Connectez-vous avec le bon compte Google
2. Sélectionnez le bon projet
3. Dans la liste "OAuth 2.0 Client IDs", trouvez votre client
4. **VÉRIFIEZ et NOTEZ** :
   - Le **Client ID complet** (doit se terminer par `.apps.googleusercontent.com`)
   - Le **Client Secret** (cliquez sur "Show secret" si nécessaire)

**Questions importantes :**
- ✅ Est-ce que le Client ID commence bien par `733593700986-` ?
- ✅ Est-ce que le Client Secret commence bien par `GOCSPX-` ?
- ✅ Y a-t-il plusieurs OAuth Clients créés ? (utilisez-vous le bon ?)

---

### 2️⃣ Vérifier les variables d'environnement Vercel

**Sur Vercel Dashboard :**
1. Votre projet → **Settings** → **Environment Variables**
2. Vérifiez que `NEXT_PUBLIC_GOOGLE_CLIENT_ID` est **exactement** le même que dans Google Cloud Console
3. Si ce n'est pas le cas, modifiez-le

**Test rapide :**
Ouvrez la console du navigateur (F12) sur votre site Vercel et tapez :
```javascript
console.log(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)
```

Comparez le résultat avec le Client ID dans Google Cloud Console. Ils doivent être **IDENTIQUES**.

---

### 3️⃣ Vérifier le backend (Render)

Si vous utilisez le backend pour la validation OAuth :

**Sur Render Dashboard :**
1. Votre service → **Environment**
2. Vérifiez que :
   - `GOOGLE_CLIENT_ID` = même valeur que Vercel
   - `GOOGLE_CLIENT_SECRET` = valeur correcte de Google Cloud Console

---

## 🔧 Solutions possibles

### Solution A : Identifiants incorrects

Si les identifiants fournis (`733593700986-...`) ne sont **PAS** ceux de votre projet Google Cloud :

1. Allez sur Google Cloud Console
2. Copiez les **VRAIS** identifiants
3. Mettez-les à jour sur Vercel :
   ```
   NEXT_PUBLIC_GOOGLE_CLIENT_ID = [le vrai Client ID]
   ```
4. Redéployez Vercel

---

### Solution B : Créer de nouveaux identifiants

Si vous avez perdu les identifiants ou si le projet n'existe plus :

**1. Créer un nouveau OAuth Client**

Sur Google Cloud Console → APIs & Services → Credentials :

1. Cliquez sur **"+ Create Credentials"**
2. Sélectionnez **"OAuth client ID"**
3. Type d'application : **"Web application"**
4. Nom : `Para-plus Production`

**2. Configurer les URLs**

**Authorized JavaScript origins :**
```
https://para-plus-tn.vercel.app
http://localhost:3000
```

**Authorized redirect URIs :**
```
https://para-plus-tn.vercel.app
https://para-plus-tn.vercel.app/connexion
https://para-plus-tn.vercel.app/inscription
http://localhost:3000
http://localhost:3000/connexion
```

**3. Copier les nouveaux identifiants**

Après création, vous obtiendrez :
```
Client ID: 123456789-xxxxxx.apps.googleusercontent.com
Client Secret: GOCSPX-xxxxxx
```

**4. Mettre à jour partout**

**Vercel :**
```
NEXT_PUBLIC_GOOGLE_CLIENT_ID = [nouveau Client ID]
```

**Render (si utilisé) :**
```
GOOGLE_CLIENT_ID = [nouveau Client ID]
GOOGLE_CLIENT_SECRET = [nouveau Client Secret]
```

**Local (backend/.env) :**
```
GOOGLE_CLIENT_ID=[nouveau Client ID]
GOOGLE_CLIENT_SECRET=[nouveau Client Secret]
```

**Local (frontend/.env.local) :**
```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=[nouveau Client ID]
```

---

## 📋 Checklist de résolution

- [ ] Aller sur Google Cloud Console → Credentials
- [ ] Vérifier quel est le VRAI Client ID actuel
- [ ] Comparer avec ce qui est configuré sur Vercel
- [ ] Si différent, mettre à jour sur Vercel
- [ ] Vérifier les origines JavaScript autorisées dans Google Cloud
- [ ] Vérifier les URI de redirection
- [ ] Redéployer Vercel après modification
- [ ] Vider le cache du navigateur
- [ ] Tester à nouveau

---

## 🧪 Test de diagnostic

Pour être sûr que le problème vient des identifiants :

**1. Sur votre site Vercel, ouvrez la console (F12)**

**2. Avant de cliquer sur le bouton Google, tapez :**
```javascript
console.log('Client ID utilisé:', process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)
```

**3. Allez sur Google Cloud Console et comparez**

Si les deux ne sont **PAS identiques** → C'est le problème !

---

## ⚠️ Erreurs fréquentes

### Erreur 1 : Espaces ou retours à la ligne
```
❌ "733593700986-xxx.apps.googleusercontent.com "  (espace à la fin)
✅ "733593700986-xxx.apps.googleusercontent.com"   (correct)
```

### Erreur 2 : Mauvais projet Google Cloud
Si vous avez plusieurs projets Google Cloud, assurez-vous d'utiliser les identifiants du bon projet.

### Erreur 3 : Variables Vercel non redéployées
Après avoir modifié les variables Vercel, vous DEVEZ redéployer pour que les changements prennent effet.

---

## 🎯 Actions immédiates

**1. Vérifiez maintenant sur Google Cloud Console :**
- Quel est le Client ID EXACT ?
- Est-ce vraiment `VOTRE_GOOGLE_CLIENT_ID` ?

**2. Vérifiez sur Vercel :**
- Settings → Environment Variables → NEXT_PUBLIC_GOOGLE_CLIENT_ID
- Est-ce la même valeur ?

**3. Si ce n'est PAS la même valeur :**
- Mettez à jour sur Vercel avec la bonne valeur
- Redéployez

**4. Si c'est la même valeur :**
- Le problème vient probablement du Client Secret (côté backend)
- OU les identifiants sont invalides/désactivés dans Google Cloud

---

## 💡 Besoin d'aide ?

**Répondez à ces questions :**

1. Quel est le Client ID affiché dans Google Cloud Console ?
2. Y a-t-il plusieurs OAuth Clients dans votre projet ?
3. Quelle est l'URL exacte de votre déploiement Vercel ?
4. Avez-vous récemment créé ces identifiants ou sont-ils anciens ?

---

**Une fois résolu, supprimez ce fichier !**
