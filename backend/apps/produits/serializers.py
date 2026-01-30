"""
Serializers pour les produits et catégories.
Utilise les serializers standards DRF (compatible toutes versions Python).
"""
from rest_framework import serializers
from .models import Produit, Categorie


class CategorieSerializer(serializers.Serializer):
    """
    Serializer pour les catégories.
    """
    id = serializers.SerializerMethodField()
    nom = serializers.CharField(max_length=100)
    slug = serializers.CharField()
    description = serializers.CharField(required=False, allow_blank=True, default='')
    image = serializers.URLField(required=False, allow_blank=True, default='')
    parent = serializers.SerializerMethodField()
    parent_nom = serializers.SerializerMethodField()
    est_active = serializers.BooleanField(default=True)
    date_creation = serializers.DateTimeField(read_only=True)
    sous_categories_count = serializers.SerializerMethodField()

    def get_id(self, obj):
        return str(obj.id)

    def get_parent(self, obj):
        return str(obj.parent.id) if obj.parent else None

    def get_parent_nom(self, obj):
        """Retourne le nom de la catégorie parente."""
        return obj.parent.nom if obj.parent else None

    def get_sous_categories_count(self, obj):
        """Retourne le nombre de sous-catégories."""
        return Categorie.objects(parent=obj).count()


class ProduitListSerializer(serializers.Serializer):
    """
    Serializer pour la liste des produits (version allégée).
    """
    id = serializers.SerializerMethodField()
    nom = serializers.CharField()
    slug = serializers.CharField()
    description = serializers.CharField()
    type_produit = serializers.CharField()
    prix = serializers.FloatField()
    stock = serializers.IntegerField()
    categorie = serializers.SerializerMethodField()
    categorie_nom = serializers.SerializerMethodField()
    image_principale = serializers.SerializerMethodField()
    disponible_location = serializers.BooleanField()
    prix_location_jour = serializers.FloatField(required=False, allow_null=True)
    est_actif = serializers.BooleanField()
    est_en_vedette = serializers.BooleanField()
    est_disponible = serializers.SerializerMethodField()
    date_creation = serializers.DateTimeField()
    date_modification = serializers.DateTimeField()

    def get_id(self, obj):
        return str(obj.id)

    def get_categorie(self, obj):
        return str(obj.categorie.id) if obj.categorie else None

    def get_categorie_nom(self, obj):
        """Retourne le nom de la catégorie."""
        return obj.categorie.nom if obj.categorie else None

    def get_image_principale(self, obj):
        """Retourne la première image ou None."""
        return obj.images[0] if obj.images else None

    def get_est_disponible(self, obj):
        """Retourne si le produit est disponible."""
        return obj.est_disponible()


class ProduitDetailSerializer(serializers.Serializer):
    """
    Serializer pour le détail d'un produit (version complète).
    """
    id = serializers.SerializerMethodField()
    nom = serializers.CharField()
    slug = serializers.CharField()
    description = serializers.CharField()
    type_produit = serializers.CharField()
    prix = serializers.FloatField()
    stock = serializers.IntegerField()
    categorie = serializers.SerializerMethodField()
    categorie_info = serializers.SerializerMethodField()
    vendeur_id = serializers.CharField()
    vendeur_nom = serializers.SerializerMethodField()
    images = serializers.ListField(child=serializers.URLField(), required=False, default=[])
    disponible_location = serializers.BooleanField()
    prix_location_jour = serializers.FloatField(required=False, allow_null=True)
    est_actif = serializers.BooleanField()
    est_en_vedette = serializers.BooleanField()
    est_disponible = serializers.SerializerMethodField()
    date_creation = serializers.DateTimeField()
    date_modification = serializers.DateTimeField()

    def get_id(self, obj):
        return str(obj.id)

    def get_categorie(self, obj):
        return str(obj.categorie.id) if obj.categorie else None

    def get_categorie_info(self, obj):
        """Retourne les infos complètes de la catégorie."""
        if obj.categorie:
            return CategorieSerializer(obj.categorie).data
        return None

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


class ProduitCreateUpdateSerializer(serializers.Serializer):
    """
    Serializer pour créer/modifier un produit.
    """
    id = serializers.CharField(read_only=True)
    nom = serializers.CharField(max_length=200)
    slug = serializers.CharField(required=False, allow_blank=True)
    description = serializers.CharField()
    type_produit = serializers.ChoiceField(choices=['parapharmacie', 'pharmacie', 'medical'])
    prix = serializers.FloatField(min_value=0)
    stock = serializers.IntegerField(min_value=0, default=0)
    categorie = serializers.CharField()
    vendeur_id = serializers.CharField(required=False)
    images = serializers.ListField(child=serializers.URLField(), required=False, default=[])
    disponible_location = serializers.BooleanField(default=False)
    prix_location_jour = serializers.FloatField(min_value=0, required=False, allow_null=True)
    est_actif = serializers.BooleanField(default=True)
    est_en_vedette = serializers.BooleanField(default=False)

    def validate_slug(self, value):
        """Valider l'unicité du slug."""
        instance = self.instance
        if instance:
            if Produit.objects(slug=value, id__ne=instance.id).first():
                raise serializers.ValidationError("Ce slug existe déjà.")
        else:
            if value and Produit.objects(slug=value).first():
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
        if data.get('disponible_location') and not data.get('prix_location_jour'):
            raise serializers.ValidationError({
                'prix_location_jour': 'Le prix de location par jour est requis.'
            })
        return data

    def create(self, validated_data):
        """Créer un nouveau produit."""
        categorie_id = validated_data.pop('categorie')
        try:
            categorie = Categorie.objects.get(id=categorie_id)
        except Categorie.DoesNotExist:
            raise serializers.ValidationError({'categorie': 'Catégorie non trouvée.'})

        validated_data['categorie'] = categorie
        produit = Produit(**validated_data)
        produit.save()
        return produit

    def update(self, instance, validated_data):
        """Mettre à jour un produit existant."""
        categorie_id = validated_data.pop('categorie', None)
        if categorie_id:
            try:
                instance.categorie = Categorie.objects.get(id=categorie_id)
            except Categorie.DoesNotExist:
                raise serializers.ValidationError({'categorie': 'Catégorie non trouvée.'})

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance
