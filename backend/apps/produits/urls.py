"""
URLs pour les produits et catégories.
"""
from django.urls import path
from . import views

app_name = 'produits'

urlpatterns = [
    # ========== PRODUITS ==========

    # Liste et recherche
    path('', views.liste_produits, name='liste'),

    # Gestion vendeur
    path('creer/', views.creer_produit, name='creer'),
    path('mes-produits/', views.mes_produits, name='mes_produits'),
    path('<str:produit_id>/modifier/', views.modifier_produit, name='modifier'),
    path('<str:produit_id>/supprimer/', views.supprimer_produit, name='supprimer'),

    # Upload d'images
    path('upload-image/', views.upload_image, name='upload_image'),

    # Détail et relations
    path('<str:slug>/', views.detail_produit, name='detail'),
    path('<str:produit_id>/similaires/', views.produits_similaires, name='similaires'),

    # ========== CATÉGORIES ==========

    path('categories/', views.liste_categories, name='categories'),
    path('categories/<str:slug>/', views.detail_categorie, name='detail_categorie'),
    path('categories/<str:categorie_id>/sous-categories/', views.sous_categories, name='sous_categories'),
]
