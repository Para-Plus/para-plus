# API Produits - Documentation

## 📋 Endpoints Disponibles

### 🛍️ **PRODUITS**

#### 1. Liste des produits avec filtres
```
GET /api/produits/
```

**Query Parameters:**
- `search` - Recherche dans nom et description
- `type` - Filtrer par type (`parapharmacie`, `pharmacie`, `medical`)
- `categorie` - Filtrer par ID de catégorie
- `min_prix` - Prix minimum
- `max_prix` - Prix maximum
- `disponible_location` - Produits disponibles en location (`true`/`false`)
- `est_en_vedette` - Produits en vedette (`true`/`false`)
- `vendeur_id` - Filtrer par vendeur
- `ordering` - Tri (`nom`, `prix`, `-prix`, `date_creation`, `-date_creation`)
- `page` - Numéro de page (pagination)
- `page_size` - Nombre d'éléments par page (max 100)

**Exemple:**
```bash
GET /api/produits/?type=parapharmacie&min_prix=20&max_prix=100&ordering=-prix&page=1
```

**Réponse:**
```json
{
  "count": 45,
  "next": "http://localhost:8000/api/produits/?page=2",
  "previous": null,
  "results": [
    {
      "id": "64abc123...",
      "nom": "Crème hydratante bio",
      "slug": "creme-hydratante-bio",
      "description": "...",
      "type_produit": "parapharmacie",
      "prix": 45.50,
      "stock": 50,
      "categorie": "64xyz...",
      "categorie_nom": "Soins du visage",
      "image_principale": "https://...",
      "disponible_location": false,
      "est_actif": true,
      "est_en_vedette": true,
      "est_disponible": true,
      "date_creation": "2026-01-20T10:30:00Z",
      "date_modification": "2026-01-20T10:30:00Z"
    }
  ]
}
```

---

#### 2. Détail d'un produit
```
GET /api/produits/{slug}/
```

**Exemple:**
```bash
GET /api/produits/creme-hydratante-bio/
```

**Réponse:**
```json
{
  "id": "64abc123...",
  "nom": "Crème hydratante bio",
  "slug": "creme-hydratante-bio",
  "description": "Crème hydratante...",
  "type_produit": "parapharmacie",
  "prix": 45.50,
  "stock": 50,
  "categorie": "64xyz...",
  "categorie_info": {
    "id": "64xyz...",
    "nom": "Soins du visage",
    "slug": "soins-visage",
    "description": "..."
  },
  "vendeur_id": "64vendeur...",
  "vendeur_nom": "Jean Dupont",
  "images": [
    "https://...",
    "https://..."
  ],
  "disponible_location": false,
  "prix_location_jour": null,
  "est_actif": true,
  "est_en_vedette": true,
  "est_disponible": true,
  "date_creation": "2026-01-20T10:30:00Z",
  "date_modification": "2026-01-20T10:30:00Z"
}
```

---

#### 3. Créer un produit (Vendeur uniquement)
```
POST /api/produits/creer/
Authorization: Bearer {access_token}
```

**Body:**
```json
{
  "nom": "Nouveau produit",
  "slug": "nouveau-produit",
  "description": "Description du produit...",
  "type_produit": "parapharmacie",
  "prix": 39.99,
  "stock": 100,
  "categorie": "64xyz...",
  "images": [
    "https://..."
  ],
  "disponible_location": false,
  "est_actif": true,
  "est_en_vedette": false
}
```

**Notes:**
- Le `vendeur_id` est ajouté automatiquement
- Le `slug` est généré automatiquement si non fourni
- Si `disponible_location=true`, `prix_location_jour` est requis

**Réponse:** 201 Created + détails du produit créé

---

#### 4. Modifier un produit (Vendeur propriétaire uniquement)
```
PUT /api/produits/{id}/modifier/
PATCH /api/produits/{id}/modifier/
Authorization: Bearer {access_token}
```

**Body (PUT = complet, PATCH = partiel):**
```json
{
  "prix": 44.99,
  "stock": 80
}
```

**Réponse:** 200 OK + détails du produit modifié

---

#### 5. Supprimer un produit (Vendeur propriétaire uniquement)
```
DELETE /api/produits/{id}/supprimer/
Authorization: Bearer {access_token}
```

**Note:** Soft delete - met `est_actif` à `false`

**Réponse:**
```json
{
  "message": "Produit supprimé avec succès"
}
```

---

#### 6. Mes produits (Vendeur)
```
GET /api/produits/mes-produits/
Authorization: Bearer {access_token}
```

Liste tous les produits du vendeur connecté (incluant les inactifs).

---

#### 7. Produits similaires
```
GET /api/produits/{id}/similaires/
```

Retourne jusqu'à 6 produits similaires (même catégorie et type).

---

#### 8. Upload d'image
```
POST /api/produits/upload-image/
Authorization: Bearer {access_token}
Content-Type: multipart/form-data
```

**Form Data:**
- `image` - Fichier image (JPEG, PNG, WebP)

**Contraintes:**
- Taille max: 5MB
- Types autorisés: JPEG, PNG, WebP
- Vendeurs uniquement

**Réponse:**
```json
{
  "url": "http://localhost:8000/media/produits/uuid.jpg"
}
```

---

### 📁 **CATÉGORIES**

#### 1. Liste des catégories
```
GET /api/produits/categories/
```

**Réponse:**
```json
[
  {
    "id": "64xyz...",
    "nom": "Soins du visage",
    "slug": "soins-visage",
    "description": "...",
    "image": "https://...",
    "parent": null,
    "parent_nom": null,
    "est_active": true,
    "date_creation": "2026-01-20T10:00:00Z",
    "sous_categories_count": 3
  }
]
```

---

#### 2. Détail d'une catégorie
```
GET /api/produits/categories/{slug}/
```

---

#### 3. Sous-catégories
```
GET /api/produits/categories/{id}/sous-categories/
```

Retourne les sous-catégories d'une catégorie parente.

---

## 🧪 Test de l'API

### 1. Créer des données de test
```bash
cd backend
python create_test_data.py
```

Cela créera:
- 5 catégories
- 7 produits d'exemple
- 1 vendeur de test (si aucun n'existe)

---

### 2. Tester avec curl

**Lister les produits:**
```bash
curl http://localhost:8000/api/produits/
```

**Rechercher "vitamine":**
```bash
curl "http://localhost:8000/api/produits/?search=vitamine"
```

**Filtrer par type:**
```bash
curl "http://localhost:8000/api/produits/?type=parapharmacie&est_en_vedette=true"
```

**Obtenir un produit:**
```bash
curl http://localhost:8000/api/produits/creme-hydratante-visage-bio/
```

**Créer un produit (avec auth):**
```bash
curl -X POST http://localhost:8000/api/produits/creer/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Test produit",
    "description": "Description test",
    "type_produit": "parapharmacie",
    "prix": 25.00,
    "stock": 10,
    "categorie": "CATEGORIE_ID"
  }'
```

**Upload image:**
```bash
curl -X POST http://localhost:8000/api/produits/upload-image/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "image=@/path/to/image.jpg"
```

---

## 🔐 Authentification

Pour les endpoints protégés (créer, modifier, supprimer):

1. **Obtenir un token:**
```bash
curl -X POST http://localhost:8000/api/auth/connexion/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "vendeur@test.com",
    "mot_de_passe": "Test123456!"
  }'
```

2. **Utiliser le token:**
```bash
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

---

## ✅ Fonctionnalités Implémentées

- ✅ Liste produits avec pagination (12 par page)
- ✅ Recherche full-text (nom + description)
- ✅ Filtres multiples (type, catégorie, prix, etc.)
- ✅ Tri (nom, prix, date)
- ✅ Détail produit par slug
- ✅ CRUD complet (Create, Read, Update, Delete)
- ✅ Upload d'images avec validation
- ✅ Permissions (vendeurs uniquement)
- ✅ Soft delete (produits)
- ✅ Produits similaires
- ✅ Gestion catégories et sous-catégories
- ✅ Validation des données
- ✅ Génération automatique de slug

---

## 📝 Notes

- Les produits inactifs (`est_actif=false`) ne sont pas visibles dans la liste publique
- Seul le vendeur propriétaire peut modifier/supprimer ses produits
- Les images sont stockées dans `media/produits/`
- La pagination par défaut est de 12 produits par page
- Le tri par défaut est par date de création (plus récent d'abord)
