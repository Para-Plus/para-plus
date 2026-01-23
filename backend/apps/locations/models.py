"""
Modèle MongoDB pour les locations de matériel.
Collection: rentals
"""
from mongoengine import (
    Document, StringField, FloatField, IntField, DateTimeField,
    BooleanField, DictField
)
from datetime import datetime


class Location(Document):
    """
    Location de matériel médical/paramédical.
    Collection: rentals
    """
    # Statuts de location
    STATUT_RESERVEE = 'reservee'
    STATUT_EN_COURS = 'en_cours'
    STATUT_TERMINEE = 'terminee'
    STATUT_ANNULEE = 'annulee'

    STATUT_CHOICES = [
        (STATUT_RESERVEE, 'Réservée'),
        (STATUT_EN_COURS, 'En cours'),
        (STATUT_TERMINEE, 'Terminée'),
        (STATUT_ANNULEE, 'Annulée'),
    ]

    # Références
    produit_id = StringField(required=True)  # ID du produit loué
    nom_produit = StringField(required=True)
    client_id = StringField(required=True)  # ID du client (User)
    vendeur_id = StringField(required=True)  # ID du vendeur

    # Période de location
    date_debut = DateTimeField(required=True)
    date_fin = DateTimeField(required=True)
    nombre_jours = IntField(required=True, min_value=1)

    # Prix
    prix_par_jour = FloatField(required=True, min_value=0)
    prix_total = FloatField(required=True, min_value=0)
    caution = FloatField(default=0, min_value=0)

    # Statut
    statut = StringField(
        required=True,
        choices=STATUT_CHOICES,
        default=STATUT_RESERVEE
    )

    # Informations complémentaires
    adresse_livraison = DictField()  # {rue, ville, code_postal}
    notes_client = StringField()

    # Paiement
    paiement_id = StringField()
    est_payee = BooleanField(default=False)
    caution_rendue = BooleanField(default=False)

    # Dates système
    date_reservation = DateTimeField(default=datetime.utcnow)
    date_retour_effective = DateTimeField()

    meta = {
        'collection': 'rentals',
        'indexes': [
            'produit_id',
            'client_id',
            'vendeur_id',
            'statut',
            'date_debut',
            'date_fin',
            'date_reservation'
        ]
    }

    def __str__(self):
        return f"Location {self.nom_produit} - {self.date_debut.strftime('%d/%m/%Y')}"

    def calculer_prix_total(self):
        """Calculer le prix total de la location."""
        self.prix_total = self.prix_par_jour * self.nombre_jours
        return self.prix_total

    def est_active(self):
        """Vérifier si la location est actuellement active."""
        now = datetime.utcnow()
        return (
            self.statut == self.STATUT_EN_COURS and
            self.date_debut <= now <= self.date_fin
        )
