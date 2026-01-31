# 🔧 Correction Erreur Google OAuth - origin_mismatch

## ❌ Erreur Actuelle

```
You can't sign in to this app because it doesn't comply with Google's OAuth 2.0 policy.
Error 400: origin_mismatch
```

Cette erreur signifie que votre URL Vercel n'est pas enregistrée dans Google Cloud Console.

---

## ✅ Solution - Configurer Google Cloud Console

### 📍 Identifiants actuels

```
Client ID: VOTRE_GOOGLE_CLIENT_ID
Client Secret: VOTRE_GOOGLE_CLIENT_SECRET
```

### 🔗 Étapes de configuration

**1. Ouvrez Google Cloud Console**
```
https://console.cloud.google.com/apis/credentials
```

**2. Sélectionnez le bon projet**
- Connectez-vous avec le compte qui a créé ces identifiants
- Vérifiez que vous êtes sur le bon projet

**3. Trouvez votre OAuth 2.0 Client ID**
- Dans la liste "OAuth 2.0 Client IDs"
- Cherchez celui qui commence par `733593700986-...`
- Cliquez dessus pour l'éditer

**4. Ajoutez les URLs Vercel**

Dans **"Origines JavaScript autorisées" (Authorized JavaScript origins)** :

```
https://para-plus-tn.vercel.app
http://localhost:3000
```

⚠️ **Important :** Vérifiez que l'URL Vercel est EXACTEMENT celle-ci. Si vous avez un domaine différent, utilisez le bon.

**5. Ajoutez les URI de redirection**

Dans **"URI de redirection autorisées" (Authorized redirect URIs)** :

```
https://para-plus-tn.vercel.app
https://para-plus-tn.vercel.app/connexion
https://para-plus-tn.vercel.app/inscription
http://localhost:3000
http://localhost:3000/connexion
http://localhost:3000/inscription
```

**6. Enregistrez**
- Cliquez sur **"Enregistrer" / "Save"** en bas
- ⏳ Attendez 5-10 minutes pour que les changements se propagent

---

## 🔍 Comment trouver votre URL Vercel exacte ?

Si vous n'êtes pas sûr de l'URL Vercel :

1. Allez sur [vercel.com/dashboard](https://vercel.com/dashboard)
2. Cliquez sur votre projet
3. L'URL sera affichée en haut (exemple : `para-plus-tn.vercel.app`)
4. Copiez cette URL et utilisez-la dans Google Cloud Console

**Formats possibles :**
- `https://para-plus-tn.vercel.app` ✅
- `https://para-plus-git-main-votrenom.vercel.app` ✅ (preview)
- `https://votre-domaine-custom.com` ✅ (domaine personnalisé)

---

## ⚙️ Variables d'environnement Vercel

Après avoir configuré Google Cloud Console, configurez aussi Vercel :

**Sur Vercel Dashboard :**
1. Votre projet → **Settings** → **Environment Variables**
2. Ajoutez ces 3 variables :

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_API_URL` | `https://para-plus-tn.onrender.com/api` | Production, Preview, Development |
| `NEXT_PUBLIC_SITE_URL` | `https://para-plus-tn.vercel.app` | Production |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | `VOTRE_GOOGLE_CLIENT_ID` | Production, Preview, Development |

3. **Redéployez** après avoir ajouté les variables :
   - Deployments → ... → Redeploy

---

## 🧪 Test après configuration

**1. Attendez 5-10 minutes**
- Les changements Google Cloud prennent du temps

**2. Videz le cache du navigateur**
```
Ctrl + Shift + Delete (Chrome/Edge)
Cmd + Shift + Delete (Mac)
```

**3. Testez la connexion**
- Allez sur `https://para-plus-tn.vercel.app/connexion`
- Cliquez sur le bouton "Connexion avec Google"
- Vous devriez voir la popup Google sans erreur

---

## 🐛 Si ça ne marche toujours pas

### Vérification 1 : Client ID correct dans le code
Ouvrez la console du navigateur (F12) et tapez :
```javascript
console.log(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)
```

Vous devriez voir :
```
VOTRE_GOOGLE_CLIENT_ID
```

Si ce n'est pas le cas, les variables Vercel ne sont pas configurées.

### Vérification 2 : URL exacte
L'erreur `origin_mismatch` affiche l'URL qui a été rejetée. Copiez cette URL exacte et ajoutez-la dans Google Cloud Console.

### Vérification 3 : Compte Google correct
Assurez-vous d'être connecté au compte Google qui a créé le projet OAuth.

---

## 📋 Checklist de résolution

- [ ] Aller sur Google Cloud Console
- [ ] Sélectionner le bon projet
- [ ] Trouver OAuth Client ID `733593700986-...`
- [ ] Ajouter `https://para-plus-tn.vercel.app` aux origines JavaScript
- [ ] Ajouter les URI de redirection
- [ ] Cliquer sur Enregistrer
- [ ] Configurer les variables d'environnement sur Vercel
- [ ] Redéployer l'application sur Vercel
- [ ] Attendre 5-10 minutes
- [ ] Vider le cache du navigateur
- [ ] Tester la connexion Google

---

## ✅ Fichiers mis à jour localement

Les identifiants ont été mis à jour dans :
- ✅ `backend/.env` (développement local)
- ✅ `backend/.env.example` (documentation)
- ✅ `frontend/.env.local` (développement local)
- ✅ `VERCEL_ENV_CONFIG.md` (guide Vercel)
- ✅ `DEPLOIEMENT_RENDER.md` (guide Render)

**Prochaine étape :** Pusher ces changements sur GitHub

```bash
git add .
git commit -m "Config: Mise à jour identifiants Google OAuth

- Update Google OAuth credentials
- Client ID: 733593700986-...
- Fix origin_mismatch error

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
git push origin main
```

---

**Une fois la configuration terminée, supprimez ce fichier pour ne pas exposer vos secrets !**
