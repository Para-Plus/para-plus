"""
Modèle MongoDB pour les paiements.
Collection: payments
"""
from mongoengine import (
    Document, StringField, FloatField, DateTimeField,
    BooleanField, DictField
)
from datetime import datetime


class Paiement(Document):
    """
    Paiement effectué par un client.
    Collection: payments
    """
    # Méthodes de paiement
    METHODE_CARTE = 'carte'
    METHODE_PAYPAL = 'paypal'
    METHODE_STRIPE = 'stripe'
    METHODE_ESPECES = 'especes'
    METHODE_VIREMENT = 'virement'

    METHODE_CHOICES = [
        (METHODE_CARTE, 'Carte bancaire'),
        (METHODE_PAYPAL, 'PayPal'),
        (METHODE_STRIPE, 'Stripe'),
        (METHODE_ESPECES, 'Espèces'),
        (METHODE_VIREMENT, 'Virement bancaire'),
    ]

    # Statuts de paiement
    STATUT_EN_ATTENTE = 'en_attente'
    STATUT_REUSSI = 'reussi'
    STATUT_ECHOUE = 'echoue'
    STATUT_REMBOURSE = 'rembourse'
    STATUT_ANNULE = 'annule'

    STATUT_CHOICES = [
        (STATUT_EN_ATTENTE, 'En attente'),
        (STATUT_REUSSI, 'Réussi'),
        (STATUT_ECHOUE, 'Échoué'),
        (STATUT_REMBOURSE, 'Remboursé'),
        (STATUT_ANNULE, 'Annulé'),
    ]

    # Références
    client_id = StringField(required=True)  # ID du client
    commande_id = StringField()  # ID de la commande (si achat)
    location_id = StringField()  # ID de la location (si location)

    # Montant
    montant = FloatField(required=True, min_value=0)
    devise = StringField(default='TND', max_length=3)  # Dinar Tunisien

    # Méthode et statut
    methode_paiement = StringField(required=True, choices=METHODE_CHOICES)
    statut = StringField(
        required=True,
        choices=STATUT_CHOICES,
        default=STATUT_EN_ATTENTE
    )

    # Informations du processeur de paiement
    transaction_id = StringField(unique=True)  # ID de transaction externe (Stripe, PayPal, etc.)
    reference_externe = StringField()  # Référence supplémentaire
    donnees_processeur = DictField()  # Données brutes du processeur de paiement

    # Dates
    date_paiement = DateTimeField(default=datetime.utcnow)
    date_validation = DateTimeField()
    date_remboursement = DateTimeField()

    # Informations complémentaires
    description = StringField()
    message_erreur = StringField()  # Message si échec

    meta = {
        'collection': 'payments',
        'indexes': [
            'client_id',
            'commande_id',
            'location_id',
            'transaction_id',
            'statut',
            'date_paiement',
            'methode_paiement'
        ]
    }

    def __str__(self):
        return f"Paiement {self.transaction_id or self.id} - {self.montant} {self.devise}"

    def marquer_reussi(self, transaction_id=None):
        """Marquer le paiement comme réussi."""
        self.statut = self.STATUT_REUSSI
        self.date_validation = datetime.utcnow()
        if transaction_id:
            self.transaction_id = transaction_id
        return self

    def marquer_echoue(self, message_erreur):
        """Marquer le paiement comme échoué."""
        self.statut = self.STATUT_ECHOUE
        self.message_erreur = message_erreur
        return self

    def rembourser(self):
        """Marquer le paiement comme remboursé."""
        if self.statut == self.STATUT_REUSSI:
            self.statut = self.STATUT_REMBOURSE
            self.date_remboursement = datetime.utcnow()
        return self

    def est_reussi(self):
        """Vérifier si le paiement est réussi."""
        return self.statut == self.STATUT_REUSSI
