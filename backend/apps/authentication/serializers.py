"""
Serializers pour l'authentification et les utilisateurs.
"""
from rest_framework import serializers
from .models import User
from rest_framework_simplejwt.tokens import RefreshToken


class UserSerializer(serializers.Serializer):
    """Serializer pour le modèle User (MongoEngine)."""
    id = serializers.SerializerMethodField()
    email = serializers.EmailField()
    nom = serializers.CharField(max_length=100)
    prenom = serializers.CharField(max_length=100)
    telephone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES, default=User.ROLE_CLIENT)
    adresse = serializers.CharField(required=False, allow_blank=True)
    ville = serializers.CharField(max_length=100, required=False, allow_blank=True)
    code_postal = serializers.CharField(max_length=10, required=False, allow_blank=True)
    est_actif = serializers.BooleanField(read_only=True)
    est_verifie = serializers.BooleanField(read_only=True)
    date_inscription = serializers.DateTimeField(read_only=True)
    photo_url = serializers.URLField(required=False, allow_blank=True, default='')
    auth_provider = serializers.CharField(default='email')

    def get_id(self, obj):
        """Convertir ObjectId MongoDB en string."""
        return str(obj.id)

    def create(self, validated_data):
        """Créer un nouvel utilisateur."""
        return User(**validated_data)

    def update(self, instance, validated_data):
        """Mettre à jour un utilisateur."""
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        return instance


class InscriptionSerializer(serializers.Serializer):
    """Serializer pour l'inscription d'un nouvel utilisateur."""
    email = serializers.EmailField()
    mot_de_passe = serializers.CharField(write_only=True, min_length=8)
    confirmation_mot_de_passe = serializers.CharField(write_only=True, min_length=8)
    nom = serializers.CharField(max_length=100)
    prenom = serializers.CharField(max_length=100)
    telephone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES, default=User.ROLE_CLIENT)

    def validate(self, data):
        """Valider les données d'inscription."""
        # Vérifier que les mots de passe correspondent
        if data['mot_de_passe'] != data['confirmation_mot_de_passe']:
            raise serializers.ValidationError({
                'confirmation_mot_de_passe': 'Les mots de passe ne correspondent pas.'
            })

        # Vérifier que l'email n'existe pas déjà
        if User.objects(email=data['email']).first():
            raise serializers.ValidationError({
                'email': 'Un utilisateur avec cet email existe déjà.'
            })

        return data

    def create(self, validated_data):
        """Créer un nouvel utilisateur avec mot de passe hashé."""
        # Retirer la confirmation du mot de passe
        validated_data.pop('confirmation_mot_de_passe')

        # Créer l'utilisateur
        user = User(
            email=validated_data['email'],
            nom=validated_data['nom'],
            prenom=validated_data['prenom'],
            telephone=validated_data.get('telephone', ''),
            role=validated_data.get('role', User.ROLE_CLIENT)
        )

        # Hasher le mot de passe
        user.definir_mot_de_passe(validated_data['mot_de_passe'])
        user.save()

        return user


class ConnexionSerializer(serializers.Serializer):
    """Serializer pour la connexion."""
    email = serializers.EmailField()
    mot_de_passe = serializers.CharField(write_only=True)

    def validate(self, data):
        """Valider les identifiants de connexion."""
        email = data.get('email')
        mot_de_passe = data.get('mot_de_passe')

        # Trouver l'utilisateur
        user = User.objects(email=email).first()

        if not user:
            raise serializers.ValidationError('Email ou mot de passe incorrect.')

        # Vérifier le mot de passe
        if not user.verifier_mot_de_passe(mot_de_passe):
            raise serializers.ValidationError('Email ou mot de passe incorrect.')

        # Vérifier que l'utilisateur est actif
        if not user.est_actif:
            raise serializers.ValidationError('Ce compte a été désactivé.')

        data['user'] = user
        return data


class TokenSerializer(serializers.Serializer):
    """Serializer pour les tokens JWT."""
    access = serializers.CharField(read_only=True)
    refresh = serializers.CharField(read_only=True)
    user = UserSerializer(read_only=True)

    def create(self, validated_data):
        """Générer les tokens JWT pour un utilisateur."""
        user = validated_data['user']

        # Générer les tokens
        refresh = RefreshToken()
        refresh['user_id'] = str(user.id)
        refresh['email'] = user.email
        refresh['role'] = user.role

        return {
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': user
        }
