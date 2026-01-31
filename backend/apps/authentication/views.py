"""
Views pour l'authentification et la gestion des utilisateurs.
"""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import datetime

from .models import User
from .serializers import (
    UserSerializer,
    InscriptionSerializer,
    ConnexionSerializer,
    TokenSerializer
)


@api_view(['POST'])
@permission_classes([AllowAny])
def inscription(request):
    """
    Inscription d'un nouvel utilisateur.
    POST /api/auth/inscription/
    """
    serializer = InscriptionSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.save()

        # Générer les tokens JWT
        token_serializer = TokenSerializer(data={'user': user})
        token_serializer.is_valid()
        token_data = token_serializer.create({'user': user})

        return Response({
            'message': 'Inscription réussie',
            'access': token_data['access'],
            'refresh': token_data['refresh'],
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def connexion(request):
    """
    Connexion d'un utilisateur.
    POST /api/auth/connexion/
    """
    serializer = ConnexionSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.validated_data['user']

        # Mettre à jour la dernière connexion
        user.derniere_connexion = datetime.utcnow()
        user.save()

        # Générer les tokens JWT
        token_serializer = TokenSerializer(data={'user': user})
        token_serializer.is_valid()
        token_data = token_serializer.create({'user': user})

        return Response({
            'message': 'Connexion réussie',
            'access': token_data['access'],
            'refresh': token_data['refresh'],
            'user': UserSerializer(user).data
        }, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def deconnexion(request):
    """
    Déconnexion d'un utilisateur (blacklist du refresh token).
    POST /api/auth/deconnexion/
    """
    try:
        refresh_token = request.data.get('refresh')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()

        return Response({
            'message': 'Déconnexion réussie'
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'error': 'Token invalide'
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profil(request):
    """
    Obtenir le profil de l'utilisateur connecté.
    GET /api/auth/profil/
    """
    # Récupérer l'ID utilisateur depuis le token JWT
    user_id = request.user.get('user_id')

    if not user_id:
        return Response({
            'error': 'Utilisateur non trouvé'
        }, status=status.HTTP_404_NOT_FOUND)

    user = User.objects(id=user_id).first()

    if not user:
        return Response({
            'error': 'Utilisateur non trouvé'
        }, status=status.HTTP_404_NOT_FOUND)

    serializer = UserSerializer(user)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def modifier_profil(request):
    """
    Modifier le profil de l'utilisateur connecté.
    PUT/PATCH /api/auth/profil/modifier/
    """
    user_id = request.user.get('user_id')
    user = User.objects(id=user_id).first()

    if not user:
        return Response({
            'error': 'Utilisateur non trouvé'
        }, status=status.HTTP_404_NOT_FOUND)

    serializer = UserSerializer(user, data=request.data, partial=True)

    if serializer.is_valid():
        updated_user = serializer.update(user, serializer.validated_data)
        updated_user.save()

        return Response({
            'message': 'Profil mis à jour avec succès',
            'user': UserSerializer(updated_user).data
        }, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def changer_mot_de_passe(request):
    """
    Changer le mot de passe de l'utilisateur connecté.
    POST /api/auth/changer-mot-de-passe/
    """
    user_id = request.user.get('user_id')
    user = User.objects(id=user_id).first()

    if not user:
        return Response({
            'error': 'Utilisateur non trouvé'
        }, status=status.HTTP_404_NOT_FOUND)

    ancien_mot_de_passe = request.data.get('ancien_mot_de_passe')
    nouveau_mot_de_passe = request.data.get('nouveau_mot_de_passe')

    # Vérifier l'ancien mot de passe
    if not user.verifier_mot_de_passe(ancien_mot_de_passe):
        return Response({
            'error': 'Ancien mot de passe incorrect'
        }, status=status.HTTP_400_BAD_REQUEST)

    # Valider le nouveau mot de passe
    if len(nouveau_mot_de_passe) < 8:
        return Response({
            'error': 'Le nouveau mot de passe doit contenir au moins 8 caractères'
        }, status=status.HTTP_400_BAD_REQUEST)

    # Changer le mot de passe
    user.definir_mot_de_passe(nouveau_mot_de_passe)
    user.save()

    return Response({
        'message': 'Mot de passe modifié avec succès'
    }, status=status.HTTP_200_OK)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def choisir_role(request):
    """
    Choisir le rôle de l'utilisateur (client ou vendeur).
    Utilisé après la première connexion Google.
    PATCH /api/auth/choisir-role/
    Body: { "role": "client" | "vendeur" }
    """
    user_id = request.user.get('user_id')
    user = User.objects(id=user_id).first()

    if not user:
        return Response({
            'error': 'Utilisateur non trouvé'
        }, status=status.HTTP_404_NOT_FOUND)

    role = request.data.get('role')

    # Valider le rôle
    if role not in ['client', 'vendeur']:
        return Response({
            'error': 'Rôle invalide. Choisissez "client" ou "vendeur".'
        }, status=status.HTTP_400_BAD_REQUEST)

    # Mettre à jour le rôle
    user.role = role
    user.save()

    return Response({
        'message': 'Rôle choisi avec succès',
        'user': UserSerializer(user).data
    }, status=status.HTTP_200_OK)
