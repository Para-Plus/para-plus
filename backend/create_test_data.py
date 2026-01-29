"""
Script pour créer des données de test (catégories et produits).
À exécuter avec: python create_test_data.py
"""
import os
import sys
import django

# Configuration Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'paraplus.settings')
django.setup()

from apps.produits.models import Categorie, Produit
from apps.authentication.models import User


def create_categories():
    """Créer des catégories de test."""
    print("Création des catégories...")

    categories = [
        {
            'nom': 'Soins du visage',
            'slug': 'soins-visage',
            'description': 'Crèmes, sérums et soins pour le visage',
        },
        {
            'nom': 'Soins du corps',
            'slug': 'soins-corps',
            'description': 'Laits, huiles et soins pour le corps',
        },
        {
            'nom': 'Hygiène',
            'slug': 'hygiene',
            'description': 'Produits d\'hygiène quotidienne',
        },
        {
            'nom': 'Vitamines et compléments',
            'slug': 'vitamines-complements',
            'description': 'Vitamines, minéraux et compléments alimentaires',
        },
        {
            'nom': 'Matériel médical',
            'slug': 'materiel-medical',
            'description': 'Équipements et dispositifs médicaux',
        },
    ]

    created_categories = []
    for cat_data in categories:
        cat, created = Categorie.objects.get_or_create(
            slug=cat_data['slug'],
            defaults=cat_data
        )
        if created:
            print(f"  ✓ Catégorie créée: {cat.nom}")
        else:
            print(f"  - Catégorie existante: {cat.nom}")
        created_categories.append(cat)

    return created_categories


def create_products(categories):
    """Créer des produits de test."""
    print("\nCréation des produits...")

    # Trouver un vendeur ou utiliser un ID fictif
    vendeur = User.objects(role='vendeur').first()
    if not vendeur:
        print("  ⚠ Aucun vendeur trouvé. Création d'un vendeur de test...")
        vendeur = User(
            email='vendeur@test.com',
            prenom='Vendeur',
            nom='Test',
            role='vendeur',
            telephone='12345678',
            est_actif=True,
            email_verifie=True
        )
        vendeur.definir_mot_de_passe('Test123456!')
        vendeur.save()
        print(f"  ✓ Vendeur créé: {vendeur.email}")

    vendeur_id = str(vendeur.id)

    produits = [
        {
            'nom': 'Crème hydratante visage Bio',
            'slug': 'creme-hydratante-visage-bio',
            'description': 'Crème hydratante pour le visage à base d\'ingrédients naturels et bio. Convient à tous les types de peau.',
            'type_produit': 'parapharmacie',
            'prix': 45.50,
            'stock': 50,
            'categorie': categories[0],  # Soins du visage
            'vendeur_id': vendeur_id,
            'images': [
                'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500',
            ],
            'disponible_location': False,
            'est_en_vedette': True,
        },
        {
            'nom': 'Sérum vitamine C',
            'slug': 'serum-vitamine-c',
            'description': 'Sérum anti-âge enrichi en vitamine C pour un teint éclatant.',
            'type_produit': 'parapharmacie',
            'prix': 89.90,
            'stock': 30,
            'categorie': categories[0],  # Soins du visage
            'vendeur_id': vendeur_id,
            'images': [
                'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500',
            ],
            'disponible_location': False,
            'est_en_vedette': True,
        },
        {
            'nom': 'Lait corporel hydratant 400ml',
            'slug': 'lait-corporel-hydratant-400ml',
            'description': 'Lait corporel nourrissant pour une peau douce et hydratée toute la journée.',
            'type_produit': 'parapharmacie',
            'prix': 28.00,
            'stock': 100,
            'categorie': categories[1],  # Soins du corps
            'vendeur_id': vendeur_id,
            'images': [
                'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=500',
            ],
            'disponible_location': False,
            'est_en_vedette': False,
        },
        {
            'nom': 'Gel douche surgras',
            'slug': 'gel-douche-surgras',
            'description': 'Gel douche doux pour les peaux sensibles, sans savon.',
            'type_produit': 'parapharmacie',
            'prix': 15.50,
            'stock': 80,
            'categorie': categories[2],  # Hygiène
            'vendeur_id': vendeur_id,
            'images': [
                'https://images.unsplash.com/photo-1585501929877-a86a4893e3d0?w=500',
            ],
            'disponible_location': False,
            'est_en_vedette': False,
        },
        {
            'nom': 'Vitamine D3 1000 UI - 60 gélules',
            'slug': 'vitamine-d3-1000-ui-60-gelules',
            'description': 'Complément alimentaire de vitamine D3 pour renforcer le système immunitaire.',
            'type_produit': 'pharmacie',
            'prix': 35.00,
            'stock': 45,
            'categorie': categories[3],  # Vitamines
            'vendeur_id': vendeur_id,
            'images': [
                'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500',
            ],
            'disponible_location': False,
            'est_en_vedette': False,
        },
        {
            'nom': 'Tensiomètre électronique',
            'slug': 'tensiometre-electronique',
            'description': 'Tensiomètre automatique pour mesurer la tension artérielle à domicile.',
            'type_produit': 'medical',
            'prix': 120.00,
            'stock': 15,
            'categorie': categories[4],  # Matériel médical
            'vendeur_id': vendeur_id,
            'images': [
                'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=500',
            ],
            'disponible_location': True,
            'prix_location_jour': 8.00,
            'est_en_vedette': True,
        },
        {
            'nom': 'Fauteuil roulant pliable',
            'slug': 'fauteuil-roulant-pliable',
            'description': 'Fauteuil roulant léger et pliable pour faciliter les déplacements.',
            'type_produit': 'medical',
            'prix': 850.00,
            'stock': 5,
            'categorie': categories[4],  # Matériel médical
            'vendeur_id': vendeur_id,
            'images': [
                'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=500',
            ],
            'disponible_location': True,
            'prix_location_jour': 25.00,
            'est_en_vedette': False,
        },
    ]

    for prod_data in produits:
        prod, created = Produit.objects.get_or_create(
            slug=prod_data['slug'],
            defaults=prod_data
        )
        if created:
            print(f"  ✓ Produit créé: {prod.nom} ({prod.prix} TND)")
        else:
            print(f"  - Produit existant: {prod.nom}")

    print(f"\n✅ Total: {Produit.objects.count()} produits dans la base de données")


def main():
    """Fonction principale."""
    print("="*60)
    print("Création de données de test pour Para-plus")
    print("="*60 + "\n")

    try:
        categories = create_categories()
        create_products(categories)

        print("\n" + "="*60)
        print("✅ Données de test créées avec succès!")
        print("="*60)

    except Exception as e:
        print(f"\n❌ Erreur: {str(e)}")
        import traceback
        traceback.print_exc()


if __name__ == '__main__':
    main()
