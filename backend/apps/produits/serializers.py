"""
Serializers pour les produits et catégories.
"""
from rest_framework import serializers
from rest_framework_mongoengine import serializers as mongo_serializers
from .models import Produit, Categorie


class CategorieSerializer(mongo_serializers.DocumentSerializer):
    """
    Serializer pour les catégories.
    """
    id = serializers.CharField(read_only=True)
    parent_nom = serializers.SerializerMethodField()
    sous_categories_count = serializers.SerializerMethodField()

    class Meta:
        model = Categorie
        fields = [
            'id', 'nom', 'slug', 'description', 'image',
            'parent', 'parent_nom', 'est_active', 'date_creation',
            'sous_categories_count'
        ]
        read_only_fields = ['date_creation']

    def get_parent_nom(self, obj):
        """Retourne le nom de la catégorie parente."""
        return obj.parent.nom if obj.parent else None

    def get_sous_categories_count(self, obj):
        """Retourne le nombre de sous-catégories."""
        return Categorie.objects(parent=obj).count()


class ProduitListSerializer(mongo_serializers.DocumentSerializer):
    """
    Serializer pour la liste des produits (version allégée).
    """
    id = serializers.CharField(read_only=True)
    categorie_nom = serializers.SerializerMethodField()
    image_principale = serializers.SerializerMethodField()
    est_disponible = serializers.SerializerMethodField()

    class Meta:
        model = Produit
        fields = [
            'id', 'nom', 'slug', 'description', 'type_produit',
            'prix', 'stock', 'categorie', 'categorie_nom',
            'image_principale', 'disponible_location', 'prix_location_jour',
            'est_actif', 'est_en_vedette', 'est_disponible',
            'date_creation', 'date_modification'
        ]

    def get_categorie_nom(self, obj):
        """Retourne le nom de la catégorie."""
        return obj.categorie.nom if obj.categorie else None

    def get_image_principale(self, obj):
        """Retourne la première image ou None."""
        return obj.images[0] if obj.images else None

    def get_est_disponible(self, obj):
        """Retourne si le produit est disponible."""
        return obj.est_disponible()


class ProduitDetailSerializer(mongo_serializers.DocumentSerializer):
    """
    Serializer pour le détail d'un produit (version complète).
    """
    id = serializers.CharField(read_only=True)
    categorie_info = CategorieSerializer(source='categorie', read_only=True)
    vendeur_nom = serializers.SerializerMethodField()
    est_disponible = serializers.SerializerMethodField()

    class Meta:
        model = Produit
        fields = [
            'id', 'nom', 'slug', 'description', 'type_produit',
            'prix', 'stock', 'categorie', 'categorie_info',
            'vendeur_id', 'vendeur_nom', 'images',
            'disponible_location', 'prix_location_jour',
            'est_actif', 'est_en_vedette', 'est_disponible',
            'date_creation', 'date_modification'
        ]

    def get_vendeur_nom(self, obj):
        """Retourne le nom du vendeur."""
        from apps.authentication.models import User
        try:
            vendeur = User.objects.get(id=obj.vendeur_id)
            return f"{vendeur.prenom} {vendeur.nom}"
        except User.DoesNotExist:
            return "Vendeur inconnu"

    def get_est_disponible(self, obj):
        """Retourne si le produit est disponible."""
        return obj.est_disponible()


class ProduitCreateUpdateSerializer(mongo_serializers.DocumentSerializer):
    """
    Serializer pour créer/modifier un produit.
    """
    id = serializers.CharField(read_only=True)

    class Meta:
        model = Produit
        fields = [
            'id', 'nom', 'slug', 'description', 'type_produit',
            'prix', 'stock', 'categorie', 'vendeur_id', 'images',
            'disponible_location', 'prix_location_jour',
            'est_actif', 'est_en_vedette'
        ]

    def validate_slug(self, value):
        """Valider l'unicité du slug."""
        instance = self.instance
        if instance:
            # Update: vérifier si le slug existe pour un autre produit
            if Produit.objects(slug=value, id__ne=instance.id).first():
                raise serializers.ValidationError("Ce slug existe déjà.")
        else:
            # Create: vérifier si le slug existe
            if Produit.objects(slug=value).first():
                raise serializers.ValidationError("Ce slug existe déjà.")
        return value

    def validate_prix(self, value):
        """Valider que le prix est positif."""
        if value < 0:
            raise serializers.ValidationError("Le prix doit être positif.")
        return value

    def validate_stock(self, value):
        """Valider que le stock est positif."""
        if value < 0:
            raise serializers.ValidationError("Le stock ne peut pas être négatif.")
        return value

    def validate(self, data):
        """Validation globale."""
        # Si disponible en location, le prix de location est requis
        if data.get('disponible_location') and not data.get('prix_location_jour'):
            raise serializers.ValidationError({
                'prix_location_jour': 'Le prix de location par jour est requis.'
            })
        return data
