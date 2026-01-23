"""
Modèle MongoDB pour le panier d'achat.
Collection: cart
"""
from mongoengine import (
    Document, StringField, FloatField, IntField,
    DateTimeField, EmbeddedDocument, EmbeddedDocumentListField
)
from datetime import datetime


class ArticlePanier(EmbeddedDocument):
    """
    Article dans le panier (embedded).
    """
    produit_id = StringField(required=True)
    nom_produit = StringField(required=True)
    quantite = IntField(required=True, min_value=1, default=1)
    prix_unitaire = FloatField(required=True, min_value=0)
    image_url = StringField()  # URL de l'image du produit

    def get_prix_total(self):
        """Calculer le prix total pour cet article."""
        return self.quantite * self.prix_unitaire

    def __str__(self):
        return f"{self.nom_produit} x{self.quantite}"


class Panier(Document):
    """
    Panier d'achat d'un utilisateur.
    Collection: cart
    """
    # Référence utilisateur
    client_id = StringField(required=True, unique=True)  # Un panier par client

    # Articles
    articles = EmbeddedDocumentListField(ArticlePanier, default=list)

    # Montant total
    montant_total = FloatField(default=0, min_value=0)

    # Dates
    date_creation = DateTimeField(default=datetime.utcnow)
    date_modification = DateTimeField(default=datetime.utcnow)

    meta = {
        'collection': 'cart',
        'indexes': [
            'client_id',
            'date_modification'
        ]
    }

    def __str__(self):
        return f"Panier client {self.client_id}"

    def calculer_montant_total(self):
        """Calculer le montant total du panier."""
        self.montant_total = sum(
            article.get_prix_total() for article in self.articles
        )
        return self.montant_total

    def ajouter_article(self, produit_id, nom_produit, quantite, prix_unitaire, image_url=None):
        """Ajouter un article au panier ou augmenter sa quantité."""
        # Chercher si l'article existe déjà
        for article in self.articles:
            if article.produit_id == produit_id:
                article.quantite += quantite
                self.date_modification = datetime.utcnow()
                self.calculer_montant_total()
                return self

        # Sinon, créer un nouvel article
        nouvel_article = ArticlePanier(
            produit_id=produit_id,
            nom_produit=nom_produit,
            quantite=quantite,
            prix_unitaire=prix_unitaire,
            image_url=image_url
        )
        self.articles.append(nouvel_article)
        self.date_modification = datetime.utcnow()
        self.calculer_montant_total()
        return self

    def retirer_article(self, produit_id):
        """Retirer un article du panier."""
        self.articles = [
            article for article in self.articles
            if article.produit_id != produit_id
        ]
        self.date_modification = datetime.utcnow()
        self.calculer_montant_total()
        return self

    def vider(self):
        """Vider le panier."""
        self.articles = []
        self.montant_total = 0
        self.date_modification = datetime.utcnow()
        return self

    def nombre_articles(self):
        """Obtenir le nombre total d'articles dans le panier."""
        return sum(article.quantite for article in self.articles)
