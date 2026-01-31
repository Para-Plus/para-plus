# 🚀 Guide de Déploiement sur Vercel

Ce guide explique comment déployer le frontend Next.js de Para-plus.tn sur Vercel.

## 📋 Prérequis

- Compte Vercel (gratuit): https://vercel.com
- Repository GitHub: https://github.com/Gas1212/para-plus
- Backend Django déployé (sur serv00 ou autre)

## 🔧 Configuration Vercel

### 1. Importer le Projet

1. Aller sur https://vercel.com/new
2. Importer depuis GitHub: `Gas1212/para-plus`
3. Sélectionner le repository

### 2. Configuration du Projet

**Framework Preset:** Next.js
**Root Directory:** `frontend`
**Build Command:** `npm run build`
**Output Directory:** `.next`
**Install Command:** `npm install`

### 3. Variables d'Environnement

Dans les paramètres du projet Vercel, ajouter ces variables d'environnement:

#### Variables Requises

```env
# API Backend URL (IMPORTANT!)
NEXT_PUBLIC_API_URL=https://api.para-plus.tn/api

# Site URL
NEXT_PUBLIC_SITE_URL=https://para-plus.vercel.app
```

**⚠️ IMPORTANT**:
- `NEXT_PUBLIC_API_URL` doit pointer vers votre backend Django déployé sur serv00
- Si votre backend est sur `https://para-plus.tn/api`, utilisez cette URL
- Si votre backend est sur un sous-domaine `https://api.para-plus.tn`, utilisez cette URL

#### Variables Optionnelles

```env
# MongoDB (si Next.js fait des requêtes directes - optionnel)
MONGODB_URI=mongodb+srv://paraplus:VOTRE_MONGODB_PASSWORD@para-plus.g9zicn9.mongodb.net/para_plus_db

# Stripe (à ajouter plus tard)
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_...
```

### 4. Déployer

1. Cliquer sur **Deploy**
2. Attendre la fin du build (2-3 minutes)
3. Votre site sera disponible sur `https://para-plus.vercel.app`

## 🔄 Mises à Jour Automatiques

Vercel redéploie automatiquement à chaque push sur la branche `main`:

```bash
git add .
git commit -m "Mise à jour"
git push origin main
```

Le déploiement se fait automatiquement en quelques minutes.

## 🌐 Configuration du Domaine Custom

### Ajouter para-plus.tn à Vercel

1. Dans les paramètres Vercel → **Domains**
2. Ajouter `para-plus.tn` et `www.para-plus.tn`
3. Vercel vous donnera des enregistrements DNS à configurer

### Configuration DNS

Chez votre registrar de domaine (ex: Hostinger, GoDaddy, etc.):

**Type A Record:**
```
@ → 76.76.21.21 (Vercel IP)
```

**Type CNAME Record:**
```
www → cname.vercel-dns.com
```

**Attendre 24-48h** pour la propagation DNS.

## 🔒 CORS Backend Django

**IMPORTANT**: Configurez CORS dans votre backend Django pour autoriser Vercel.

Dans `backend/paraplus/settings.py`:

```python
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'https://para-plus.vercel.app',
    'https://para-plus.tn',
    'https://www.para-plus.tn',
]
```

Redémarrez votre backend Django après modification.

## 📊 Variables d'Environnement par Environnement

Vercel permet différentes valeurs selon l'environnement:

### Production
```env
NEXT_PUBLIC_API_URL=https://api.para-plus.tn/api
NEXT_PUBLIC_SITE_URL=https://para-plus.tn
```

### Preview (branches de développement)
```env
NEXT_PUBLIC_API_URL=https://api-dev.para-plus.tn/api
NEXT_PUBLIC_SITE_URL=https://para-plus-dev.vercel.app
```

### Development (local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## ✅ Vérification du Déploiement

Après déploiement, vérifier:

1. **Frontend accessible**: https://para-plus.vercel.app
2. **Pages fonctionnelles**:
   - ✅ Page d'accueil: `/`
   - ✅ Inscription: `/inscription`
   - ✅ Connexion: `/connexion`

3. **Connexion API**:
   - Ouvrir la console développeur (F12)
   - Essayer de s'inscrire
   - Vérifier qu'il n'y a pas d'erreur CORS
   - Vérifier que l'API répond

## 🐛 Résolution de Problèmes

### Erreur: "API call failed"

**Cause**: Backend Django non accessible ou CORS mal configuré

**Solution**:
1. Vérifier que `NEXT_PUBLIC_API_URL` pointe vers le bon backend
2. Vérifier que le backend est en ligne
3. Vérifier la configuration CORS dans Django
4. Vérifier les logs Vercel: https://vercel.com/dashboard

### Erreur: "useSearchParams() should be wrapped in Suspense"

**Cause**: Next.js 14 requiert Suspense pour `useSearchParams()`

**Solution**: Déjà corrigée dans le code avec `InscriptionForm.tsx`

### Erreur: "Environment variable not found"

**Cause**: Variables d'environnement non configurées sur Vercel

**Solution**:
1. Aller dans Settings → Environment Variables
2. Ajouter toutes les variables `NEXT_PUBLIC_*`
3. Redéployer le projet

### Erreur CORS

**Cause**: Backend Django rejette les requêtes depuis Vercel

**Solution**: Ajouter l'URL Vercel dans `CORS_ALLOWED_ORIGINS` du backend:

```python
# backend/paraplus/settings.py
CORS_ALLOWED_ORIGINS = [
    'https://para-plus.vercel.app',
    'https://para-plus.tn',
]
```

## 📈 Performance et Optimisation

### ISR (Incremental Static Regeneration)

Pour les pages produits (à venir), activer ISR:

```typescript
export const revalidate = 60; // Revalider toutes les 60 secondes
```

### Images Optimization

Next.js optimise automatiquement les images. Utiliser:

```tsx
import Image from 'next/image';

<Image
  src="/produit.jpg"
  width={400}
  height={300}
  alt="Produit"
/>
```

### Analytics (optionnel)

Vercel Analytics est inclus gratuitement:

```bash
npm install @vercel/analytics
```

Dans `layout.tsx`:
```tsx
import { Analytics } from '@vercel/analytics/react';

<Analytics />
```

## 🔐 Sécurité

### Headers de Sécurité

Vercel ajoute automatiquement des headers de sécurité. Pour personnaliser:

`next.config.ts`:
```typescript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};
```

## 📞 Support

- Documentation Vercel: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Issues: https://github.com/Gas1212/para-plus/issues

## ✅ Checklist de Déploiement

- [ ] Compte Vercel créé
- [ ] Repository importé
- [ ] Root directory configuré sur `frontend`
- [ ] Variables d'environnement configurées
- [ ] Backend Django accessible
- [ ] CORS configuré dans Django
- [ ] Déploiement réussi
- [ ] Pages testées (accueil, inscription, connexion)
- [ ] API testée (inscription/connexion fonctionnelle)
- [ ] Domaine custom configuré (optionnel)
- [ ] DNS configuré (si domaine custom)

---

**🎉 Votre frontend est maintenant déployé sur Vercel!**

URL de déploiement: `https://para-plus.vercel.app`
