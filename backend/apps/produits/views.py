"""
Views pour les produits et catégories.
"""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.utils.text import slugify
from .models import Produit, Categorie
from .serializers import (
    ProduitListSerializer, ProduitDetailSerializer,
    ProduitCreateUpdateSerializer, CategorieSerializer
)


class ProduitPagination(PageNumberPagination):
    """Pagination pour les produits."""
    page_size = 12
    page_size_query_param = 'page_size'
    max_page_size = 100


# ============================================================================
# PRODUITS - LISTE ET DÉTAIL
# ============================================================================

@api_view(['GET'])
@permission_classes([AllowAny])
def liste_produits(request):
    """
    Liste des produits avec filtres et recherche.

    Query params:
    - search: recherche dans nom et description
    - type: filtrer par type (parapharmacie, pharmacie, medical)
    - categorie: filtrer par ID de catégorie
    - min_prix: prix minimum
    - max_prix: prix maximum
    - disponible_location: filtrer produits disponibles en location (true/false)
    - est_en_vedette: filtrer produits en vedette (true/false)
    - vendeur_id: filtrer par vendeur
    - ordering: trier par (nom, prix, -prix, date_creation, -date_creation)
    """
    # Base query: seulement produits actifs
    queryset = Produit.objects(est_actif=True)

    # Filtres
    search = request.query_params.get('search', '').strip()
    if search:
        queryset = queryset.filter(
            __raw__={
                '$or': [
                    {'nom': {'$regex': search, '$options': 'i'}},
                    {'description': {'$regex': search, '$options': 'i'}}
                ]
            }
        )

    type_produit = request.query_params.get('type')
    if type_produit:
        queryset = queryset.filter(type_produit=type_produit)

    categorie_id = request.query_params.get('categorie')
    if categorie_id:
        try:
            queryset = queryset.filter(categorie=categorie_id)
        except:
            pass

    min_prix = request.query_params.get('min_prix')
    if min_prix:
        try:
            queryset = queryset.filter(prix__gte=float(min_prix))
        except ValueError:
            pass

    max_prix = request.query_params.get('max_prix')
    if max_prix:
        try:
            queryset = queryset.filter(prix__lte=float(max_prix))
        except ValueError:
            pass

    disponible_location = request.query_params.get('disponible_location')
    if disponible_location and disponible_location.lower() == 'true':
        queryset = queryset.filter(disponible_location=True)

    est_en_vedette = request.query_params.get('est_en_vedette')
    if est_en_vedette and est_en_vedette.lower() == 'true':
        queryset = queryset.filter(est_en_vedette=True)

    vendeur_id = request.query_params.get('vendeur_id')
    if vendeur_id:
        queryset = queryset.filter(vendeur_id=vendeur_id)

    # Tri
    ordering = request.query_params.get('ordering', '-date_creation')
    if ordering == 'nom':
        queryset = queryset.order_by('nom')
    elif ordering == 'prix':
        queryset = queryset.order_by('prix')
    elif ordering == '-prix':
        queryset = queryset.order_by('-prix')
    elif ordering == 'date_creation':
        queryset = queryset.order_by('date_creation')
    else:  # '-date_creation' par défaut
        queryset = queryset.order_by('-date_creation')

    # Pagination
    paginator = ProduitPagination()
    page = paginator.paginate_queryset(list(queryset), request)

    if page is not None:
        serializer = ProduitListSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)

    serializer = ProduitListSerializer(queryset, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def detail_produit(request, slug):
    """Détail d'un produit par slug."""
    try:
        produit = Produit.objects.get(slug=slug, est_actif=True)
    except Produit.DoesNotExist:
        return Response(
            {'error': 'Produit non trouvé'},
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = ProduitDetailSerializer(produit)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def produits_similaires(request, produit_id):
    """
    Retourne des produits similaires (même catégorie et type).
    Limite: 6 produits.
    """
    try:
        produit = Produit.objects.get(id=produit_id)
    except Produit.DoesNotExist:
        return Response(
            {'error': 'Produit non trouvé'},
            status=status.HTTP_404_NOT_FOUND
        )

    # Produits de la même catégorie et type, sauf le produit actuel
    produits_similaires = Produit.objects(
        categorie=produit.categorie,
        type_produit=produit.type_produit,
        est_actif=True,
        id__ne=produit.id
    ).limit(6)

    serializer = ProduitListSerializer(produits_similaires, many=True)
    return Response(serializer.data)


# ============================================================================
# PRODUITS - GESTION VENDEUR (CREATE, UPDATE, DELETE)
# ============================================================================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def creer_produit(request):
    """
    Créer un nouveau produit (vendeur uniquement).
    """
    # Vérifier que l'utilisateur est vendeur
    if request.user.role != 'vendeur':
        return Response(
            {'error': 'Seuls les vendeurs peuvent créer des produits'},
            status=status.HTTP_403_FORBIDDEN
        )

    # Ajouter le vendeur_id automatiquement
    data = request.data.copy()
    data['vendeur_id'] = str(request.user.id)

    # Générer le slug automatiquement si non fourni
    if 'slug' not in data or not data['slug']:
        data['slug'] = slugify(data.get('nom', ''))

    serializer = ProduitCreateUpdateSerializer(data=data)
    if serializer.is_valid():
        produit = serializer.save()
        # Retourner le détail complet
        detail_serializer = ProduitDetailSerializer(produit)
        return Response(detail_serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def modifier_produit(request, produit_id):
    """
    Modifier un produit (vendeur propriétaire uniquement).
    """
    try:
        produit = Produit.objects.get(id=produit_id)
    except Produit.DoesNotExist:
        return Response(
            {'error': 'Produit non trouvé'},
            status=status.HTTP_404_NOT_FOUND
        )

    # Vérifier que l'utilisateur est le vendeur propriétaire
    if str(produit.vendeur_id) != str(request.user.id):
        return Response(
            {'error': 'Vous n\'êtes pas autorisé à modifier ce produit'},
            status=status.HTTP_403_FORBIDDEN
        )

    # PATCH = mise à jour partielle, PUT = complète
    partial = request.method == 'PATCH'

    serializer = ProduitCreateUpdateSerializer(
        produit, data=request.data, partial=partial
    )
    if serializer.is_valid():
        produit = serializer.save()
        detail_serializer = ProduitDetailSerializer(produit)
        return Response(detail_serializer.data)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def supprimer_produit(request, produit_id):
    """
    Supprimer un produit (vendeur propriétaire uniquement).
    Soft delete: met est_actif à False au lieu de supprimer.
    """
    try:
        produit = Produit.objects.get(id=produit_id)
    except Produit.DoesNotExist:
        return Response(
            {'error': 'Produit non trouvé'},
            status=status.HTTP_404_NOT_FOUND
        )

    # Vérifier que l'utilisateur est le vendeur propriétaire
    if str(produit.vendeur_id) != str(request.user.id):
        return Response(
            {'error': 'Vous n\'êtes pas autorisé à supprimer ce produit'},
            status=status.HTTP_403_FORBIDDEN
        )

    # Soft delete
    produit.est_actif = False
    produit.save()

    return Response(
        {'message': 'Produit supprimé avec succès'},
        status=status.HTTP_200_OK
    )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def mes_produits(request):
    """
    Liste des produits du vendeur connecté (incluant inactifs).
    """
    if request.user.role != 'vendeur':
        return Response(
            {'error': 'Seuls les vendeurs peuvent accéder à cette ressource'},
            status=status.HTTP_403_FORBIDDEN
        )

    produits = Produit.objects(vendeur_id=str(request.user.id)).order_by('-date_creation')

    # Pagination
    paginator = ProduitPagination()
    page = paginator.paginate_queryset(list(produits), request)

    if page is not None:
        serializer = ProduitListSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)

    serializer = ProduitListSerializer(produits, many=True)
    return Response(serializer.data)


# ============================================================================
# CATÉGORIES
# ============================================================================

@api_view(['GET'])
@permission_classes([AllowAny])
def liste_categories(request):
    """
    Liste toutes les catégories actives.
    """
    categories = Categorie.objects(est_active=True).order_by('nom')
    serializer = CategorieSerializer(categories, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def detail_categorie(request, slug):
    """Détail d'une catégorie par slug."""
    try:
        categorie = Categorie.objects.get(slug=slug, est_active=True)
    except Categorie.DoesNotExist:
        return Response(
            {'error': 'Catégorie non trouvée'},
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = CategorieSerializer(categorie)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def sous_categories(request, categorie_id):
    """
    Retourne les sous-catégories d'une catégorie parente.
    """
    try:
        categorie_parent = Categorie.objects.get(id=categorie_id)
    except Categorie.DoesNotExist:
        return Response(
            {'error': 'Catégorie non trouvée'},
            status=status.HTTP_404_NOT_FOUND
        )

    sous_cats = Categorie.objects(parent=categorie_parent, est_active=True).order_by('nom')
    serializer = CategorieSerializer(sous_cats, many=True)
    return Response(serializer.data)


# ============================================================================
# UPLOAD D'IMAGES
# ============================================================================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_image(request):
    """
    Upload une image pour un produit.
    Retourne l'URL de l'image uploadée.

    Request: multipart/form-data avec file dans 'image'
    Response: { "url": "http://..." }
    """
    if request.user.role != 'vendeur':
        return Response(
            {'error': 'Seuls les vendeurs peuvent uploader des images'},
            status=status.HTTP_403_FORBIDDEN
        )

    # Vérifier qu'un fichier image est présent
    if 'image' not in request.FILES:
        return Response(
            {'error': 'Aucune image fournie'},
            status=status.HTTP_400_BAD_REQUEST
        )

    image_file = request.FILES['image']

    # Vérifier le type de fichier
    allowed_types = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
    if image_file.content_type not in allowed_types:
        return Response(
            {'error': 'Type de fichier non autorisé. Utilisez JPEG, PNG ou WebP.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Vérifier la taille du fichier (max 5MB)
    max_size = 5 * 1024 * 1024  # 5MB
    if image_file.size > max_size:
        return Response(
            {'error': 'Image trop volumineuse. Taille maximale: 5MB.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Importer les modules nécessaires
    import os
    from django.conf import settings
    from django.core.files.storage import default_storage
    from django.core.files.base import ContentFile
    import uuid

    # Générer un nom de fichier unique
    ext = os.path.splitext(image_file.name)[1]
    filename = f"produits/{uuid.uuid4()}{ext}"

    # Sauvegarder le fichier
    try:
        path = default_storage.save(filename, ContentFile(image_file.read()))
        # Construire l'URL complète
        image_url = request.build_absolute_uri(settings.MEDIA_URL + path)

        return Response(
            {'url': image_url},
            status=status.HTTP_201_CREATED
        )
    except Exception as e:
        return Response(
            {'error': f'Erreur lors de l\'upload: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
