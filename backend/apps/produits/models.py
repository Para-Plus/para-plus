"""
Modèles MongoDB pour les produits et catégories.
Collections: products, categories
"""
from mongoengine import (
    Document, StringField, FloatField, IntField,
    BooleanField, DateTimeField, ReferenceField,
    ListField, URLField
)
from datetime import datetime


class Categorie(Document):
    """
    Catégorie de produits.
    Collection: categories
    """
    nom = StringField(required=True, max_length=100)
    slug = StringField(required=True, unique=True)
    description = StringField()
    image = URLField()  # URL de l'image de la catégorie
    parent = ReferenceField('self', null=True)  # Pour catégories imbriquées
    est_active = BooleanField(default=True)
    date_creation = DateTimeField(default=datetime.utcnow)

    meta = {
        'collection': 'categories',
        'indexes': ['slug', 'est_active']
    }

    def __str__(self):
        return self.nom


class Produit(Document):
    """
    Produit parapharmacie, pharmacie ou médical.
    Collection: products
    """
    # Types de produits
    TYPE_PARAPHARMACIE = 'parapharmacie'
    TYPE_PHARMACIE = 'pharmacie'
    TYPE_MEDICAL = 'medical'
    TYPE_CHOICES = [
        (TYPE_PARAPHARMACIE, 'Parapharmacie'),
        (TYPE_PHARMACIE, 'Pharmacie'),
        (TYPE_MEDICAL, 'Matériel Médical'),
    ]

    # Informations de base
    nom = StringField(required=True, max_length=200)
    slug = StringField(required=True, unique=True)
    description = StringField(required=True)
    type_produit = StringField(required=True, choices=TYPE_CHOICES)

    # Prix et stock
    prix = FloatField(required=True, min_value=0)
    stock = IntField(required=True, default=0, min_value=0)

    # Catégorie et vendeur
    categorie = ReferenceField(Categorie, required=True)
    vendeur_id = StringField(required=True)  # ID du vendeur (User)

    # Images
    images = ListField(URLField())  # Liste des URLs d'images

    # Location (si applicable)
    disponible_location = BooleanField(default=False)
    prix_location_jour = FloatField(min_value=0)  # Prix par jour si en location

    # Statut
    est_actif = BooleanField(default=True)
    est_en_vedette = BooleanField(default=False)

    # Dates
    date_creation = DateTimeField(default=datetime.utcnow)
    date_modification = DateTimeField(default=datetime.utcnow)

    meta = {
        'collection': 'products',
        'indexes': [
            'slug',
            'type_produit',
            'categorie',
            'vendeur_id',
            'est_actif',
            'date_creation'
        ]
    }

    def __str__(self):
        return self.nom

    def save(self, *args, **kwargs):
        """Mettre à jour la date de modification."""
        self.date_modification = datetime.utcnow()
        return super(Produit, self).save(*args, **kwargs)

    def est_disponible(self):
        """Vérifier si le produit est disponible."""
        return self.est_actif and self.stock > 0
