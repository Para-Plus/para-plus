"""
Authentification Google OAuth 2.0
"""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from decouple import config
from datetime import datetime

from .models import User
from .serializers import UserSerializer, TokenSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def google_auth(request):
    """
    Authentification via Google OAuth.
    POST /api/auth/google/
    Body: { "credential": "google_token_id" }
    """
    token = request.data.get('credential')

    if not token:
        return Response({
            'error': 'Token Google manquant'
        }, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Récupérer le Client ID depuis les settings
        google_client_id = config('GOOGLE_CLIENT_ID', default='')

        if not google_client_id:
            return Response({
                'error': 'Configuration Google OAuth manquante'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Vérifier le token Google
        idinfo = id_token.verify_oauth2_token(
            token,
            google_requests.Request(),
            google_client_id
        )

        # Extraire les informations utilisateur
        google_id = idinfo['sub']
        email = idinfo['email']
        prenom = idinfo.get('given_name', '')
        nom = idinfo.get('family_name', '')
        photo_url = idinfo.get('picture', '')
        email_verifie = idinfo.get('email_verified', False)

        # Chercher si l'utilisateur existe déjà avec ce google_id
        user = User.objects(google_id=google_id).first()
        is_new_user = False

        if not user:
            # Vérifier si un compte avec cet email existe
            user = User.objects(email=email).first()

            if user:
                # Lier le compte Google au compte existant
                user.google_id = google_id
                user.photo_url = photo_url
                user.auth_provider = 'google'
                if email_verifie:
                    user.est_verifie = True
                user.save()
            else:
                # Créer un nouveau compte avec rôle temporaire 'client'
                # L'utilisateur devra choisir son rôle après la première connexion
                is_new_user = True
                user = User(
                    email=email,
                    google_id=google_id,
                    prenom=prenom or 'Utilisateur',
                    nom=nom or 'Google',
                    photo_url=photo_url,
                    auth_provider='google',
                    est_actif=True,
                    est_verifie=email_verifie,
                    role='client',  # Rôle par défaut, sera modifié lors du choix
                    mot_de_passe='',  # Pas de mot de passe pour OAuth
                )
                user.save()

        # Mettre à jour la dernière connexion
        user.derniere_connexion = datetime.utcnow()
        user.save()

        # Générer les tokens JWT
        token_serializer = TokenSerializer(data={'user': user})
        token_serializer.is_valid()
        token_data = token_serializer.create({'user': user})

        return Response({
            'message': 'Connexion Google réussie',
            'access': token_data['access'],
            'refresh': token_data['refresh'],
            'user': UserSerializer(user).data,
            'needs_role_selection': is_new_user  # Indique si l'utilisateur doit choisir son rôle
        }, status=status.HTTP_200_OK)

    except ValueError as e:
        # Token invalide
        return Response({
            'error': f'Token Google invalide: {str(e)}'
        }, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({
            'error': f'Erreur serveur: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
