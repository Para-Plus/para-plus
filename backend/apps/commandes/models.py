"""
Modèle MongoDB pour les commandes.
Collection: orders
"""
from mongoengine import (
    Document, StringField, FloatField, IntField,
    DateTimeField, EmbeddedDocument, EmbeddedDocumentListField,
    DictField, BooleanField
)
from datetime import datetime


class ArticleCommande(EmbeddedDocument):
    """
    Article dans une commande (embedded).
    """
    produit_id = StringField(required=True)
    nom_produit = StringField(required=True)
    quantite = IntField(required=True, min_value=1)
    prix_unitaire = FloatField(required=True, min_value=0)
    prix_total = FloatField(required=True, min_value=0)

    def __str__(self):
        return f"{self.nom_produit} x{self.quantite}"


class Commande(Document):
    """
    Commande client.
    Collection: orders
    """
    # Statuts de commande
    STATUT_EN_ATTENTE = 'en_attente'
    STATUT_CONFIRMEE = 'confirmee'
    STATUT_EN_PREPARATION = 'en_preparation'
    STATUT_EXPEDIEE = 'expediee'
    STATUT_LIVREE = 'livree'
    STATUT_ANNULEE = 'annulee'

    STATUT_CHOICES = [
        (STATUT_EN_ATTENTE, 'En attente'),
        (STATUT_CONFIRMEE, 'Confirmée'),
        (STATUT_EN_PREPARATION, 'En préparation'),
        (STATUT_EXPEDIEE, 'Expédiée'),
        (STATUT_LIVREE, 'Livrée'),
        (STATUT_ANNULEE, 'Annulée'),
    ]

    # Références
    client_id = StringField(required=True)  # ID du client (User)
    numero_commande = StringField(required=True, unique=True)

    # Articles
    articles = EmbeddedDocumentListField(ArticleCommande, required=True)

    # Montants
    montant_total = FloatField(required=True, min_value=0)
    frais_livraison = FloatField(default=0, min_value=0)
    montant_final = FloatField(required=True, min_value=0)

    # Statut
    statut = StringField(
        required=True,
        choices=STATUT_CHOICES,
        default=STATUT_EN_ATTENTE
    )

    # Adresse de livraison
    adresse_livraison = DictField(required=True)  # {rue, ville, code_postal, telephone}

    # Paiement
    paiement_id = StringField()  # Référence au paiement
    est_payee = BooleanField(default=False)

    # Notes
    notes_client = StringField()
    notes_vendeur = StringField()

    # Dates
    date_commande = DateTimeField(default=datetime.utcnow)
    date_livraison_estimee = DateTimeField()
    date_livraison_effective = DateTimeField()

    meta = {
        'collection': 'orders',
        'indexes': [
            'numero_commande',
            'client_id',
            'statut',
            'date_commande',
            'est_payee'
        ]
    }

    def __str__(self):
        return f"Commande {self.numero_commande}"

    def calculer_montant_final(self):
        """Calculer le montant final avec frais de livraison."""
        self.montant_final = self.montant_total + self.frais_livraison
        return self.montant_final
