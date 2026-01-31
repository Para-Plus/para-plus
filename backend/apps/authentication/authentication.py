"""
Backend d'authentification JWT personnalisé pour MongoEngine
"""
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, AuthenticationFailed
from .models import User


class MongoJWTAuthentication(JWTAuthentication):
    """
    Authentification JWT personnalisée qui utilise MongoEngine au lieu de Django ORM.
    """

    def get_user(self, validated_token):
        """
        Récupérer l'utilisateur depuis MongoDB en utilisant le user_id du token JWT.
        """
        try:
            user_id = validated_token.get('user_id')
        except KeyError:
            raise InvalidToken('Token ne contient pas user_id')

        try:
            user = User.objects(id=user_id).first()
        except Exception:
            raise AuthenticationFailed('Utilisateur non trouvé')

        if user is None:
            raise AuthenticationFailed('Utilisateur non trouvé')

        if not user.est_actif:
            raise AuthenticationFailed('Utilisateur inactif')

        # Retourner le payload du token au lieu de l'objet utilisateur
        # car les views utilisent request.user.get('user_id')
        return validated_token
