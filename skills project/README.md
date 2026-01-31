# Para-plus.tn

Marketplace e-commerce pour produits parapharmacie, pharmacie, matériel médical et location de matériel paramédical en Tunisie.

## 🚀 Technologies

### Backend
- **Django 4.2** - Framework web Python
- **Django REST Framework** - API REST
- **MongoDB** - Base de données NoSQL
- **MongoEngine** - ODM pour MongoDB
- **JWT** - Authentification par tokens
- **Python 3.9+**

### Frontend
- **Next.js 14+** - Framework React avec SSR et App Router
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling
- **Axios** - Client HTTP pour les appels API
- **Context API** - Gestion d'état pour l'authentification

### Infrastructure
- **Serveur**: serv00 (s3.serv00.com)
- **Base de données**: MongoDB Atlas
- **Domaine**: para-plus.tn

## 📊 Collections MongoDB

Le projet utilise 7 collections MongoDB:

### 1. **users** - Utilisateurs
```javascript
{
  email: String (unique),
  mot_de_passe: String (hashé),
  nom: String,
  prenom: String,
  telephone: String,
  role: String ('client' | 'vendeur'),
  adresse: String,
  ville: String,
  code_postal: String,
  est_actif: Boolean,
  est_verifie: Boolean,
  date_inscription: Date,
  derniere_connexion: Date
}
```

### 2. **products** - Produits
```javascript
{
  nom: String,
  slug: String (unique),
  description: String,
  type_produit: String ('parapharmacie' | 'pharmacie' | 'medical'),
  prix: Float,
  stock: Integer,
  categorie: Reference(Category),
  vendeur_id: String,
  images: [String],
  disponible_location: Boolean,
  prix_location_jour: Float,
  est_actif: Boolean,
  est_en_vedette: Boolean,
  date_creation: Date,
  date_modification: Date
}
```

### 3. **categories** - Catégories
```javascript
{
  nom: String,
  slug: String (unique),
  description: String,
  image: String (URL),
  parent: Reference(self),
  est_active: Boolean,
  date_creation: Date
}
```

### 4. **orders** - Commandes
```javascript
{
  client_id: String,
  numero_commande: String (unique),
  articles: [
    {
      produit_id: String,
      nom_produit: String,
      quantite: Integer,
      prix_unitaire: Float,
      prix_total: Float
    }
  ],
  montant_total: Float,
  frais_livraison: Float,
  montant_final: Float,
  statut: String ('en_attente' | 'confirmee' | 'en_preparation' | 'expediee' | 'livree' | 'annulee'),
  adresse_livraison: Object,
  paiement_id: String,
  est_payee: Boolean,
  notes_client: String,
  notes_vendeur: String,
  date_commande: Date,
  date_livraison_estimee: Date,
  date_livraison_effective: Date
}
```

### 5. **rentals** - Locations
```javascript
{
  produit_id: String,
  nom_produit: String,
  client_id: String,
  vendeur_id: String,
  date_debut: Date,
  date_fin: Date,
  nombre_jours: Integer,
  prix_par_jour: Float,
  prix_total: Float,
  caution: Float,
  statut: String ('reservee' | 'en_cours' | 'terminee' | 'annulee'),
  adresse_livraison: Object,
  notes_client: String,
  paiement_id: String,
  est_payee: Boolean,
  caution_rendue: Boolean,
  date_reservation: Date,
  date_retour_effective: Date
}
```

### 6. **cart** - Panier
```javascript
{
  client_id: String (unique),
  articles: [
    {
      produit_id: String,
      nom_produit: String,
      quantite: Integer,
      prix_unitaire: Float,
      image_url: String
    }
  ],
  montant_total: Float,
  date_creation: Date,
  date_modification: Date
}
```

### 7. **payments** - Paiements
```javascript
{
  client_id: String,
  commande_id: String,
  location_id: String,
  montant: Float,
  devise: String (default: 'TND'),
  methode_paiement: String ('carte' | 'paypal' | 'stripe' | 'especes' | 'virement'),
  statut: String ('en_attente' | 'reussi' | 'echoue' | 'rembourse' | 'annule'),
  transaction_id: String (unique),
  reference_externe: String,
  donnees_processeur: Object,
  date_paiement: Date,
  date_validation: Date,
  date_remboursement: Date,
  description: String,
  message_erreur: String
}
```

## 🔧 Installation Backend

### Prérequis
- Python 3.9+
- pip
- MongoDB Atlas account (ou MongoDB local)

### Étapes

1. **Cloner le repository**
```bash
git clone https://github.com/Gas1212/para-plus.git
cd para-plus/backend
```

2. **Créer un environnement virtuel**
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

3. **Installer les dépendances**
```bash
pip install -r requirements.txt
```

4. **Configurer les variables d'environnement**
```bash
# Copier .env.example vers .env
cp .env.example .env

# Éditer .env avec vos configurations
```

5. **Lancer le serveur de développement**
```bash
python manage.py runserver
```

Le serveur sera accessible sur `http://localhost:8000`

## 🎨 Installation Frontend

### Prérequis
- Node.js 18+
- npm ou yarn

### Étapes

1. **Naviguer vers le dossier frontend**
```bash
cd frontend
```

2. **Installer les dépendances**
```bash
npm install
# ou
yarn install
```

3. **Configurer les variables d'environnement**
Le fichier `.env.local` est déjà créé avec les bonnes valeurs:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. **Lancer le serveur de développement**
```bash
npm run dev
# ou
yarn dev
```

Le frontend sera accessible sur `http://localhost:3000`

### Pages disponibles
- **/** - Page d'accueil
- **/inscription** - Inscription (client ou vendeur)
- **/connexion** - Connexion
- **/produits** - Liste des produits (à venir)
- **/location** - Location de matériel (à venir)

## 🔑 API Endpoints

### Authentification (`/api/auth/`)

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/inscription/` | Inscription nouvel utilisateur | Non |
| POST | `/connexion/` | Connexion utilisateur | Non |
| POST | `/deconnexion/` | Déconnexion utilisateur | Oui |
| GET | `/profil/` | Obtenir profil utilisateur | Oui |
| PUT/PATCH | `/profil/modifier/` | Modifier profil | Oui |
| POST | `/changer-mot-de-passe/` | Changer mot de passe | Oui |
| POST | `/token/refresh/` | Rafraîchir token JWT | Non |

### Exemple d'inscription

**Request:**
```json
POST /api/auth/inscription/
{
  "email": "client@example.com",
  "mot_de_passe": "motdepasse123",
  "confirmation_mot_de_passe": "motdepasse123",
  "nom": "Dupont",
  "prenom": "Jean",
  "telephone": "+216 12 345 678",
  "role": "client"
}
```

**Response:**
```json
{
  "message": "Inscription réussie",
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "client@example.com",
    "nom": "Dupont",
    "prenom": "Jean",
    "role": "client",
    ...
  }
}
```

### Exemple de connexion

**Request:**
```json
POST /api/auth/connexion/
{
  "email": "client@example.com",
  "mot_de_passe": "motdepasse123"
}
```

**Response:**
```json
{
  "message": "Connexion réussie",
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": { ... }
}
```

## 🔐 Authentification JWT

Toutes les requêtes authentifiées doivent inclure le token JWT dans le header:

```
Authorization: Bearer <access_token>
```

Les tokens expirent après:
- **Access token**: 60 minutes
- **Refresh token**: 24 heures

Pour rafraîchir un token:
```json
POST /api/token/refresh/
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

## 📂 Structure du Projet

```
para-plus/
├── backend/
│   ├── paraplus/               # Configuration Django
│   │   ├── settings.py         # Settings avec MongoDB
│   │   ├── urls.py             # Routes principales
│   │   └── wsgi.py             # WSGI pour déploiement
│   │
│   ├── apps/
│   │   ├── authentication/     # Authentification & Users
│   │   │   ├── models.py       # Modèle User
│   │   │   ├── serializers.py  # Serializers JWT
│   │   │   ├── views.py        # Views auth
│   │   │   └── urls.py
│   │   │
│   │   ├── produits/           # Produits & Catégories
│   │   │   ├── models.py       # Produit, Categorie
│   │   │   └── urls.py
│   │   │
│   │   ├── commandes/          # Commandes
│   │   │   ├── models.py       # Commande
│   │   │   └── urls.py
│   │   │
│   │   ├── locations/          # Locations matériel
│   │   │   ├── models.py       # Location
│   │   │   └── urls.py
│   │   │
│   │   ├── panier/             # Panier d'achat
│   │   │   ├── models.py       # Panier
│   │   │   └── urls.py
│   │   │
│   │   └── paiements/          # Paiements
│   │       ├── models.py       # Paiement
│   │       └── urls.py
│   │
│   ├── media/                  # Images uploadées
│   ├── requirements.txt        # Dépendances Python
│   ├── manage.py
│   └── .env                    # Variables d'environnement
│
├── frontend/                   # À venir (Next.js)
├── .gitignore
└── README.md
```

## 🚀 Déploiement sur serv00

### Connexion SSH
```bash
ssh Paraplus@s3.serv00.com
```

### Configuration
1. Créer l'environnement virtuel sur le serveur
2. Installer les dépendances
3. Configurer les variables d'environnement
4. Configurer uWSGI/Gunicorn
5. Configurer Nginx comme reverse proxy

### Variables d'environnement production
```bash
DEBUG=False
ALLOWED_HOSTS=para-plus.tn,api.para-plus.tn,s3.serv00.com
MONGODB_URI=mongodb+srv://paraplus:VOTRE_MONGODB_PASSWORD@para-plus.g9zicn9.mongodb.net
```

## 📝 À Faire

- [ ] Implémenter les views et serializers pour Produits
- [ ] Implémenter les views et serializers pour Commandes
- [ ] Implémenter les views et serializers pour Locations
- [ ] Implémenter les views et serializers pour Panier
- [ ] Implémenter les views et serializers pour Paiements
- [ ] Créer le frontend Next.js
- [ ] Intégrer Stripe/PayPal pour les paiements
- [ ] Ajouter upload d'images
- [ ] Système de recherche et filtres avancés
- [ ] Dashboard vendeur
- [ ] Panel d'administration
- [ ] Tests unitaires et d'intégration
- [ ] Documentation API complète

## 👥 Contributeurs

- **Développeur**: Gas1212

## 📄 Licence

Tous droits réservés - Para-plus.tn 2026

## 📧 Contact

Pour toute question: contact@para-plus.tn
