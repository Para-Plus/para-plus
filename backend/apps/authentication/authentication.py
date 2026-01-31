"""
Backend d'authentification JWT personnalisé pour MongoEngine
"""
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, AuthenticationFailed
from .models import User


class TokenUser:
    """
    Classe pour encapsuler le payload du token JWT.
    Permet d'utiliser request.user.get('user_id') dans les views.
    """
    def __init__(self, token_payload):
        self.token_payload = token_payload
        self.is_authenticated = True

    def get(self, key, default=None):
        """Permet d'utiliser request.user.get('user_id')"""
        return self.token_payload.get(key, default)

    def __getitem__(self, key):
        """Permet d'utiliser request.user['user_id']"""
        return self.token_payload[key]

    def __str__(self):
        return f"TokenUser({self.token_payload.get('email', 'unknown')})"


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
        except Exception as e:
            print(f"ERROR MongoJWTAuthentication - Exception lors de la recherche de l'utilisateur: {str(e)}")
            raise AuthenticationFailed('Utilisateur non trouvé')

        if user is None:
            print(f"ERROR MongoJWTAuthentication - Utilisateur non trouvé pour user_id: {user_id}")
            raise AuthenticationFailed('Utilisateur non trouvé')

        if not user.est_actif:
            print(f"ERROR MongoJWTAuthentication - Utilisateur inactif: {user_id}")
            raise AuthenticationFailed('Utilisateur inactif')

        # Retourner un objet TokenUser qui encapsule le payload du token
        # car les views utilisent request.user.get('user_id')
        return TokenUser(validated_token)
