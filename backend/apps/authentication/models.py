"""
Modèle MongoDB pour les utilisateurs (clients et vendeurs).
Collection: users
"""
from mongoengine import Document, StringField, EmailField, BooleanField, DateTimeField
from datetime import datetime
import bcrypt


class User(Document):
    """
    Utilisateur du système (client ou vendeur).
    """
    # Choix des rôles
    ROLE_CLIENT = 'client'
    ROLE_VENDEUR = 'vendeur'
    ROLE_CHOICES = [
        (ROLE_CLIENT, 'Client'),
        (ROLE_VENDEUR, 'Vendeur'),
    ]

    # Champs de base
    email = EmailField(required=True, unique=True)
    mot_de_passe = StringField()  # Hashé avec bcrypt (optionnel pour OAuth)
    nom = StringField(required=True, max_length=100)
    prenom = StringField(required=True, max_length=100)
    telephone = StringField(max_length=20)

    # Google OAuth
    google_id = StringField(unique=True, sparse=True)  # ID Google unique
    photo_url = StringField()  # URL de la photo de profil
    auth_provider = StringField(default='email', choices=['email', 'google'])  # Méthode d'authentification

    # Rôle
    role = StringField(required=True, choices=ROLE_CHOICES, default=ROLE_CLIENT)

    # Adresse
    adresse = StringField()
    ville = StringField(max_length=100)
    code_postal = StringField(max_length=10)

    # Statut
    est_actif = BooleanField(default=True)
    est_verifie = BooleanField(default=False)

    # Dates
    date_inscription = DateTimeField(default=datetime.utcnow)
    derniere_connexion = DateTimeField()

    meta = {
        'collection': 'users',
        'indexes': [
            'email',
            'role',
            'date_inscription',
            'google_id'
        ]
    }

    def __str__(self):
        return f"{self.prenom} {self.nom} ({self.email})"

    def definir_mot_de_passe(self, mot_de_passe_brut):
        """Hasher le mot de passe avec bcrypt."""
        self.mot_de_passe = bcrypt.hashpw(
            mot_de_passe_brut.encode('utf-8'),
            bcrypt.gensalt()
        ).decode('utf-8')

    def verifier_mot_de_passe(self, mot_de_passe_brut):
        """Vérifier le mot de passe."""
        if not self.mot_de_passe:
            return False
        return bcrypt.checkpw(
            mot_de_passe_brut.encode('utf-8'),
            self.mot_de_passe.encode('utf-8')
        )

    def est_vendeur(self):
        """Vérifier si l'utilisateur est un vendeur."""
        return self.role == self.ROLE_VENDEUR

    def est_client(self):
        """Vérifier si l'utilisateur est un client."""
        return self.role == self.ROLE_CLIENT
