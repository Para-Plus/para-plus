# 🔧 Configuration des Variables d'Environnement Vercel

Guide pour configurer l'URL de votre backend Render dans Vercel.

---

## 🌐 Méthode 1: Via l'interface Vercel (Recommandé)

### Étapes:

1. **Allez sur votre dashboard Vercel:**
   ```
   https://vercel.com/dashboard
   ```

2. **Sélectionnez votre projet:**
   - Cliquez sur votre projet `para-plus` (ou le nom que vous lui avez donné)

3. **Ouvrez les Settings:**
   - Cliquez sur l'onglet **"Settings"** en haut

4. **Accédez aux Environment Variables:**
   - Dans le menu de gauche, cliquez sur **"Environment Variables"**

5. **Ajouter/Modifier les variables:**

   | Name | Value | Environment |
   |------|-------|-------------|
   | `NEXT_PUBLIC_API_URL` | `https://para-plus-tn.onrender.com/api` | Production, Preview, Development |
   | `NEXT_PUBLIC_SITE_URL` | `https://para-plus-tn.vercel.app` | Production |
   | `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | `287357375914-tlpvlhmktpk61rmcearpaph4j9oa4p2e.apps.googleusercontent.com` | Production, Preview, Development |

6. **Pour chaque variable:**
   - Cliquez sur **"Add New"**
   - Entrez le **Name** (ex: `NEXT_PUBLIC_API_URL`)
   - Entrez la **Value** (ex: `https://para-plus-tn.onrender.com/api`)
   - Sélectionnez les environnements (cochez **Production**, **Preview**, **Development**)
   - Cliquez sur **"Save"**

7. **Redéployer:**
   - Une fois toutes les variables ajoutées, cliquez sur **"Deployments"**
   - Cliquez sur les 3 points `...` du dernier déploiement
   - Cliquez sur **"Redeploy"**
   - Cochez **"Use existing Build Cache"** (optionnel)
   - Cliquez sur **"Redeploy"**

---

## 💻 Méthode 2: Via la CLI Vercel

### 1. Installer Vercel CLI

```bash
npm install -g vercel
```

### 2. Se connecter

```bash
vercel login
```

### 3. Aller dans le dossier frontend

```bash
cd frontend
```

### 4. Lier le projet

```bash
vercel link
```

### 5. Ajouter les variables d'environnement

```bash
# Production
vercel env add NEXT_PUBLIC_API_URL production
# Quand demandé, entrez: https://para-plus-tn.onrender.com/api

vercel env add NEXT_PUBLIC_SITE_URL production
# Quand demandé, entrez: https://para-plus-tn.vercel.app

vercel env add NEXT_PUBLIC_GOOGLE_CLIENT_ID production
# Quand demandé, entrez: 287357375914-tlpvlhmktpk61rmcearpaph4j9oa4p2e.apps.googleusercontent.com

# Preview (optionnel)
vercel env add NEXT_PUBLIC_API_URL preview
# Entrez: https://para-plus-tn.onrender.com/api

# Development (optionnel)
vercel env add NEXT_PUBLIC_API_URL development
# Entrez: http://localhost:8000/api
```

### 6. Redéployer

```bash
vercel --prod
```

---

## 📝 Méthode 3: Via fichier `.env` (Développement local uniquement)

**⚠️ IMPORTANT:** Cette méthode ne fonctionne que pour tester localement. Les variables doivent être configurées sur Vercel pour la production.

### Créer/Modifier `frontend/.env.local`

```bash
# API Backend URL
NEXT_PUBLIC_API_URL=https://para-plus-tn.onrender.com/api

# Site URL
NEXT_PUBLIC_SITE_URL=https://para-plus-tn.vercel.app

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=287357375914-tlpvlhmktpk61rmcearpaph4j9oa4p2e.apps.googleusercontent.com
```

**Note:** Le fichier `.env.local` est dans `.gitignore` et ne sera PAS déployé sur Vercel. C'est pourquoi vous devez configurer les variables via l'interface Vercel ou la CLI.

---

## ✅ Vérification

### 1. Vérifier que les variables sont bien configurées

Dans Vercel Dashboard → Votre projet → Settings → Environment Variables

Vous devriez voir:
- ✅ `NEXT_PUBLIC_API_URL` = `https://para-plus-tn.onrender.com/api`
- ✅ `NEXT_PUBLIC_SITE_URL` = `https://para-plus-tn.vercel.app`
- ✅ `NEXT_PUBLIC_GOOGLE_CLIENT_ID` = `287357375914-...`

### 2. Tester après le déploiement

```bash
# Ouvrir la console du navigateur sur votre site Vercel
console.log(process.env.NEXT_PUBLIC_API_URL)
// Devrait afficher: https://para-plus-tn.onrender.com/api
```

---

## 🔄 Mettre à jour une variable existante

### Via l'interface Vercel:

1. Settings → Environment Variables
2. Trouvez la variable à modifier
3. Cliquez sur les 3 points `...` → **Edit**
4. Modifiez la valeur
5. Cliquez sur **Save**
6. **Redéployez** le projet

### Via CLI:

```bash
# Supprimer l'ancienne
vercel env rm NEXT_PUBLIC_API_URL production

# Ajouter la nouvelle
vercel env add NEXT_PUBLIC_API_URL production
# Entrez la nouvelle valeur

# Redéployer
vercel --prod
```

---

## 🐛 Dépannage

### Variables non visibles dans le build

**Problème:** Les variables ne sont pas accessibles dans le code.

**Solutions:**
1. Vérifiez que le nom commence par `NEXT_PUBLIC_` (obligatoire pour les variables client-side)
2. Redéployez après avoir ajouté les variables
3. Effacez le cache de build (Deployments → Redeploy sans cache)

### Erreur CORS après changement d'URL

**Problème:** Erreurs CORS après avoir changé `NEXT_PUBLIC_API_URL`.

**Solution:**
1. Allez dans Render → Votre service backend → Environment
2. Modifiez `CORS_ALLOWED_ORIGINS` pour inclure votre URL Vercel:
   ```
   https://para-plus-tn.vercel.app,https://para-plus.tn,http://localhost:3000
   ```
3. Redéployez le backend

### Build échoue avec "Type error"

**Problème:** Erreur TypeScript lors du build.

**Solution:** Vérifiez que toutes les dépendances TypeScript sont correctes.
- Vérifiez `package.json`
- Lancez `npm run build` localement pour reproduire l'erreur
- Corrigez les erreurs TypeScript

---

## 📚 Variables d'environnement disponibles

### Variables publiques (accessibles côté client)

Ces variables **DOIVENT** commencer par `NEXT_PUBLIC_`:

- `NEXT_PUBLIC_API_URL` - URL de l'API backend
- `NEXT_PUBLIC_SITE_URL` - URL du site frontend
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` - Client ID Google OAuth
- `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` - Clé publique Stripe (futur)

### Variables privées (serveur uniquement)

Ces variables sont accessibles uniquement côté serveur (API routes, Server Components):

- `MONGODB_URI` - URI MongoDB (si vous utilisez MongoDB côté frontend)
- Autres secrets...

**⚠️ Ne JAMAIS mettre de secrets dans des variables `NEXT_PUBLIC_` !**

---

## 🎯 Récapitulatif

### Configuration complète pour production:

```env
# Vercel Environment Variables
NEXT_PUBLIC_API_URL=https://para-plus-tn.onrender.com/api
NEXT_PUBLIC_SITE_URL=https://para-plus-tn.vercel.app
NEXT_PUBLIC_GOOGLE_CLIENT_ID=287357375914-tlpvlhmktpk61rmcearpaph4j9oa4p2e.apps.googleusercontent.com
```

### URLs à vérifier:

| Service | URL | Check |
|---------|-----|-------|
| Backend Render | https://para-plus-tn.onrender.com | ✅ |
| Frontend Vercel | https://para-plus-tn.vercel.app | ✅ |
| API Health | https://para-plus-tn.onrender.com/health/ | ✅ |
| API Produits | https://para-plus-tn.onrender.com/api/produits/ | ✅ |

---

## ✨ Configuration terminée!

Votre frontend Vercel est maintenant configuré pour communiquer avec votre backend Render.

**Prochaines étapes:**
1. Testez la connexion sur votre site Vercel
2. Créez un produit via le dashboard vendeur
3. Vérifiez que les images s'uploadent sur Cloudinary
